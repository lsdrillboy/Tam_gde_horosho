const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");

function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function loadContent() {
  const appData = readJson("app.json");
  return {
    app: appData.app,
    accommodation: readJson("accommodation.json"),
    services: readJson("services.json"),
    masters: readJson("masters.json"),
    practices: readJson("practices.json"),
    kitchen: readJson("kitchen.json"),
    shop: readJson("shop.json"),
    forms: readJson("forms.json")
  };
}

module.exports = {
  DATA_DIR,
  readJson,
  loadContent
};
