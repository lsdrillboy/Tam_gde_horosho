const { setWebhook, setChatMenuButton, setMyCommands } = require("../../lib/telegram");

module.exports = async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const adminToken = process.env.ADMIN_TOKEN || "";
  const incomingToken = String(req.headers["x-admin-token"] || req.query.token || "");
  if (adminToken && incomingToken !== adminToken) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const botToken = process.env.BOT_TOKEN || "";
  if (!botToken) {
    res.status(400).json({ status: "error", message: "BOT_TOKEN is missing" });
    return;
  }

  const baseUrl =
    process.env.BACKEND_BASE_URL ||
    process.env.WEBHOOK_URL ||
    `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;

  try {
    await setWebhook({
      botToken,
      url: webhookUrl,
      secretToken: process.env.WEBHOOK_SECRET || undefined,
      dropPendingUpdates: true,
      allowedUpdates: ["message"]
    });

    if (process.env.WEB_APP_URL) {
      await setChatMenuButton({
        botToken,
        menuButton: {
          type: "web_app",
          text: process.env.BOT_MENU_BUTTON_TEXT || "Открыть Mini App",
          web_app: { url: process.env.WEB_APP_URL }
        }
      });

      await setMyCommands({
        botToken,
        commands: [
          { command: "start", description: "Открыть Mini App" },
          { command: "app", description: "Получить кнопку приложения" }
        ]
      });
    }

    res.json({ status: "ok", webhookUrl });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
