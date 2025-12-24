const appRoot = document.getElementById("app");

const state = {
  data: {},
  filters: {
    format: null,
    type: null,
    location: null
  },
  ui: {
    calendarMonth: null,
    selectedRange: {
      start: null,
      end: null
    },
    galleryAlbumId: null,
    lastSuccess: null
  }
};

const dataFiles = {
  app: "data/app.json",
  home: "data/home.json",
  accommodation: "data/accommodation.json",
  practices: "data/practices.json",
  kitchen: "data/kitchen.json",
  gallery: "data/gallery.json",
  calendar: "data/calendar.json",
  shop: "data/shop.json",
  forms: "data/forms.json"
};

const weekdayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
];

init();

async function init() {
  initTelegram();
  await loadData();
  if (!state.ui.calendarMonth) {
    const now = new Date();
    state.ui.calendarMonth = { year: now.getFullYear(), month: now.getMonth() };
  }
  if (!state.ui.galleryAlbumId && state.data.gallery?.albums?.length) {
    state.ui.galleryAlbumId = state.data.gallery.albums[0].id;
  }
  render();
  window.addEventListener("hashchange", render);
}

function initTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
}

function getTelegramContext() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    return { initData: "", userId: "" };
  }
  return {
    initData: tg.initData || "",
    userId: tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : ""
  };
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, path]) => [key, await fetchJson(path)])
  );
  const data = Object.fromEntries(entries);
  data.app = data.app.app;
  state.data = data;
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${path}`);
  }
  return response.json();
}

function parseRoute() {
  const hash = window.location.hash || "#/";
  const [rawPath, rawQuery] = hash.slice(1).split("?");
  const path = rawPath || "/";
  const query = new URLSearchParams(rawQuery || "");
  return { path, query };
}

function render() {
  if (!state.data.app) {
    appRoot.innerHTML = "<div class=\"loading\">Загрузка…</div>";
    return;
  }

  const { path, query } = parseRoute();
  const content = renderRoute(path, query);
  appRoot.innerHTML = content.html;
  bindNavigation();
  if (content.bind) {
    content.bind();
  }
}

function renderRoute(path, query) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "request") {
    const type = parts[1] || query.get("type");
    return renderRequestForm(type, query);
  }

  switch (path) {
    case "/":
    case "/home":
      return renderHome();
    case "/accommodation":
      return renderAccommodation();
    case "/practices":
      return renderPractices();
    case "/calendar":
      return renderCalendar();
    case "/kitchen":
      return renderKitchen();
    case "/gallery":
      return renderGallery();
    case "/shop":
      return renderShop();
    case "/contact":
      return renderContact();
    case "/success":
      return renderSuccess();
    default:
      return renderNotFound();
  }
}

function renderShell({ title, subtitle, content, action }) {
  const brandName = state.data.app?.name || "";
  return {
    html: `
      <div class="app-shell">
        <header class="topbar">
          <div class="topbar__brand">
            <div class="topbar__kicker">Ретритный центр</div>
            <div class="topbar__title">${title || brandName}</div>
          </div>
          <div class="topbar__actions">
            <button class="icon-button" data-nav="#/">Домой</button>
            ${action ? `<button class="icon-button" data-nav="${action.href}">${action.label}</button>` : ""}
          </div>
        </header>
        <main class="page">
          ${subtitle ? `<div class="section-subtitle">${subtitle}</div>` : ""}
          ${content}
        </main>
      </div>
    `
  };
}

function renderHome() {
  const { app, home } = state.data;
  const sectionCards = home.sections
    .map(
      (section, index) => `
        <button class="card card--strong reveal" style="--delay:${index * 50}ms" data-nav="#${section.route}">
          <div class="card__title">${section.label}</div>
        </button>
      `
    )
    .join("");

  const ctas = home.cta
    .map(
      (cta, index) => `
        <button class="btn ${index === 0 ? "btn--primary" : "btn--ghost"} reveal" style="--delay:${index * 60}ms" data-nav="#/request/${cta.requestType}">
          ${cta.label}
        </button>
      `
    )
    .join("");

  const content = `
    <section class="hero reveal" style="--delay:0ms">
      <h1>${app.name}</h1>
      <div class="hero__tagline">${app.tagline}</div>
      <div class="hero__intro">${app.intro}</div>
    </section>
    <section>
      <h2 class="section-title">Навигация</h2>
      <div class="section-grid">
        ${sectionCards}
      </div>
    </section>
    <section>
      <h2 class="section-title">Запросы</h2>
      <div class="cta-bar">
        ${ctas}
      </div>
    </section>
  `;

  return renderShell({ title: app.name, subtitle: "", content, action: { label: "Связаться", href: "#/contact" } });
}

function renderAccommodation() {
  const { accommodation } = state.data;
  const capacity = accommodation.capacity;
  const price = accommodation.price;

  const priceBlock = price.mode === "fixed"
    ? `
        <div class="card">
          <h3 class="card__title">Стоимость размещения</h3>
          ${price.items.length
            ? `<ul class="list">${price.items.map((item) => `<li>${item.label}: ${formatCurrency(item.price)}</li>`).join("")}</ul>`
            : `<div class="card__text">Стоимость уточняется под формат группы.</div>`}
        </div>
      `
    : `
        <div class="card">
          <h3 class="card__title">Стоимость размещения</h3>
          <div class="card__text">Цена по запросу. Уточним после заявки.</div>
        </div>
      `;

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Размещение</h2>
      <div class="section-subtitle">Номерной фонд, гибкое размещение и возможность дополнительных мест.</div>
      <ul class="list">
        <li>Всего номерных единиц: <strong>${capacity.totalUnits}</strong></li>
        <li>Базовых спальных мест: <strong>${capacity.baseBeds}</strong></li>
        <li>Возможность размещения до <strong>${capacity.maxGuests}</strong> человек</li>
        ${capacity.notes.map((note) => `<li>${note}</li>`).join("")}
      </ul>
    </section>
    ${priceBlock}
    <section class="card">
      <h3 class="card__title">Фото/видео</h3>
      <div class="card__text">Раздел будет дополнен медиа. Сейчас можно запросить подборку у администратора.</div>
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/request/accommodation">Запросить размещение</button>
    </div>
  `;

  return renderShell({ title: "Размещение", subtitle: "Варианты проживания и параметры мест", content });
}

function renderPractices() {
  const { practices } = state.data;
  const filters = practices.filters;
  const filtered = practices.practices.filter((item) => matchesFilters(item));

  const filterBlocks = [
    {
      id: "format",
      title: "Формат",
      options: filters.format
    },
    {
      id: "type",
      title: "Тип практики",
      options: filters.type
    },
    {
      id: "location",
      title: "Локация",
      options: filters.location
    }
  ]
    .map(
      (group) => `
        <div>
          <div class="section-subtitle">${group.title}</div>
          <div class="filter-row">
            <button class="chip ${state.filters[group.id] ? "" : "chip--active"}" data-filter-group="${group.id}" data-filter-value="">Все</button>
            ${Object.entries(group.options)
              .map(
                ([value, label]) => `
                  <button class="chip ${state.filters[group.id] === value ? "chip--active" : ""}" data-filter-group="${group.id}" data-filter-value="${value}">
                    ${label}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  const practiceCards = filtered
    .map((item, index) => {
      const isFlagship = item.id === practices.flagshipId;
      return `
        <article class="card ${isFlagship ? "card--flagship" : ""} reveal" style="--delay:${index * 40}ms">
          <div class="practice-meta">
            ${isFlagship ? `<span class="badge badge--accent">Флагман</span>` : ""}
            ${item.format.map((f) => `<span class="badge">${filters.format[f]}</span>`).join("")}
            <span class="badge">${filters.type[item.type]}</span>
          </div>
          <h3 class="card__title">${item.title}</h3>
          <div class="card__text">${item.description}</div>
          <div class="practice-meta">
            ${item.location.map((loc) => `<span class="badge">${filters.location[loc]}</span>`).join("")}
            <span class="badge">${item.duration}</span>
            <span class="badge">${item.price.mode === "request" ? "Цена по запросу" : formatCurrency(item.price.value)}</span>
          </div>
          <button class="btn btn--secondary" data-nav="#/request/practices?add=${item.id}">Запросить детали</button>
        </article>
      `;
    })
    .join("");

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Практики и услуги</h2>
      <div class="section-subtitle">Подберите формат, длительность и атмосферу под вашу группу.</div>
      <div class="filters">${filterBlocks}</div>
    </section>
    <section class="practice-grid">
      ${practiceCards || `<div class="card">Нет практик по выбранным фильтрам.</div>`}
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/request/practices">Подобрать практики/услуги</button>
    </div>
  `;

  return {
    ...renderShell({ title: "Практики и услуги", subtitle: "Каталог активностей и ритуалов", content }),
    bind: bindPracticeFilters
  };
}

function renderCalendar() {
  const { calendar } = state.data;
  const { year, month } = state.ui.calendarMonth;
  const matrix = buildMonthMatrix(year, month);

  const daysMarkup = matrix
    .map((day) => {
      const status = day.inMonth ? getStatusForDate(day.date, calendar) : null;
      const classes = ["calendar-day"];
      if (!day.inMonth) classes.push("calendar-day--muted");
      if (day.inMonth && isSelectedDay(day.date)) classes.push("calendar-day--selected");
      if (day.inMonth && isRangeDay(day.date)) classes.push("calendar-day--range");
      const statusAttr = status !== null ? `data-status="${status}"` : "";
      return `
        <div class="${classes.join(" ")}" ${statusAttr} data-date="${day.dateStr}">
          <div>${day.date.getDate()}</div>
          ${day.inMonth ? `<div class="badge">${calendar.statusRules[status]}</div>` : ""}
        </div>
      `;
    })
    .join("");

  const rangeLabel = state.ui.selectedRange.start
    ? state.ui.selectedRange.end
      ? `${state.ui.selectedRange.start} — ${state.ui.selectedRange.end}`
      : state.ui.selectedRange.start
    : "Выберите даты";

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Календарь дат</h2>
      <div class="section-subtitle">Центр принимает до двух групп одновременно.</div>
      <div class="calendar-header">
        <button class="btn btn--ghost" data-calendar="prev">←</button>
        <div class="calendar-title">${monthNames[month]} ${year}</div>
        <button class="btn btn--ghost" data-calendar="next">→</button>
      </div>
      <div class="calendar-grid">
        ${weekdayNames.map((name) => `<div class="calendar-weekday">${name}</div>`).join("")}
        ${daysMarkup}
      </div>
      <div class="calendar-legend">
        <span class="legend-item"><span class="legend-dot legend-dot--green"></span>🟢 Свободно</span>
        <span class="legend-item"><span class="legend-dot legend-dot--yellow"></span>🟡 Свободна половина</span>
        <span class="legend-item"><span class="legend-dot legend-dot--red"></span>🔴 Занято</span>
      </div>
    </section>
    <section class="card">
      <h3 class="card__title">Выбранный диапазон</h3>
      <div class="card__text">${rangeLabel}</div>
      <div class="cta-bar">
        <button class="btn btn--primary" data-nav="#/request/accommodation${buildDateQuery()}">Запросить эти даты</button>
        <button class="btn btn--ghost" data-nav="#/request/turnkey${buildDateQuery()}">Тур под ключ</button>
        <button class="btn btn--ghost" data-nav="#/request/practices${buildDatesForPracticesQuery()}">Практики</button>
      </div>
    </section>
  `;

  return {
    ...renderShell({ title: "Календарь дат", subtitle: "Статусы занятости по правилам 0/1/2 групп", content }),
    bind: bindCalendar
  };
}

function renderKitchen() {
  const { kitchen } = state.data;

  const tiersTable = kitchen.price.mode === "price"
    ? `
        <table class="table">
          <thead>
            <tr>
              <th>Размер группы</th>
              <th>Комплекс</th>
              <th>2-разовое</th>
            </tr>
          </thead>
          <tbody>
            ${kitchen.tiers
              .map(
                (tier) => `
                  <tr>
                    <td>${tier.label}</td>
                    <td>${formatCurrency(tier.rates.full)}</td>
                    <td>${formatCurrency(tier.rates.twoMeals)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `
    : "";

  const addons = kitchen.addons
    .map((addon) => {
      const priceLabel = addon.price
        ? formatCurrency(addon.price)
        : `от ${formatCurrency(addon.priceFrom)}`;
      return `<li>${addon.label}: ${priceLabel} (${addon.unit})</li>`;
    })
    .join("");

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Кухня и питание</h2>
      <div class="section-subtitle">Гибкая сетка питания и дополнительные опции.</div>
      ${kitchen.price.mode === "price" ? tiersTable : `<div class="notice">Тарифы по запросу.</div>`}
    </section>
    <section class="card">
      <h3 class="card__title">Дополнительно</h3>
      <ul class="list">${addons}</ul>
    </section>
    <section class="card">
      <h3 class="card__title">Ориентировочный расчёт</h3>
      <div class="kitchen-calc">
        <div class="field">
          <label for="kitchenGuests">Количество участников</label>
          <input id="kitchenGuests" name="guestsCount" type="number" min="1" placeholder="Например, 20" />
        </div>
        <div class="field">
          <label for="kitchenFoodType">Тип питания</label>
          <select id="kitchenFoodType" name="foodType">
            <option value="">Выберите</option>
            <option value="full">Комплекс</option>
            <option value="twoMeals">2-разовое</option>
            <option value="request">по запросу</option>
          </select>
        </div>
        <div class="field">
          <label for="kitchenDateFrom">Даты (заезд)</label>
          <input id="kitchenDateFrom" name="dateFrom" type="date" />
        </div>
        <div class="field">
          <label for="kitchenDateTo">Даты (выезд)</label>
          <input id="kitchenDateTo" name="dateTo" type="date" />
        </div>
        <div class="calc-output" id="kitchenCalcOutput">Введите данные, чтобы увидеть расчёт.</div>
      </div>
      <div class="notice">Расчёт ориентировочный, итог подтверждает администратор.</div>
    </section>
  `;

  return {
    ...renderShell({ title: "Кухня и питание", subtitle: "Тарифы и автоподбор по размеру группы", content }),
    bind: bindKitchenCalc
  };
}

function renderGallery() {
  const { gallery } = state.data;
  const activeAlbum = gallery.albums.find((album) => album.id === state.ui.galleryAlbumId) || gallery.albums[0];

  const tabs = gallery.albums
    .map(
      (album) => `
        <button class="tab ${album.id === activeAlbum.id ? "tab--active" : ""}" data-gallery="${album.id}">
          ${album.title}
        </button>
      `
    )
    .join("");

  const items = activeAlbum.items.length
    ? activeAlbum.items
        .map((item) => {
          const media = item.type === "video"
            ? `<video src="${item.src}" controls preload="metadata"></video>`
            : `<img src="${item.thumb || item.src}" alt="${item.caption || ""}" loading="lazy" />`;
          return `
            <div class="gallery-item">
              ${media}
              ${item.caption ? `<div>${item.caption}</div>` : ""}
            </div>
          `;
        })
        .join("")
    : `<div class="gallery-item">Медиа появится скоро.</div>`;

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Галерея</h2>
      <div class="section-subtitle">Атмосфера центра и пространства.</div>
      <div class="tabs">${tabs}</div>
    </section>
    <section class="gallery-grid">${items}</section>
  `;

  return {
    ...renderShell({ title: "Галерея", subtitle: "Фото и видео локаций", content }),
    bind: bindGalleryTabs
  };
}

function renderShop() {
  const { shop } = state.data;
  const items = shop.items
    .map((item) => `<li>${item.label}</li>`)
    .join("");

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">${shop.title}</h2>
      <div class="section-subtitle">${shop.description}</div>
    </section>
    <section class="card">
      <h3 class="card__title">Возможные позиции</h3>
      <ul class="list">${items}</ul>
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/request/shop">${shop.cta}</button>
    </div>
  `;

  return renderShell({ title: "Магазин", subtitle: "MVP без витрины", content });
}

function renderContact() {
  const content = `
    <section class="card card--strong">
      <h2 class="section-title">Связаться / Заявка</h2>
      <div class="notice">Мы не принимаем оплату в приложении. Все вопросы решаем лично и через договор.</div>
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/request/accommodation">Запросить размещение</button>
      <button class="btn btn--ghost" data-nav="#/request/practices">Подобрать практики/услуги</button>
      <button class="btn btn--ghost" data-nav="#/request/turnkey">Собрать тур под ключ</button>
    </div>
  `;

  return renderShell({ title: "Связаться", subtitle: "Быстрая связь с администраторами", content });
}

function renderSuccess() {
  const afterSubmit = state.data.forms.afterSubmit;
  const message = state.ui.lastSuccess || afterSubmit;
  const content = `
    <section class="success">
      <div>${message.title}</div>
      <div>${message.message}</div>
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/">На главную</button>
    </div>
  `;
  return renderShell({ title: message.title, subtitle: "", content });
}

function renderNotFound() {
  const content = `
    <section class="card">
      <h2 class="section-title">Раздел не найден</h2>
      <div class="card__text">Вернитесь на главную и выберите нужный раздел.</div>
    </section>
    <div class="cta-bar">
      <button class="btn btn--primary" data-nav="#/">На главную</button>
    </div>
  `;
  return renderShell({ title: "Ошибка", subtitle: "", content });
}

function renderRequestForm(type, query) {
  if (!type || !state.data.forms.requests[type]) {
    return renderNotFound();
  }

  const { forms, practices, shop } = state.data;
  const formConfig = forms.requests[type];
  const commonFields = forms.common.fields;
  const fields = mergeFields(formConfig.fields, commonFields);
  const prefill = buildPrefill(type, query);

  const fieldsMarkup = fields
    .map((field) => renderField(field, prefill, practices, shop))
    .join("");

  const foodEstimate = (type === "accommodation" || type === "turnkey")
    ? `<div class="calc-output" id="foodEstimate">Укажите количество гостей и тип питания.</div>`
    : "";

  const content = `
    <section class="card card--strong">
      <h2 class="section-title">${formConfig.title}</h2>
      <div class="section-subtitle">Заполните форму, администратор свяжется с вами.</div>
    </section>
    <form class="card form" id="requestForm">
      <div class="form-errors" id="formErrors" aria-live="polite"></div>
      ${fieldsMarkup}
      ${foodEstimate ? `<div class="field">${foodEstimate}<div class="hint">Ориентировочно, финально уточняет админ.</div></div>` : ""}
      <button class="btn btn--primary" type="submit">Отправить заявку</button>
    </form>
  `;

  return {
    ...renderShell({ title: "Заявка", subtitle: formConfig.title, content }),
    bind: () => bindRequestForm(type, fields)
  };
}

function renderField(field, prefill, practices, shop) {
  const value = prefill[field.id];
  const label = `${field.label}${field.required ? " *" : ""}`;
  const id = `field_${field.id}`;

  if (field.type === "select") {
    const options = field.options
      .map(
        (option) => `
          <option value="${option.value}" ${value === option.value ? "selected" : ""}>
            ${option.label}
          </option>
        `
      )
      .join("");

    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <select id="${id}" name="${field.id}">
          <option value="">Выберите</option>
          ${options}
        </select>
      </div>
    `;
  }

  if (field.type === "multiselect") {
    let options = field.options || [];
    if (field.dataSource === "practices.json") {
      options = practices.practices.map((item) => ({ value: item.id, label: item.title }));
    }
    if (field.optionsSource === "shop.json") {
      options = shop.items.map((item) => ({ value: item.id, label: item.label }));
    }

    const selected = Array.isArray(value) ? value : value ? [value] : [];

    const checkboxes = options
      .map(
        (option) => `
          <label class="check-item">
            <input type="checkbox" name="${field.id}" value="${option.value}" ${selected.includes(option.value) ? "checked" : ""} />
            <span>${option.label}</span>
          </label>
        `
      )
      .join("");

    return `
      <div class="field">
        <label>${label}</label>
        <div class="check-grid">
          ${checkboxes}
        </div>
      </div>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <textarea id="${id}" name="${field.id}" placeholder="${field.placeholder || ""}">${value || ""}</textarea>
      </div>
    `;
  }

  const inputType = field.type === "number" ? "number" : field.type || "text";
  const min = field.min ? `min="${field.min}"` : "";

  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${field.id}" type="${inputType}" ${min} value="${value || ""}" placeholder="${field.placeholder || ""}" />
    </div>
  `;
}

function mergeFields(formFields, commonFields) {
  const ids = new Set(formFields.map((field) => field.id));
  const merged = [...formFields];
  commonFields.forEach((field) => {
    if (!ids.has(field.id)) {
      merged.push(field);
    }
  });
  return merged;
}

function buildPrefill(type, query) {
  const prefill = {};
  const from = query.get("from");
  const to = query.get("to");
  if (from) prefill.dateFrom = from;
  if (to) prefill.dateTo = to;

  const datesLabel = from && to ? `${from} — ${to}` : null;
  if (type === "practices" && datesLabel) {
    prefill.datesOrDays = datesLabel;
  }

  const addPractice = query.get("add");
  if (addPractice) {
    prefill.practiceIds = [addPractice];
  }

  const guests = query.get("guests");
  if (guests) {
    prefill.guestsCount = guests;
  }

  return prefill;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    node.addEventListener("click", () => {
      const target = node.getAttribute("data-nav");
      if (target) {
        window.location.hash = target.replace(/^#/, "");
      }
    });
  });
}

function bindPracticeFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.getAttribute("data-filter-group");
      const value = chip.getAttribute("data-filter-value") || null;
      state.filters[group] = value || null;
      render();
    });
  });
}

function bindCalendar() {
  document.querySelectorAll("[data-calendar]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.getAttribute("data-calendar");
      changeCalendarMonth(direction === "next" ? 1 : -1);
    });
  });

  document.querySelectorAll("[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const dateStr = cell.getAttribute("data-date");
      if (!dateStr) return;
      updateSelectedRange(dateStr);
      render();
    });
  });
}

function bindKitchenCalc() {
  const guests = document.getElementById("kitchenGuests");
  const foodType = document.getElementById("kitchenFoodType");
  const dateFrom = document.getElementById("kitchenDateFrom");
  const dateTo = document.getElementById("kitchenDateTo");
  const output = document.getElementById("kitchenCalcOutput");

  const update = () => {
    const estimate = buildFoodEstimate({
      guestsCount: Number(guests.value),
      foodType: foodType.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value
    });
    output.innerHTML = estimate;
  };

  [guests, foodType, dateFrom, dateTo].forEach((input) => {
    input.addEventListener("input", update);
  });
}

function bindGalleryTabs() {
  document.querySelectorAll("[data-gallery]").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.ui.galleryAlbumId = tab.getAttribute("data-gallery");
      render();
    });
  });
}

function bindRequestForm(type, fields) {
  const form = document.getElementById("requestForm");
  const errors = document.getElementById("formErrors");
  const submitButton = form.querySelector("button[type=submit]");

  if (type === "accommodation" || type === "turnkey") {
    bindFoodEstimateInForm(form);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errors.classList.remove("active");
    errors.textContent = "";

    const payload = buildPayload(form, fields);
    const validation = validatePayload(type, payload, fields);

    if (!validation.valid) {
      errors.textContent = validation.errors.join(" ");
      errors.classList.add("active");
      return;
    }

    const lastKey = `lastSubmit_${type}`;
    const lastTime = Number(localStorage.getItem(lastKey) || 0);
    if (Date.now() - lastTime < 30000) {
      errors.textContent = "Можно отправлять не чаще одного раза в 30 секунд.";
      errors.classList.add("active");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Отправляем…";

    try {
      await submitRequest(type, payload);
      localStorage.setItem(lastKey, String(Date.now()));
      state.ui.lastSuccess = state.data.forms.afterSubmit;
      window.location.hash = "#/success";
    } catch (error) {
      errors.textContent = "Не удалось отправить заявку. Попробуйте позже.";
      errors.classList.add("active");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}

function bindFoodEstimateInForm(form) {
  const output = form.querySelector("#foodEstimate");
  if (!output) return;

  const update = () => {
    const estimate = buildFoodEstimate({
      guestsCount: Number(form.elements.guestsCount?.value),
      foodType: form.elements.foodType?.value,
      dateFrom: form.elements.dateFrom?.value,
      dateTo: form.elements.dateTo?.value
    });
    output.innerHTML = estimate;
  };

  ["guestsCount", "foodType", "dateFrom", "dateTo"].forEach((name) => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener("input", update);
    }
  });
}

function buildPayload(form, fields) {
  const payload = {};
  fields.forEach((field) => {
    if (field.type === "multiselect") {
      const values = Array.from(form.querySelectorAll(`input[name="${field.id}"]:checked`)).map(
        (input) => input.value
      );
      payload[field.id] = values;
    } else {
      const value = form.elements[field.id]?.value;
      if (value !== undefined) {
        payload[field.id] = value;
      }
    }
  });

  payload.signature = state.data.app.signature;
  return payload;
}

function validatePayload(type, payload, fields) {
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

  fields.forEach((field) => {
    if (!field.required) return;
    if (field.type === "multiselect") {
      const value = payload[field.id] || [];
      const minItems = field.minItems || 1;
      if (value.length < minItems) {
        errors.push(`Выберите: ${field.label}.`);
      }
      return;
    }

    const value = String(payload[field.id] || "").trim();
    if (!value) {
      errors.push(`Поле обязательно: ${field.label}.`);
    }
  });

  if (payload.dateFrom && payload.dateTo) {
    const start = parseDate(payload.dateFrom);
    const end = parseDate(payload.dateTo);
    if (end < start) {
      errors.push("Дата выезда должна быть позже даты заезда.");
    }
  }

  if (type !== "shop" && !payload.dateFrom && !payload.datesOrDays) {
    if (fields.some((field) => field.id === "dateFrom")) {
      errors.push("Укажите даты.");
    }
  }

  return { valid: errors.length === 0, errors };
}

async function submitRequest(type, payload) {
  const { initData, userId } = getTelegramContext();
  const headers = { "Content-Type": "application/json" };
  if (initData) headers["x-telegram-init-data"] = initData;
  if (userId) headers["x-telegram-user-id"] = userId;
  const apiBase = state.data.app?.apiBaseUrl ? state.data.app.apiBaseUrl.replace(/\/$/, "") : "";

  const response = await fetch(`${apiBase}/api/requests/${type}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

function matchesFilters(practice) {
  const { format, type, location } = state.filters;
  if (format && !practice.format.includes(format)) return false;
  if (type && practice.type !== type) return false;
  if (location && !practice.location.includes(location)) return false;
  return true;
}

function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    days.push({
      date,
      dateStr: formatDateInput(date),
      inMonth: date.getMonth() === month
    });
  }
  return days;
}

function getStatusForDate(date, calendar) {
  const groups = calendar.bookings.reduce((total, booking) => {
    const from = parseDate(booking.from);
    const to = parseDate(booking.to);
    if (date >= from && date <= to) {
      return total + (booking.groups || 1);
    }
    return total;
  }, 0);
  return Math.min(groups, calendar.maxGroups);
}

function updateSelectedRange(dateStr) {
  const { selectedRange } = state.ui;
  if (!selectedRange.start || selectedRange.end) {
    selectedRange.start = dateStr;
    selectedRange.end = null;
    return;
  }
  if (dateStr < selectedRange.start) {
    selectedRange.end = selectedRange.start;
    selectedRange.start = dateStr;
  } else {
    selectedRange.end = dateStr;
  }
}

function isSelectedDay(date) {
  const { start, end } = state.ui.selectedRange;
  const dateStr = formatDateInput(date);
  return dateStr === start || dateStr === end;
}

function isRangeDay(date) {
  const { start, end } = state.ui.selectedRange;
  if (!start || !end) return false;
  const dateStr = formatDateInput(date);
  return dateStr > start && dateStr < end;
}

function changeCalendarMonth(delta) {
  const { year, month } = state.ui.calendarMonth;
  const next = new Date(year, month + delta, 1);
  state.ui.calendarMonth = { year: next.getFullYear(), month: next.getMonth() };
  render();
}

function buildDateQuery() {
  const { start, end } = state.ui.selectedRange;
  if (!start) return "";
  const params = new URLSearchParams();
  params.set("from", start);
  if (end) params.set("to", end);
  return `?${params.toString()}`;
}

function buildDatesForPracticesQuery() {
  const { start, end } = state.ui.selectedRange;
  if (!start) return "";
  const params = new URLSearchParams();
  params.set("from", start);
  if (end) params.set("to", end);
  return `?${params.toString()}`;
}

function buildFoodEstimate({ guestsCount, foodType, dateFrom, dateTo }) {
  const kitchen = state.data.kitchen;
  if (!foodType) {
    return "Выберите тип питания.";
  }
  if (foodType === "request") {
    return "Питание по запросу. Администратор уточнит детали.";
  }
  if (!guestsCount) {
    return "Укажите количество участников.";
  }

  const tier = getKitchenTier(kitchen, guestsCount);
  if (!tier) {
    return "Минимальный тариф доступен от 7 человек.";
  }

  const rate = tier.rates[foodType];
  const perPerson = formatCurrency(rate);
  const perGroup = formatCurrency(rate * guestsCount);
  const days = calculateDays(dateFrom, dateTo);
  const perPeriod = days ? formatCurrency(rate * guestsCount * days) : null;

  return `
    <div>Тариф: ${tier.label}</div>
    <div>На человека в день: ${perPerson}</div>
    <div>На группу в день: ${perGroup}</div>
    ${perPeriod ? `<div>За период (${days} дн.): ${perPeriod}</div>` : "<div>Укажите даты для расчёта за период.</div>"}
  `;
}

function getKitchenTier(kitchen, guestsCount) {
  const available = kitchen.tiers.filter((tier) => guestsCount >= tier.minGuests);
  if (!available.length) return null;
  return available.sort((a, b) => b.minGuests - a.minGuests)[0];
}

function calculateDays(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return null;
  const start = parseDate(dateFrom);
  const end = parseDate(dateTo);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatDateInput(date) {
  return date.toISOString().split("T")[0];
}
