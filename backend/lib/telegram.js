const crypto = require("crypto");

function parseInitData(initDataRaw) {
  const params = new URLSearchParams(initDataRaw);
  const data = {};
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
  return data;
}

function verifyInitData(initDataRaw, botToken, maxAgeSec) {
  if (!initDataRaw) {
    return { valid: false, reason: "missing_init_data" };
  }
  if (!botToken) {
    return { valid: false, reason: "missing_bot_token" };
  }

  const data = parseInitData(initDataRaw);
  const hash = data.hash;
  if (!hash) {
    return { valid: false, reason: "missing_hash" };
  }

  const dataCheckString = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) {
    return { valid: false, reason: "hash_mismatch" };
  }

  const authDate = Number(data.auth_date || 0);
  if (authDate && maxAgeSec) {
    const age = Math.floor(Date.now() / 1000) - authDate;
    if (age > maxAgeSec) {
      return { valid: false, reason: "expired" };
    }
  }

  let user = null;
  if (data.user) {
    try {
      user = JSON.parse(data.user);
    } catch (error) {
      return { valid: false, reason: "invalid_user_json" };
    }
  }

  return { valid: true, data, user };
}

async function sendTelegramMessage({ botToken, chatId, text, replyMarkup }) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function setWebhook({ botToken, url, secretToken, dropPendingUpdates, allowedUpdates }) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
  const payload = {
    url,
    drop_pending_updates: Boolean(dropPendingUpdates)
  };
  if (secretToken) payload.secret_token = secretToken;
  if (allowedUpdates) payload.allowed_updates = allowedUpdates;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function setChatMenuButton({ botToken, menuButton }) {
  const url = `https://api.telegram.org/bot${botToken}/setChatMenuButton`;
  const payload = { menu_button: menuButton };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function setMyCommands({ botToken, commands }) {
  const url = `https://api.telegram.org/bot${botToken}/setMyCommands`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

module.exports = {
  parseInitData,
  verifyInitData,
  sendTelegramMessage,
  setWebhook,
  setChatMenuButton,
  setMyCommands
};
