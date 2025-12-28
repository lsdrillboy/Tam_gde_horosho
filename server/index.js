require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const https = require("https");
const { verifyInitData, sendTelegramMessage } = require("./telegram");
const { buildMessage } = require("./messages");
const { startBotPolling } = require("./bot");
const { ROOT_DIR, contentFiles, readJson, loadContent } = require("./content");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

const config = {
  port: Number(process.env.PORT || 3000),
  botToken: process.env.BOT_TOKEN || "",
  adminChatId: process.env.ADMIN_CHAT_ID || "",
  initDataRequired: process.env.INIT_DATA_REQUIRED === "true",
  initDataMaxAgeSec: Number(process.env.INIT_DATA_MAX_AGE_SEC || 86400),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 30000),
  dryRun: process.env.DRY_RUN === "true",
  mediaPublicKey: process.env.YA_PUBLIC_KEY || "https://disk.yandex.ru/d/SCLYhUZIUEitcw"
};

const LOG_DIR = path.join(ROOT_DIR, "logs");

const rateLimits = new Map();

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

app.get("/api/content/all", (req, res) => {
  const payload = {};
  for (const [key, fileName] of Object.entries(contentFiles)) {
    payload[key] = readJson(fileName);
  }
  res.json(payload);
});

app.get("/api/content/:section", (req, res) => {
  const section = req.params.section;
  const fileName = contentFiles[section];
  if (!fileName) {
    res.status(404).json({ status: "error", message: "Unknown section" });
    return;
  }
  res.json(readJson(fileName));
});

app.post("/api/requests/:type", async (req, res) => {
  const type = req.params.type;
  if (!isSupportedType(type)) {
    res.status(404).json({ status: "error", message: "Unknown request type" });
    return;
  }

  const payload = req.body || {};
  const initDataRaw = req.get("x-telegram-init-data") || "";
  const initDataResult = initDataRaw
    ? verifyInitData(initDataRaw, config.botToken, config.initDataMaxAgeSec)
    : { valid: false, reason: "missing_init_data" };
  const userId =
    req.get("x-telegram-user-id") ||
    (initDataResult.user ? String(initDataResult.user.id || "") : "") ||
    "";

  if (config.initDataRequired && !initDataResult.valid) {
    res.status(401).json({ status: "error", message: "Invalid initData" });
    return;
  }

  const rateKey = userId ? `tg:${userId}` : `ip:${req.ip}`;
  if (!checkRateLimit(rateKey, config.rateLimitWindowMs)) {
    res.status(429).json({ status: "error", message: "Too many requests" });
    return;
  }

  const validation = validateRequest(type, payload);
  if (!validation.valid) {
    res.status(400).json({ status: "error", errors: validation.errors });
    return;
  }

  const content = loadContent();
  const message = buildMessage(type, payload, content);
  const requestId = buildRequestId(type);

  try {
    if (!config.botToken || !config.adminChatId) {
      if (!config.dryRun) {
        throw new Error("BOT_TOKEN or ADMIN_CHAT_ID is missing");
      }
    }

    if (!config.dryRun) {
      await sendTelegramMessage({
        botToken: config.botToken,
        chatId: config.adminChatId,
        text: message
      });
    }

    logDelivery({
      requestId,
      type,
      userId: userId || null,
      status: "success",
      error: null
    });

    res.json({ status: "ok", requestId, message: "Заявка принята" });
  } catch (error) {
    logDelivery({
      requestId,
      type,
      userId: userId || null,
      status: "error",
      error: error.message
    });

    res.status(500).json({ status: "error", message: "Delivery failed" });
  }
});

app.get("/api/media", async (req, res) => {
  const mediaPath = String(req.query.path || "");
  if (!isValidMediaPath(mediaPath)) {
    res.status(400).json({ status: "error", message: "Invalid media path" });
    return;
  }

  try {
    const downloadUrl = await getYandexDownloadUrl(config.mediaPublicKey, mediaPath);
    if (!downloadUrl) {
      res.status(404).json({ status: "error", message: "Media not found" });
      return;
    }
    streamRemoteMedia(downloadUrl, req, res);
  } catch (error) {
    res.status(502).json({ status: "error", message: "Media proxy failed" });
  }
});

app.use(express.static(ROOT_DIR));

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  startBotPolling({
    enabled: process.env.BOT_POLLING === "true",
    botToken: config.botToken,
    webAppUrl: process.env.WEB_APP_URL || "",
    dropPending: process.env.BOT_DROP_PENDING === "true",
    deleteWebhook: process.env.BOT_DELETE_WEBHOOK === "true",
    setMenuButton: process.env.BOT_SET_MENU_BUTTON === "true",
    menuButtonText: process.env.BOT_MENU_BUTTON_TEXT || "Открыть Mini App",
    pollIntervalMs: Number(process.env.BOT_POLL_INTERVAL_MS || 2000)
  });
});

function isSupportedType(type) {
  return ["dates", "room", "service", "master", "accommodation", "practices", "turnkey", "shop"].includes(type);
}

function checkRateLimit(key, windowMs) {
  const now = Date.now();
  const last = rateLimits.get(key) || 0;
  if (now - last < windowMs) {
    return false;
  }
  rateLimits.set(key, now);
  return true;
}

function buildRequestId(type) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 6);
  return `req_${type}_${stamp}_${rand}`;
}

function validateRequest(type, payload) {
  const errors = [];
  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const telegram = String(payload.telegram || "").trim();

  if (!name) {
    errors.push("Введите имя.");
  }
  if (!phone && !telegram) {
    errors.push("Нужен телефон или Telegram username.");
  }

  if (type === "accommodation" || type === "turnkey") {
    if (!payload.dateFrom || !payload.dateTo) {
      errors.push("Укажите даты.");
    }
    if (!payload.guestsCount) {
      errors.push("Укажите количество гостей.");
    }
  }

  if (type === "dates") {
    if (!payload.preferredDates) {
      errors.push("Укажите предпочтительные даты.");
    }
    if (!payload.requesterType) {
      errors.push("Укажите формат запроса.");
    }
    if (!payload.groupSize) {
      errors.push("Укажите количество людей или групп.");
    }
  }

  if (type === "room") {
    if (!payload.roomId) {
      errors.push("Укажите тип размещения.");
    }
    if (!payload.preferredDates) {
      errors.push("Укажите предпочтительные даты.");
    }
    if (!payload.guestsCount) {
      errors.push("Укажите количество гостей.");
    }
  }

  if (type === "service") {
    if (!payload.serviceId) {
      errors.push("Укажите услугу.");
    }
    if (!payload.preferredDates) {
      errors.push("Укажите предпочтительные даты.");
    }
  }

  if (type === "master") {
    if (!payload.masterId) {
      errors.push("Укажите мастера.");
    }
    if (!payload.preferredDates) {
      errors.push("Укажите предпочтительные даты.");
    }
  }

  if (type === "accommodation") {
    if (!payload.requesterType) {
      errors.push("Укажите, кто запрашивает.");
    }
  }

  if (type === "practices") {
    if (!payload.datesOrDays) {
      errors.push("Укажите даты или дни практик.");
    }
    if (!payload.participantsCount) {
      errors.push("Укажите количество участников.");
    }
    if (!Array.isArray(payload.practiceIds) || payload.practiceIds.length === 0) {
      errors.push("Выберите практики.");
    }
  }

  if (type === "turnkey") {
    if (!Array.isArray(payload.interests) || payload.interests.length === 0) {
      errors.push("Укажите интересующие пункты.");
    }
  }

  if (payload.dateFrom && payload.dateTo) {
    const start = new Date(`${payload.dateFrom}T00:00:00`);
    const end = new Date(`${payload.dateTo}T00:00:00`);
    if (end < start) {
      errors.push("Дата выезда должна быть позже даты заезда.");
    }
  }

  return { valid: errors.length === 0, errors };
}

function isValidMediaPath(pathValue) {
  if (!pathValue || typeof pathValue !== "string") return false;
  if (!pathValue.startsWith("/")) return false;
  if (pathValue.includes("..") || pathValue.includes("\\")) return false;
  return /\.(mp4|mov)$/i.test(pathValue);
}

function getYandexDownloadUrl(publicKey, pathValue) {
  return new Promise((resolve, reject) => {
    const apiUrl = new URL("https://cloud-api.yandex.net/v1/disk/public/resources/download");
    apiUrl.searchParams.set("public_key", publicKey);
    apiUrl.searchParams.set("path", pathValue);

    https
      .get(apiUrl, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(`Yandex API status ${response.statusCode}`));
            return;
          }
          try {
            const payload = JSON.parse(body);
            resolve(payload.href || "");
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

function streamRemoteMedia(url, req, res, redirects = 0) {
  if (redirects > 4) {
    res.status(502).end();
    return;
  }

  const requestUrl = new URL(url);
  const options = {
    method: req.method,
    headers: {}
  };

  if (req.headers.range) {
    options.headers.Range = req.headers.range;
  }

  const proxy = https.request(requestUrl, options, (response) => {
    const status = response.statusCode || 500;
    if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
      response.resume();
      streamRemoteMedia(response.headers.location, req, res, redirects + 1);
      return;
    }

    res.status(status);
    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    }
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    if (response.headers["content-range"]) {
      res.setHeader("Content-Range", response.headers["content-range"]);
    }
    if (response.headers["accept-ranges"]) {
      res.setHeader("Accept-Ranges", response.headers["accept-ranges"]);
    }
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");

    if (req.method === "HEAD") {
      response.resume();
      res.end();
      return;
    }

    response.pipe(res);
  });

  proxy.on("error", () => {
    if (!res.headersSent) {
      res.status(502).end();
      return;
    }
    res.end();
  });
  proxy.end();
}

function logDelivery({ requestId, type, userId, status, error }) {
  const entry = {
    timestamp: new Date().toISOString(),
    requestId,
    type,
    telegramUserId: userId,
    status,
    error
  };
  const line = `${JSON.stringify(entry)}\n`;
  fs.appendFileSync(path.join(LOG_DIR, "requests.log"), line, "utf8");
}
