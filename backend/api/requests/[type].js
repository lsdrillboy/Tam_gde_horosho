const { buildMessage } = require("../../lib/messages");
const { loadContent } = require("../../lib/content");
const { verifyInitData, sendTelegramMessage } = require("../../lib/telegram");
const { checkRateLimit } = require("../../lib/rate-limit");

const SUPPORTED_TYPES = [
  "dates",
  "room",
  "service",
  "master",
  "accommodation",
  "practices",
  "turnkey",
  "shop"
];

module.exports = async (req, res) => {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;
  if (!SUPPORTED_TYPES.includes(type)) {
    res.status(404).json({ status: "error", message: "Unknown request type" });
    return;
  }

  const payload = parseBody(req);
  const botToken = process.env.BOT_TOKEN || "";
  const adminChatId = process.env.ADMIN_CHAT_ID || "";

  const initDataRaw = String(req.headers["x-telegram-init-data"] || "");
  const initDataResult = initDataRaw
    ? verifyInitData(initDataRaw, botToken, Number(process.env.INIT_DATA_MAX_AGE_SEC || 86400))
    : { valid: false, reason: "missing_init_data" };

  const userId =
    String(req.headers["x-telegram-user-id"] || "") ||
    (initDataResult.user ? String(initDataResult.user.id || "") : "") ||
    "";

  if (process.env.INIT_DATA_REQUIRED === "true" && !initDataResult.valid) {
    res.status(401).json({ status: "error", message: "Invalid initData" });
    return;
  }

  const rateKey = userId ? `tg:${userId}` : `ip:${getIp(req)}`;
  if (!checkRateLimit(rateKey, Number(process.env.RATE_LIMIT_WINDOW_MS || 30000))) {
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
    if (!botToken || !adminChatId) {
      throw new Error("BOT_TOKEN or ADMIN_CHAT_ID is missing");
    }

    await sendTelegramMessage({
      botToken,
      chatId: adminChatId,
      text: message
    });

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        requestId,
        type,
        telegramUserId: userId || null,
        status: "success"
      })
    );

    res.json({ status: "ok", requestId, message: "Заявка принята" });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        requestId,
        type,
        telegramUserId: userId || null,
        status: "error",
        error: error.message
      })
    );

    res.status(500).json({ status: "error", message: "Delivery failed" });
  }
};

function applyCors(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-telegram-init-data, x-telegram-user-id"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
  if (origin !== "*") {
    res.setHeader("Vary", "Origin");
  }
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }
  return req.body;
}

function getIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
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

  if (type === "accommodation" || type === "turnkey") {
    if (!payload.dateFrom || !payload.dateTo) {
      errors.push("Укажите даты.");
    }
    if (!payload.guestsCount) {
      errors.push("Укажите количество гостей.");
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
