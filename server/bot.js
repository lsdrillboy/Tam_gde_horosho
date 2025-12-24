const { getUpdates, sendTelegramMessage, deleteWebhook, setChatMenuButton, setMyCommands } = require("./telegram");
const { loadContent } = require("./content");

function buildStartMessage(webAppUrl, content) {
  const lines = [
    content.app.signature,
    content.app.tagline,
    content.app.intro
  ].filter(Boolean);
  const text = lines.join("\n");

  if (!webAppUrl) {
    return {
      text: `${text}\n\nСсылка на Mini App не настроена.`
    };
  }

  return {
    text,
    replyMarkup: {
      keyboard: [[{ text: "Открыть Mini App", web_app: { url: webAppUrl } }]],
      resize_keyboard: true
    }
  };
}

async function handleUpdate(update, config, content) {
  if (!update.message) return;
  const message = update.message;
  const chatId = message.chat?.id;
  if (!chatId) return;

  const text = String(message.text || "").trim();
  if (!text) return;

  if (text.startsWith("/start") || text.startsWith("/app") || text.startsWith("/menu")) {
    const payload = buildStartMessage(config.webAppUrl, content);
    await sendTelegramMessage({
      botToken: config.botToken,
      chatId,
      text: payload.text,
      replyMarkup: payload.replyMarkup
    });
  }
}

async function maybeSetupMenu(config) {
  if (!config.webAppUrl || !config.setMenuButton) return;
  await setChatMenuButton({
    botToken: config.botToken,
    menuButton: {
      type: "web_app",
      text: config.menuButtonText,
      web_app: { url: config.webAppUrl }
    }
  });

  await setMyCommands({
    botToken: config.botToken,
    commands: [
      { command: "start", description: "Открыть Mini App" },
      { command: "app", description: "Получить кнопку приложения" }
    ]
  });
}

async function startBotPolling(config) {
  if (!config.enabled) return;
  if (!config.botToken) {
    console.warn("BOT_POLLING enabled, but BOT_TOKEN is missing.");
    return;
  }

  if (config.deleteWebhook) {
    try {
      await deleteWebhook({ botToken: config.botToken });
    } catch (error) {
      console.warn("Failed to delete webhook:", error.message);
    }
  }

  try {
    await maybeSetupMenu(config);
  } catch (error) {
    console.warn("Failed to set menu button:", error.message);
  }

  const content = loadContent();
  let offset = 0;

  if (config.dropPending) {
    try {
      const warmup = await getUpdates({ botToken: config.botToken, offset: 0, timeout: 0 });
      if (warmup.result?.length) {
        const last = warmup.result[warmup.result.length - 1];
        offset = last.update_id + 1;
      }
    } catch (error) {
      console.warn("Failed to drop pending updates:", error.message);
    }
  }

  let polling = false;
  const interval = config.pollIntervalMs || 2000;

  async function poll() {
    if (polling) return;
    polling = true;
    try {
      const response = await getUpdates({
        botToken: config.botToken,
        offset,
        timeout: 0,
        allowedUpdates: ["message"]
      });

      const updates = response.result || [];
      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(update, config, content);
      }
    } catch (error) {
      console.warn("Polling error:", error.message);
    } finally {
      polling = false;
      setTimeout(poll, interval);
    }
  }

  poll();
  console.log("Bot polling started.");
}

module.exports = {
  startBotPolling
};
