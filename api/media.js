const https = require("https");

const MEDIA_PUBLIC_KEY = process.env.YA_PUBLIC_KEY || "https://disk.yandex.ru/d/SCLYhUZIUEitcw";

module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end("Method not allowed");
    return;
  }

  const requestUrl = new URL(req.url, "http://localhost");
  const mediaPath = requestUrl.searchParams.get("path") || "";

  if (!isValidMediaPath(mediaPath)) {
    res.statusCode = 400;
    res.end("Invalid media path");
    return;
  }

  try {
    const downloadUrl = await getYandexDownloadUrl(MEDIA_PUBLIC_KEY, mediaPath);
    if (!downloadUrl) {
      res.statusCode = 404;
      res.end("Media not found");
      return;
    }
    streamRemoteMedia(downloadUrl, req, res);
  } catch (error) {
    res.statusCode = 502;
    res.end("Media proxy failed");
  }
};

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
    res.statusCode = 502;
    res.end("Too many redirects");
    return;
  }

  const target = new URL(url);
  const options = {
    method: req.method,
    headers: {}
  };

  if (req.headers.range) {
    options.headers.Range = req.headers.range;
  }

  const proxy = https.request(target, options, (response) => {
    const status = response.statusCode || 500;
    if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
      response.resume();
      streamRemoteMedia(response.headers.location, req, res, redirects + 1);
      return;
    }

    res.statusCode = status;
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
      res.statusCode = 502;
    }
    res.end("Media proxy failed");
  });
  proxy.end();
}
