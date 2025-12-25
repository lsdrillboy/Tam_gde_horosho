function valueOrNotProvided(value) {
  const text = String(value || "").trim();
  return text ? text : "не указано";
}

function valueOrNone(value) {
  const text = String(value || "").trim();
  return text ? text : "нет";
}

function joinOrNone(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return "нет";
  }
  return list.join(", ");
}

function formatContact(payload) {
  const parts = [];
  if (payload.phone) parts.push(payload.phone);
  if (payload.telegram) parts.push(payload.telegram);
  return parts.length ? parts.join(" / ") : "не указано";
}

function mapRequesterType(value) {
  const map = {
    organizer: "Организатор ретрита",
    guest: "Индивидуальный гость"
  };
  return map[value] || valueOrNotProvided(value);
}

function mapFoodType(value) {
  const map = {
    full: "Комплекс",
    twoMeals: "2-разовое",
    request: "по запросу"
  };
  return map[value] || "по запросу";
}

function buildFoodPreferences(payload) {
  const map = {
    vegetarian: "Вегетарианское",
    meatOnRequest: "Мясо по запросу"
  };
  const list = [];
  if (Array.isArray(payload.foodPreferences)) {
    payload.foodPreferences.forEach((value) => {
      if (map[value]) list.push(map[value]);
    });
  }
  if (payload.foodAllergies) list.push(payload.foodAllergies);
  return list.length ? list.join(", ") : "нет";
}

function getAddonLabels(ids, kitchen) {
  if (!Array.isArray(ids) || !kitchen?.addons) return [];
  return ids.map((id) => {
    const addon = kitchen.addons.find((item) => item.id === id);
    return addon ? addon.label : id;
  });
}

function getPracticeLabels(ids, practices) {
  if (!Array.isArray(ids) || !practices?.practices) return [];
  return ids.map((id) => {
    const practice = practices.practices.find((item) => item.id === id);
    return practice ? practice.title : id;
  });
}

function getShopLabels(ids, shop) {
  if (!Array.isArray(ids) || !shop?.items) return [];
  return ids.map((id) => {
    const item = shop.items.find((entry) => entry.id === id);
    return item ? item.label : id;
  });
}

function getRoomLabel(id, accommodation) {
  if (!id || !accommodation?.types) return valueOrNotProvided(id);
  const room = accommodation.types.find((item) => item.id === id);
  return room ? room.title : valueOrNotProvided(id);
}

function getServiceLabel(id, services) {
  if (!id || !services?.extras?.items) return valueOrNotProvided(id);
  const service = services.extras.items.find((item) => item.id === id);
  return service ? service.title : valueOrNotProvided(id);
}

function getMasterLabel(id, masters) {
  if (!id || !masters?.items) return valueOrNotProvided(id);
  const master = masters.items.find((item) => item.id === id);
  return master ? master.name : valueOrNotProvided(id);
}

function getInterestLabels(ids) {
  const map = {
    accommodation: "проживание",
    food: "питание",
    practices: "практики",
    excursions: "экскурсии",
    hall: "зал для практик",
    services: "доп. услуги"
  };
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids.map((id) => map[id] || id);
}

function buildAccommodationMessage(payload, content) {
  const signature = content.app.signature;
  const addons = getAddonLabels(payload.foodAddons, content.kitchen);

  return [
    signature,
    "Тип запроса: Размещение",
    `Даты: ${valueOrNotProvided(payload.dateFrom)} — ${valueOrNotProvided(payload.dateTo)}`,
    `Количество гостей: ${valueOrNotProvided(payload.guestsCount)}`,
    `Кто запрашивает: ${mapRequesterType(payload.requesterType)}`,
    `Пожелания по размещению: ${valueOrNone(payload.wishes)}`,
    "",
    `Питание: ${mapFoodType(payload.foodType)}`,
    `Особенности питания: ${buildFoodPreferences(payload)}`,
    `Допы: ${joinOrNone(addons)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildPracticesMessage(payload, content) {
  const signature = content.app.signature;
  const practices = getPracticeLabels(payload.practiceIds, content.practices);

  return [
    signature,
    "Тип запроса: Практики",
    `Даты / дни практик: ${valueOrNotProvided(payload.datesOrDays)}`,
    `Количество участников: ${valueOrNotProvided(payload.participantsCount)}`,
    "Выбранные практики:",
    practices.length ? practices.join("\n") : "нет",
    "",
    `Пожелания к формату / расписанию: ${valueOrNone(payload.wishes)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildTurnkeyMessage(payload, content) {
  const signature = content.app.signature;
  const addons = getAddonLabels(payload.foodAddons, content.kitchen);
  const interests = getInterestLabels(payload.interests);

  return [
    signature,
    "Тип запроса: Заявка организатора",
    `Даты: ${valueOrNotProvided(payload.dateFrom)} — ${valueOrNotProvided(payload.dateTo)}`,
    `Количество гостей: ${valueOrNotProvided(payload.guestsCount)}`,
    "",
    `Интересуют: ${joinOrNone(interests)}`,
    "",
    `Питание: ${mapFoodType(payload.foodType)}`,
    `Особенности питания: ${buildFoodPreferences(payload)}`,
    `Допы: ${joinOrNone(addons)}`,
    "",
    `Комментарий организатора: ${valueOrNone(payload.organizerComment || payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildShopMessage(payload, content) {
  const signature = content.app.signature;
  const items = getShopLabels(payload.items, content.shop);
  const interest = items.length ? items.join(", ") : "общий интерес";

  return [
    signature,
    "Тип запроса: Интерес к мерчу / предзаказ",
    `Интересует: ${interest}`,
    `Комментарий: ${valueOrNone(payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildDatesMessage(payload, content) {
  const signature = content.app.signature;
  return [
    signature,
    "Тип запроса: Запрос дат",
    `Предпочитаемые даты: ${valueOrNotProvided(payload.preferredDates)}`,
    `Кто запрашивает: ${mapRequesterType(payload.requesterType)}`,
    `Количество людей / групп: ${valueOrNotProvided(payload.groupSize)}`,
    "",
    `Комментарий: ${valueOrNone(payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildRoomMessage(payload, content) {
  const signature = content.app.signature;
  return [
    signature,
    "Тип запроса: Размещение",
    `Тип размещения: ${getRoomLabel(payload.roomId, content.accommodation)}`,
    `Предпочитаемые даты: ${valueOrNotProvided(payload.preferredDates)}`,
    `Количество гостей: ${valueOrNotProvided(payload.guestsCount)}`,
    "",
    `Комментарий: ${valueOrNone(payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildServiceMessage(payload, content) {
  const signature = content.app.signature;
  return [
    signature,
    "Тип запроса: Услуга",
    `Услуга: ${getServiceLabel(payload.serviceId, content.services)}`,
    `Предпочитаемые даты: ${valueOrNotProvided(payload.preferredDates)}`,
    `Количество участников: ${valueOrNotProvided(payload.participantsCount)}`,
    "",
    `Комментарий: ${valueOrNone(payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildMasterMessage(payload, content) {
  const signature = content.app.signature;
  return [
    signature,
    "Тип запроса: Мастер",
    `Мастер: ${getMasterLabel(payload.masterId, content.masters)}`,
    `Предпочитаемые даты: ${valueOrNotProvided(payload.preferredDates)}`,
    `Количество участников: ${valueOrNotProvided(payload.participantsCount)}`,
    "",
    `Комментарий: ${valueOrNone(payload.comment)}`,
    "",
    `Контакт — Имя: ${valueOrNotProvided(payload.name)}`,
    `Контакт — Телефон/Telegram: ${formatContact(payload)}`
  ].join("\n");
}

function buildMessage(type, payload, content) {
  switch (type) {
    case "dates":
      return buildDatesMessage(payload, content);
    case "room":
      return buildRoomMessage(payload, content);
    case "service":
      return buildServiceMessage(payload, content);
    case "master":
      return buildMasterMessage(payload, content);
    case "accommodation":
      return buildAccommodationMessage(payload, content);
    case "practices":
      return buildPracticesMessage(payload, content);
    case "turnkey":
      return buildTurnkeyMessage(payload, content);
    case "shop":
      return buildShopMessage(payload, content);
    default:
      throw new Error("Unknown request type");
  }
}

module.exports = {
  buildMessage
};
