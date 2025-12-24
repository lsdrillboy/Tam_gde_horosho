const { sendTelegramMessage } = require("../../lib/telegram");
const { loadContent } = require("../../lib/content");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const secret = process.env.WEBHOOK_SECRET || "";
  const incomingSecret = String(req.headers["x-telegram-bot-api-secret-token"] || "");
  if (secret && incomingSecret !== secret) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const update = parseBody(req);
  const message = update?.message;
  const text = String(message?.text || "").trim();
  const chatId = message?.chat?.id;

  if (chatId && isStartCommand(text)) {
    const botToken = process.env.BOT_TOKEN || "";
    const webAppUrl = process.env.WEB_APP_URL || "";
    const content = loadContent();
    const response = buildStartPayload(webAppUrl, content);

    try {
      await sendTelegramMessage({
        botToken,
        chatId,
        text: response.text,
        replyMarkup: response.replyMarkup
      });
    } catch (error) {
      console.error("Failed to respond to /start:", error.message);
    }
  }

  res.status(200).json({ status: "ok" });
};

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

function isStartCommand(text) {
  if (!text) return false;
  return text.startsWith("/start") || text.startsWith("/app") || text.startsWith("/menu");
}

function buildStartPayload(webAppUrl, content) {
  const lines = [content.app.signature, content.app.tagline, content.app.intro].filter(Boolean);
  const text = lines.join("\n");

  if (!webAppUrl) {
    return { text: `${text}\n\nСсылка на Mini App не настроена.` };
  }

  return {
    text,
    replyMarkup: {
      keyboard: [[{ text: "Открыть Mini App", web_app: { url: webAppUrl } }]],
      resize_keyboard: true
    }
  };
}
