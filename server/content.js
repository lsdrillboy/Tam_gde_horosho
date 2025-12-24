const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");

const contentFiles = {
  app: "app.json",
  home: "home.json",
  accommodation: "accommodation.json",
  practices: "practices.json",
  kitchen: "kitchen.json",
  gallery: "gallery.json",
  calendar: "calendar.json",
  shop: "shop.json",
  forms: "forms.json"
};

function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function loadContent() {
  const appData = readJson("app.json");
  return {
    app: appData.app,
    practices: readJson("practices.json"),
    kitchen: readJson("kitchen.json"),
    shop: readJson("shop.json"),
    forms: readJson("forms.json")
  };
}

module.exports = {
  ROOT_DIR,
  DATA_DIR,
  contentFiles,
  readJson,
  loadContent
};
