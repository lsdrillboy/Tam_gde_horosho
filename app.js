const appRoot = document.getElementById("app");

const state = {
  data: {},
  filters: {
    format: null,
    type: null,
    location: null
  },
  ui: {
    galleryAlbumId: null,
    lastSuccess: null,
    lastRoute: null
  }
};

const dataFiles = {
  app: "data/app.json",
  home: "data/home.json",
  accommodation: "data/accommodation.json",
  services: "data/services.json",
  masters: "data/masters.json",
  practices: "data/practices.json",
  kitchen: "data/kitchen.json",
  gallery: "data/gallery.json",
  shop: "data/shop.json",
  forms: "data/forms.json"
};

const ICONS = {
  home: "<path d=\"M3 11.5 12 4l9 7.5V21H3z\"/><path d=\"M9 21v-6h6v6\"/>",
  bed: "<path d=\"M4 11V7h10v4\"/><path d=\"M4 11h16v7H4z\"/><path d=\"M14 7h6v4\"/>",
  spark: "<path d=\"M12 3l1.6 4.8L19 9l-4.8 1.2L12 15l-2.2-4.8L5 9l5.4-1.2z\"/>",
  calendar: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M8 3v4M16 3v4M3 10h18\"/>",
  chat: "<path d=\"M4 6h16v9a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2z\"/>",
  phone: "<path d=\"M6 4l4 4-2 2a12 12 0 0 0 6 6l2-2 4 4-3 3c-6-1-12-6-13-13z\"/>",
  masters: "<circle cx=\"12\" cy=\"8\" r=\"3\"/><path d=\"M4 20a8 8 0 0 1 16 0\"/><path d=\"M18 8l2 2-2 2\"/>",
  leaf: "<path d=\"M6 15c5-8 12-9 12-9s0 8-8 12c-2 1-4 1-6-3z\"/><path d=\"M8 13c3 0 5-1 7-3\"/>",
  silence: "<path d=\"M15 4a7 7 0 1 0 5 12\"/>",
  pin: "<path d=\"M12 21s6-6.5 6-11a6 6 0 1 0-12 0c0 4.5 6 11 6 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/>",
  people: "<path d=\"M7 14a4 4 0 1 1 8 0\"/><path d=\"M4 20a6 6 0 0 1 16 0\"/>",
  price: "<path d=\"M7 7h7l4 5-7 7-5-5z\"/><circle cx=\"13\" cy=\"9\" r=\"1\"/>",
  check: "<path d=\"M5 12l4 4L19 6\"/>",
  hall: "<rect x=\"4\" y=\"5\" width=\"16\" height=\"14\" rx=\"2\"/><path d=\"M4 9h16\"/>",
  food: "<path d=\"M6 3v7M10 3v7M8 3v7\"/><path d=\"M14 3v7a3 3 0 0 0 6 0V3\"/><path d=\"M6 10v11\"/><path d=\"M18 10v11\"/>",
  steam: "<path d=\"M8 4c2 2 2 4 0 6\"/><path d=\"M12 4c2 2 2 4 0 6\"/><path d=\"M16 4c2 2 2 4 0 6\"/>",
  massage: "<path d=\"M4 14h7l3 4h6\"/><path d=\"M7 10h5l2 4\"/><path d=\"M4 14v-2a2 2 0 0 1 2-2h3\"/>",
  sound: "<circle cx=\"8\" cy=\"12\" r=\"3\"/><path d=\"M14 9c2 2 2 4 0 6\"/><path d=\"M18 7c3 3 3 7 0 10\"/>",
  plan: "<path d=\"M7 4h10v16H7z\"/><path d=\"M9 8h6M9 12h6M9 16h4\"/>",
  support: "<path d=\"M12 4a5 5 0 0 1 5 5v2\"/><path d=\"M7 11V9a5 5 0 0 1 5-5\"/><path d=\"M7 11a2 2 0 0 0 0 4\"/><path d=\"M17 11a2 2 0 0 1 0 4\"/>",
  logistics: "<path d=\"M4 16h16\"/><path d=\"M7 16l-3 3\"/><path d=\"M17 8h-6l-4 4\"/><path d=\"M17 8v4\"/>",
  team: "<circle cx=\"8\" cy=\"10\" r=\"3\"/><circle cx=\"16\" cy=\"10\" r=\"3\"/><path d=\"M2 20a6 6 0 0 1 12 0\"/><path d=\"M10 20a6 6 0 0 1 12 0\"/>",
  shield: "<path d=\"M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z\"/>",
  tea: "<path d=\"M5 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z\"/><path d=\"M15 9h3a2 2 0 0 1 0 4h-3\"/><path d=\"M7 5h6\"/>",
  lotus: "<path d=\"M12 6c2 3 2 6 0 9-2-3-2-6 0-9z\"/><path d=\"M6 9c3 2 4 4 4 7-3-1-5-3-6-6z\"/><path d=\"M18 9c-3 2-4 4-4 7 3-1 5-3 6-6z\"/>",
  music: "<path d=\"M9 5v11a3 3 0 1 1-2-2.8\"/><path d=\"M9 5l9-2v10a3 3 0 1 1-2-2.8\"/>",
  brush: "<path d=\"M13 4l7 7-4 4-7-7z\"/><path d=\"M4 20c3 0 5-2 5-5-3 0-5 2-5 5z\"/>",
  craft: "<path d=\"M7 4h10l2 7H5z\"/><path d=\"M6 11h12v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z\"/>",
  drum: "<ellipse cx=\"12\" cy=\"7\" rx=\"7\" ry=\"3\"/><path d=\"M5 7v8c0 2 3 4 7 4s7-2 7-4V7\"/><path d=\"M4 4l4 4M20 4l-4 4\"/>",
  telegram: "<path d=\"M21 5L3 12l6 2 2 6 10-15z\"/><path d=\"M9 14l12-9\"/>",
  instagram: "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17\" cy=\"7\" r=\"1\"/>",
  globe: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18\"/><path d=\"M12 3a15 15 0 0 1 0 18\"/><path d=\"M12 3a15 15 0 0 0 0 18\"/>"
};

init();

async function init() {
  initTelegram();
  await loadData();
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

function renderIcon(name, className = "") {
  const markup = ICONS[name];
  if (!markup) return "";
  return `
    <svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${markup}
    </svg>
  `;
}

function renderSocialLinks(socials = {}) {
  const links = [
    socials.telegram ? { href: socials.telegram, icon: "telegram", label: "Telegram" } : null,
    socials.instagram ? { href: socials.instagram, icon: "instagram", label: "Instagram" } : null,
    socials.website ? { href: socials.website, icon: "globe", label: "Website" } : null
  ].filter(Boolean);

  if (!links.length) {
    return "<span class=\"card__text\">Контакты уточняются</span>";
  }

  return links
    .map(
      (link) => `
        <a class="social-link" href="${link.href}" target="_blank" rel="noopener" aria-label="${link.label}" title="${link.label}">
          ${renderIcon(link.icon)}
        </a>
      `
    )
    .join("");
}

function renderCarousel(items = [], label = "") {
  const slides = items.length ? items : [""];
  const track = slides
    .map((src, index) => {
      if (!src) {
        return `
          <div class="carousel__slide carousel__slide--placeholder">
            <div>Фото появится скоро</div>
          </div>
        `;
      }
      return `
        <div class="carousel__slide">
          <img src="${src}" alt="${label} ${index + 1}" loading="lazy" />
        </div>
      `;
    })
    .join("");

  const dots = slides
    .map((_, index) => `<button class="carousel__dot ${index === 0 ? "active" : ""}" data-carousel-dot="${index}"></button>`)
    .join("");

  return `
    <div class="carousel" data-carousel>
      <div class="carousel__track">${track}</div>
      <div class="carousel__controls">
        <button class="carousel__button" data-carousel-prev>←</button>
        <div class="carousel__dots">${dots}</div>
        <button class="carousel__button" data-carousel-next>→</button>
      </div>
    </div>
  `;
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
  if (parts[0] === "room") {
    return renderRoomDetail(parts[1]);
  }
  if (parts[0] === "service") {
    return renderServiceDetail(parts[1]);
  }
  if (parts[0] === "master") {
    return renderMasterDetail(parts[1]);
  }

  switch (path) {
    case "/":
    case "/home":
      return renderHome();
    case "/accommodation":
      return renderAccommodation();
    case "/services":
      return renderServices();
    case "/masters":
      return renderMasters();
    case "/practices":
      return renderPractices();
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

function renderShell({ content, headerActions = [], activeTab }) {
  const brandTitle = state.data.home?.hero?.title || state.data.app?.name || "";
  const brandKicker = state.data.home?.hero?.kicker || "Ретритный центр";
  const resolvedTab = activeTab || getActiveTab(parseRoute().path);
  const actions = headerActions
    .map(
      (action) => `
        <button class="btn ${action.variant || "btn--ghost"} btn--small" data-nav="#${action.href}">
          ${action.label}
        </button>
      `
    )
    .join("");

  return {
    html: `
      <div class="app-shell">
        <header class="topbar">
          <div class="brand">
            <div class="brand__kicker">${brandKicker}</div>
            <div class="brand__title">${brandTitle}</div>
          </div>
          ${actions ? `<div class="topbar__actions">${actions}</div>` : ""}
        </header>
        <main class="page">
          ${content}
        </main>
      </div>
      ${renderTabBar(resolvedTab)}
    `
  };
}

function renderTabBar(activeTab) {
  const tabs = [
    { id: "home", label: "Главная", route: "/home", icon: "home" },
    { id: "accommodation", label: "Размещение", route: "/accommodation", icon: "bed" },
    { id: "services", label: "Услуги", route: "/services", icon: "spark" },
    { id: "masters", label: "Мастера", route: "/masters", icon: "masters" },
    { id: "contact", label: "Контакты", route: "/contact", icon: "chat" }
  ];

  const items = tabs
    .map(
      (tab) => `
        <button class="tabbar__item ${activeTab === tab.id ? "tabbar__item--active" : ""}" data-nav="#${tab.route}">
          ${renderIcon(tab.icon)}
          <span>${tab.label}</span>
        </button>
      `
    )
    .join("");

  return `<nav class="tabbar">${items}</nav>`;
}

function getActiveTab(path) {
  if (path.startsWith("/accommodation")) return "accommodation";
  if (path.startsWith("/services") || path.startsWith("/practices") || path.startsWith("/kitchen") || path.startsWith("/service")) return "services";
  if (path.startsWith("/masters") || path.startsWith("/master")) return "masters";
  if (path.startsWith("/contact") || path.startsWith("/request")) return "contact";
  return "home";
}

function renderHome() {
  const { app, home, gallery } = state.data;
  const heroImage = home.hero.image;
  const heroMedia = heroImage
    ? `<div class="hero__media" style="background-image: url('${heroImage}')"></div>`
    : `<div class="hero__media hero__media--placeholder">Фото локации</div>`;

  const benefits = home.benefits
    .map(
      (benefit, index) => `
        <article class="card feature-card reveal" style="--delay:${index * 80}ms">
          ${renderIcon(benefit.icon)}
          <div>
            <h3 class="card__title">${benefit.title}</h3>
            <p class="card__text">${benefit.text}</p>
          </div>
        </article>
      `
    )
    .join("");

  const quickActions = home.quickActions
    .map(
      (action, index) => `
        <button class="card action-card reveal" style="--delay:${index * 70}ms" data-nav="#${action.route}">
          ${renderIcon(action.icon)}
          <span>${action.label}</span>
        </button>
      `
    )
    .join("");

  const previewItems = getGalleryPreviewItems(gallery, 4);
  const previewMarkup = previewItems
    .map(
      (item, index) => {
        const source = item.thumb || item.src || "";
        return `
          <div class="media-card reveal" style="--delay:${index * 60}ms">
            ${source ? `<img src="${source}" alt="${item.caption || ""}" loading="lazy" />` : "<div class=\"media-placeholder\">Фото</div>"}
          </div>
        `;
      }
    )
    .join("");

  const content = `
    <section class="hero">
      ${heroMedia}
      <div class="hero__content">
        <div class="hero__kicker">${home.hero.kicker}</div>
        <h1>${home.hero.title}</h1>
        <div class="hero__subtitle">${home.hero.subtitle}</div>
        <p class="hero__description">${home.hero.description}</p>
        <div class="hero__actions">
          <button class="btn btn--primary" data-nav=\"#/request/dates\">Запросить даты</button>
          <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Почему выбирают нас</h2>
      <div class="section-grid">
        ${benefits}
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Быстрые действия</h2>
      <div class="action-grid">
        ${quickActions}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">${home.galleryPreview.title}</h2>
          <div class="section-subtitle">${home.galleryPreview.subtitle}</div>
        </div>
        <button class="btn btn--ghost btn--small" data-nav=\"#${home.galleryPreview.route}\">Смотреть все</button>
      </div>
      <div class="media-grid">
        ${previewMarkup}
      </div>
    </section>
    <section class="cta-panel">
      <div>
        <h2 class="section-title">${home.cta.title}</h2>
        <div class="section-subtitle">${home.cta.text}</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#${home.cta.primary.route}\">${home.cta.primary.label}</button>
        <button class="btn btn--ghost" data-nav=\"#${home.cta.secondary.route}\">${home.cta.secondary.label}</button>
      </div>
    </section>
  `;

  return renderShell({ content, activeTab: "home" });
}

function renderAccommodation() {
  const { accommodation, kitchen } = state.data;
  const roomFund = accommodation.roomFund;

  const stats = [
    { id: "rooms", label: "Номеров", value: roomFund.units, icon: "bed" },
    { id: "avg", label: "Средняя вместимость", value: `${roomFund.averageCapacity} мест`, icon: "people" },
    { id: "max", label: "Макс. вместимость", value: `${roomFund.maxCapacity} человек`, icon: "people" }
  ]
    .map(
      (item) => `
        <div class="stat-card">
          ${renderIcon(item.icon)}
          <div>
            <div class="stat-card__value">${item.value}</div>
            <div class="stat-card__label">${item.label}</div>
          </div>
        </div>
      `
    )
    .join("");

  const typesMarkup = accommodation.types
    .map((type) => {
      const media = type.photos?.[0]
        ? `<img src="${type.photos[0]}" alt="${type.title}" />`
        : `<div class="room-card__placeholder">Фото номера</div>`;
      const capacityLabel = type.capacityMin && type.capacityMax
        ? `${type.capacityMin}–${type.capacityMax} гостя`
        : "Вместимость по запросу";
      const features = Array.isArray(type.features) ? type.features.slice(0, 2) : [];
      const priceLabel = type.price?.text || "Цена по запросу";
      return `
        <article class="room-card">
          <div class="room-card__media">${media}</div>
          <div class="room-card__body">
            <div class="room-card__header">
              <h3 class="card__title">${type.title}</h3>
              ${type.badge ? `<span class="tag">${type.badge}</span>` : ""}
            </div>
            <div class="room-card__subtitle clamp-2">${type.subtitle}</div>
            <div class="room-card__meta">
              <span>${renderIcon("people")}${capacityLabel}</span>
              ${features.map((item) => `<span>${renderIcon("check")}${item}</span>`).join("")}
            </div>
            <div class="room-card__actions">
              <span class="chip">${priceLabel}</span>
              <div class="room-card__buttons">
                <button class="btn btn--primary btn--small" data-nav=\"#/request/room?roomId=${type.id}\">Запросить</button>
                <button class="btn btn--text" data-nav=\"#/room/${type.id}\">Подробнее</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const formats = Array.isArray(accommodation.formats) ? accommodation.formats : [];
  const formatsMarkup = formats
    .map(
      (format) => `
        <div class="card format-card">
          <h3 class="card__title">${format.title}</h3>
          <p class="card__text">${format.text}</p>
        </div>
      `
    )
    .join("");
  const formatsSection = formats.length
    ? `
    <section class="section">
      <h2 class="section-title">Варианты размещения</h2>
      <div class="section-grid">
        ${formatsMarkup}
      </div>
    </section>
  `
    : "";

  const hall = accommodation.practiceHall;
  const hallFeatures = hall.features.map((feature) => `<span class="pill">${feature}</span>`).join("");

  const cateringCards = accommodation.catering.packages
    .map((pkg) => {
      const rate = getKitchenMinRate(kitchen, pkg.foodType);
      const priceLine = rate ? `от ${formatCurrency(rate)} / чел. в день` : "Цена по запросу";
      return `
        <div class="card catering-card">
          <div class="catering-card__header">
            ${renderIcon("food")}
            <div>
              <h3 class="card__title">${pkg.title}</h3>
              <div class="card__text">${pkg.description}</div>
            </div>
          </div>
          <div class="price-tag price-tag--soft">${priceLine}</div>
        </div>
      `;
    })
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">Размещение</h1>
      <div class="page-subtitle">Номерной фонд, комфорт и гибкие условия для групп.</div>
    </section>
    <section class="card card--strong">
      <h2 class="section-title">Весь номерной фонд</h2>
      <div class="stats-grid">
        ${stats}
      </div>
      <div class="note">${roomFund.note}</div>
    </section>
    <section class="section">
      <h2 class="section-title">Типы размещения</h2>
      <div class="room-grid">
        ${typesMarkup}
      </div>
    </section>
    ${formatsSection}
    <section class="card card--strong">
      <div class="section-header">
        <div>
          <h2 class="section-title">${hall.title}</h2>
          <div class="section-subtitle">${hall.subtitle}</div>
        </div>
        <div class="hall-meta">
          <span>${renderIcon("hall")} ${hall.area}</span>
          <span>${renderIcon("people")} ${hall.capacity}</span>
        </div>
      </div>
      <div class="pill-row">${hallFeatures}</div>
    </section>
    <section class="section">
      <h2 class="section-title">${accommodation.catering.title}</h2>
      <div class="section-subtitle">${accommodation.catering.description}</div>
      <div class="section-grid">
        ${cateringCards}
      </div>
      <div class="cta-row">
        <button class="btn btn--ghost btn--small" data-nav=\"#/kitchen\">Смотреть тарифы</button>
      </div>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Готовы обсудить детали?</h2>
        <div class="section-subtitle">Мы подберем формат размещения и ответим на вопросы.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#/request/dates\">Запросить даты</button>
        <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
      </div>
    </div>
  `;

  return renderShell({ content, activeTab: "accommodation" });
}

function renderRoomDetail(roomId) {
  const { accommodation } = state.data;
  const room = accommodation.types.find((item) => item.id === roomId);
  if (!room) {
    return renderNotFound();
  }

  const carousel = renderCarousel(room.photos, room.title);
  const features = (room.features || []).map((item) => `<li>${item}</li>`).join("");
  const included = (accommodation.included || []).map((item) => `<li>${item}</li>`).join("");
  const conditions = (accommodation.conditions || []).map((item) => `<li>${item}</li>`).join("");
  const priceLabel = room.price?.text || "Цена по запросу";

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${room.title}</h1>
      <div class="page-subtitle">${room.subtitle}</div>
    </section>
    <section class="card card--strong">
      ${carousel}
    </section>
    <section class="card">
      <h2 class="section-title">Описание</h2>
      <p class="card__text">${room.description}</p>
      <div class="pill-row">
        <span class="pill">${priceLabel}</span>
        <span class="pill">${room.capacityMin}–${room.capacityMax} гостя</span>
      </div>
    </section>
    <section class="card">
      <h2 class="section-title">Что включено</h2>
      <ul class="list">${included}</ul>
    </section>
    <section class="card">
      <h2 class="section-title">Особенности номера</h2>
      <ul class="list">${features}</ul>
    </section>
    <section class="card">
      <h2 class="section-title">Условия</h2>
      <ul class="list">${conditions}</ul>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Запросить стоимость</h2>
        <div class="section-subtitle">Ответим по доступности и условиям.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#/request/room?roomId=${room.id}\">Запросить</button>
        <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
      </div>
    </div>
  `;

  return {
    ...renderShell({ content, activeTab: "accommodation" }),
    bind: bindCarousels
  };
}

function renderServices() {
  const { services } = state.data;

  const extras = services.extras.items
    .map(
      (item) => `
        <button class="service-card" data-nav=\"#/service/${item.id}\">
          <div class="service-card__icon">${renderIcon(item.icon)}</div>
          <div class="service-card__content">
            <div class="service-card__title">${item.title}</div>
            <div class="service-card__text clamp-1">${item.short}</div>
          </div>
          <div class="service-card__more">Подробнее</div>
        </button>
      `
    )
    .join("");

  const supportCards = services.organizerSupport.items
    .map(
      (item) => `
        <article class="card service-card--compact">
          ${renderIcon(item.icon)}
          <div>
            <h3 class="card__title">${item.title}</h3>
            <p class="card__text">${item.text}</p>
          </div>
        </article>
      `
    )
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">Услуги</h1>
      <div class="page-subtitle">Поддержка организаторов, сервис для гостей и мероприятия.</div>
    </section>
    <section class="section">
      <h2 class="section-title">${services.extras.title}</h2>
      <div class="service-grid">
        ${extras}
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">${services.organizerSupport.title}</h2>
      <div class="section-grid">
        ${supportCards}
      </div>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Нужна помощь с услугами?</h2>
        <div class="section-subtitle">Подберем формат и условия под вашу группу.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#/request/service\">Записаться</button>
        <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
      </div>
    </div>
  `;

  return renderShell({ content, activeTab: "services" });
}

function renderServiceDetail(serviceId) {
  const { services } = state.data;
  const service = services.extras.items.find((item) => item.id === serviceId);
  if (!service) {
    return renderNotFound();
  }

  const carousel = renderCarousel(service.photos, service.title);
  const includes = (service.includes || []).map((item) => `<li>${item}</li>`).join("");
  const params = (service.params || [])
    .map((param) => `<span class="pill">${param.label}: ${param.value}</span>`)
    .join("");
  const faq = (service.faq || [])
    .map(
      (item) => `
        <details class="accordion-item">
          <summary>${item.question}</summary>
          <div class="accordion-content">${item.answer}</div>
        </details>
      `
    )
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${service.title}</h1>
      <div class="page-subtitle">${service.short}</div>
    </section>
    <section class="card card--strong">
      ${carousel}
    </section>
    <section class="card">
      <h2 class="section-title">Описание</h2>
      <p class="card__text">${service.description}</p>
      <div class="pill-row">${params}</div>
    </section>
    <section class="card">
      <h2 class="section-title">Что входит</h2>
      <ul class="list">${includes}</ul>
    </section>
    ${faq ? `<section class=\"card\"><h2 class=\"section-title\">FAQ</h2>${faq}</section>` : ""}
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Записаться / Узнать условия</h2>
        <div class="section-subtitle">Ответим по формату и стоимости.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#/request/service?serviceId=${service.id}\">Записаться</button>
        <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
      </div>
    </div>
  `;

  return {
    ...renderShell({ content, activeTab: "services" }),
    bind: bindCarousels
  };
}

function renderMasters() {
  const { masters } = state.data;
  const cards = masters.items
    .map((master) => {
      const avatar = master.photos?.[0]
        ? `<img src="${master.photos[0]}" alt="${master.name}" />`
        : `<span class="avatar__placeholder">${master.name.charAt(0)}</span>`;
      const tags = (master.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
      return `
        <article class="card master-card">
          <div class="master-card__header">
            <div class="avatar">${avatar}</div>
            <div>
              <h3 class="card__title">${master.name}</h3>
              <div class="card__text">${master.role}</div>
            </div>
          </div>
          <div class="card__text clamp-2">${master.bioShort}</div>
          <div class="tag-row">${tags}</div>
          <div class="master-card__actions">
            <div class="socials">${renderSocialLinks(master.socials)}</div>
            <button class="btn btn--primary btn--small" data-nav=\"#/master/${master.id}\">Написать</button>
          </div>
        </article>
      `;
    })
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${masters.title}</h1>
      <div class="page-subtitle">Команда специалистов и локальные мастера.</div>
    </section>
    <section class="section">
      <div class="section-grid">
        ${cards}
      </div>
    </section>
  `;

  return renderShell({ content, activeTab: "masters" });
}

function renderMasterDetail(masterId) {
  const { masters, services } = state.data;
  const master = masters.items.find((item) => item.id === masterId);
  if (!master) {
    return renderNotFound();
  }

  const carousel = renderCarousel(master.photos, master.name);
  const tags = (master.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
  const linked = (master.linkedServices || [])
    .map((id) => services.extras.items.find((item) => item.id === id))
    .filter(Boolean)
    .map((service) => `<li>${service.title}</li>`)
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${master.name}</h1>
      <div class="page-subtitle">${master.role}</div>
      <div class="tag-row">${tags}</div>
    </section>
    <section class="card card--strong">
      ${carousel}
    </section>
    <section class="card">
      <h2 class="section-title">О мастере</h2>
      <p class="card__text">${master.bioFull}</p>
    </section>
    ${linked ? `<section class=\"card\"><h2 class=\"section-title\">Услуги мастера</h2><ul class=\"list\">${linked}</ul></section>` : ""}
    <section class="card">
      <h2 class="section-title">Контакты</h2>
      <div class="socials">${renderSocialLinks(master.socials)}</div>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Связаться с мастером</h2>
        <div class="section-subtitle">Ответим по доступности и формату.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav=\"#/request/master?masterId=${master.id}\">Запросить запись</button>
        <button class="btn btn--ghost" data-nav=\"#/contact\">Связаться</button>
      </div>
    </div>
  `;

  return {
    ...renderShell({ content, activeTab: "masters" }),
    bind: bindCarousels
  };
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
    <section class="page-hero">
      <h1 class="page-title">Практики и услуги</h1>
      <div class="page-subtitle">Каталог активностей и ритуалов для вашей группы.</div>
    </section>
    <section class="card card--strong">
      <div class="section-subtitle">Подберите формат, длительность и атмосферу под вашу группу.</div>
      <div class="filters">${filterBlocks}</div>
    </section>
    <section class="practice-grid">
      ${practiceCards || `<div class="card">Нет практик по выбранным фильтрам.</div>`}
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Нужна рекомендация?</h2>
        <div class="section-subtitle">Мы поможем собрать программу под ваши даты.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav="#/request/practices">Подобрать практики</button>
        <button class="btn btn--ghost" data-nav="#/request/turnkey">Оставить заявку организатора</button>
      </div>
    </div>
  `;

  return {
    ...renderShell({ content, activeTab: "services" }),
    bind: bindPracticeFilters
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
    <section class="page-hero">
      <h1 class="page-title">Кухня и питание</h1>
      <div class="page-subtitle">Гибкая сетка питания и дополнительные опции.</div>
    </section>
    <section class="card card--strong">
      ${kitchen.price.mode === "price" ? tiersTable : `<div class="note">Тарифы по запросу.</div>`}
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
      <div class="note">Расчёт ориентировочный, итог подтверждает администратор.</div>
    </section>
  `;

  return {
    ...renderShell({ content, activeTab: "services" }),
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
    <section class="page-hero">
      <h1 class="page-title">Галерея</h1>
      <div class="page-subtitle">Атмосфера центра и пространства.</div>
    </section>
    <section class="card card--strong">
      <div class="tabs">${tabs}</div>
    </section>
    <section class="gallery-grid">${items}</section>
  `;

  return {
    ...renderShell({ content, activeTab: "home" }),
    bind: bindGalleryTabs
  };
}

function renderShop() {
  const { shop } = state.data;
  const items = shop.items
    .map((item) => `<li>${item.label}</li>`)
    .join("");

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${shop.title}</h1>
      <div class="page-subtitle">${shop.description}</div>
    </section>
    <section class="card">
      <h3 class="card__title">Возможные позиции</h3>
      <ul class="list">${items}</ul>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Интересует мерч?</h2>
        <div class="section-subtitle">Оставьте заявку, и мы сообщим о запуске.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav="#/request/shop">${shop.cta}</button>
      </div>
    </div>
  `;

  return renderShell({ content, activeTab: "home" });
}

function renderContact() {
  const { app } = state.data;
  const contacts = app.contacts || {};
  const phone = contacts.phone || "";
  const telegram = contacts.telegram || "";
  const whatsapp = contacts.whatsapp || "";
  const address = contacts.address || "";

  const content = `
    <section class="page-hero">
      <h1 class="page-title">Контакты</h1>
      <div class="page-subtitle">Будем рады обсудить сотрудничество и подобрать формат.</div>
    </section>
    <section class="card card--strong">
      ${contacts.note ? `<div class="note">${contacts.note}</div>` : ""}
      <div class="contact-grid">
        <div class="contact-card">
          ${renderIcon("phone")}
          <div>
            <div class="contact-card__label">Телефон</div>
            <div class="contact-card__value">${phone || "Уточните у менеджера"}</div>
          </div>
        </div>
        <div class="contact-card">
          ${renderIcon("pin")}
          <div>
            <div class="contact-card__label">Локация</div>
            <div class="contact-card__value">${address || "Алтай"}</div>
          </div>
        </div>
      </div>
      <div class="contact-actions">
        ${telegram ? `<a class="btn btn--primary" href="${telegram}" target="_blank" rel="noopener">Telegram</a>` : ""}
        ${whatsapp ? `<a class="btn btn--ghost" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
      </div>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Оставить заявку</h2>
        <div class="section-subtitle">Заполните форму — мы свяжемся с вами лично.</div>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav="#/request/dates">Запросить даты</button>
        <button class="btn btn--ghost" data-nav="#/request/room">Запросить стоимость</button>
      </div>
    </div>
  `;

  return renderShell({ content, activeTab: "contact" });
}

function renderSuccess() {
  const afterSubmit = state.data.forms.afterSubmit;
  const message = state.ui.lastSuccess || afterSubmit;
  const backRoute = state.ui.lastRoute || "#/home";
  const content = `
    <div class="modal">
      <div class="modal__card">
        <h2 class="section-title">${message.title}</h2>
        <div class="card__text">${message.message}</div>
        <button class="btn btn--primary" data-nav="${backRoute}">Ок</button>
      </div>
    </div>
  `;
  return renderShell({ content, activeTab: "home" });
}

function renderNotFound() {
  const content = `
    <section class="page-hero">
      <h1 class="page-title">Раздел не найден</h1>
      <div class="page-subtitle">Вернитесь на главную и выберите нужный раздел.</div>
    </section>
    <div class="cta-panel">
      <div>
        <h2 class="section-title">Перейти на главную</h2>
      </div>
      <div class="cta-panel__actions">
        <button class="btn btn--primary" data-nav="#/">На главную</button>
      </div>
    </div>
  `;
  return renderShell({ content, activeTab: "home" });
}

function renderRequestForm(type, query) {
  if (!type || !state.data.forms.requests[type]) {
    return renderNotFound();
  }

  const { forms, practices, shop, accommodation, services, masters } = state.data;
  const formConfig = forms.requests[type];
  const commonFields = forms.common.fields;
  const fields = mergeFields(formConfig.fields, commonFields);
  const prefill = buildPrefill(type, query);

  const fieldsMarkup = fields
    .map((field) => renderField(field, prefill, { practices, shop, accommodation, services, masters }))
    .join("");

  const foodEstimate = (type === "accommodation" || type === "turnkey")
    ? `<div class="calc-output" id="foodEstimate">Укажите количество гостей и тип питания.</div>`
    : "";

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${formConfig.title}</h1>
      <div class="page-subtitle">Заполните форму, администратор свяжется с вами.</div>
    </section>
    <form class="card form" id="requestForm">
      <div class="form-errors" id="formErrors" aria-live="polite"></div>
      ${fieldsMarkup}
      ${foodEstimate ? `<div class=\"field\">${foodEstimate}<div class=\"hint\">Ориентировочно, финально уточняет админ.</div></div>` : ""}
      <button class="btn btn--primary" type="submit">Отправить заявку</button>
    </form>
  `;

  return {
    ...renderShell({ content, activeTab: "contact" }),
    bind: () => bindRequestForm(type, fields)
  };
}

function renderField(field, prefill, context) {
  const value = prefill[field.id];
  const label = `${field.label}${field.required ? " *" : ""}`;
  const id = `field_${field.id}`;

  if (field.type === "select") {
    let options = field.options || [];
    if (field.optionsSource === "accommodation") {
      options = context.accommodation.types.map((item) => ({ value: item.id, label: item.title }));
    }
    if (field.optionsSource === "services") {
      options = context.services.extras.items.map((item) => ({ value: item.id, label: item.title }));
    }
    if (field.optionsSource === "masters") {
      options = context.masters.items.map((item) => ({ value: item.id, label: item.name }));
    }

    const optionsMarkup = options
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
          ${optionsMarkup}
        </select>
      </div>
    `;
  }

  if (field.type === "multiselect") {
    let options = field.options || [];
    if (field.dataSource === "practices.json") {
      options = context.practices.practices.map((item) => ({ value: item.id, label: item.title }));
    }
    if (field.optionsSource === "shop.json") {
      options = context.shop.items.map((item) => ({ value: item.id, label: item.label }));
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

  if (field.type === "segmented") {
    const options = field.options || [];
    const currentValue = value || "";
    const buttons = options
      .map(
        (option) => `
          <button type="button" class="segment ${currentValue === option.value ? "segment--active" : ""}" data-segment="${option.value}" data-segment-group="${field.id}">
            ${option.label}
          </button>
        `
      )
      .join("");

    return `
      <div class="field">
        <label>${label}</label>
        <div class="segment-group">
          ${buttons}
          <input type="hidden" name="${field.id}" value="${currentValue}" />
        </div>
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

  const roomId = query.get("roomId");
  if (roomId) {
    prefill.roomId = roomId;
  }

  const serviceId = query.get("serviceId");
  if (serviceId) {
    prefill.serviceId = serviceId;
  }

  const masterId = query.get("masterId");
  if (masterId) {
    prefill.masterId = masterId;
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

function bindCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    if (!track || slides.length === 0) return;

    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
      });
    };

    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      index = index === 0 ? slides.length - 1 : index - 1;
      update();
    });

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      index = index === slides.length - 1 ? 0 : index + 1;
      update();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        index = Number(dot.getAttribute("data-carousel-dot")) || 0;
        update();
      });
    });
  });
}

function bindRequestForm(type, fields) {
  const form = document.getElementById("requestForm");
  const errors = document.getElementById("formErrors");
  const submitButton = form.querySelector("button[type=submit]");

  bindSegments(form);

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
      state.ui.lastRoute = window.location.hash || "#/home";
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

function bindSegments(form) {
  form.querySelectorAll("[data-segment-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.getAttribute("data-segment-group");
      const value = button.getAttribute("data-segment");
      if (!group) return;
      const hidden = form.querySelector(`input[name=\"${group}\"]`);
      if (hidden) {
        hidden.value = value;
      }
      form.querySelectorAll(`[data-segment-group=\"${group}\"]`).forEach((item) => {
        item.classList.toggle("segment--active", item === button);
      });
    });
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

function getGalleryPreviewItems(gallery, limit) {
  if (!gallery?.albums) {
    return Array.from({ length: limit }, () => ({ src: "" }));
  }
  const items = gallery.albums.flatMap((album) => album.items || []);
  if (!items.length) {
    return Array.from({ length: limit }, () => ({ src: "" }));
  }
  return items.slice(0, limit);
}

function getKitchenMinRate(kitchen, foodType) {
  if (!kitchen?.tiers?.length) return null;
  const values = kitchen.tiers
    .map((tier) => tier.rates?.[foodType])
    .filter((value) => typeof value === "number");
  if (!values.length) return null;
  return Math.min(...values);
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
