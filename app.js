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
    lastRoute: null,
    lightbox: null
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

  home: "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  bed: "<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\" /><path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\" /><path d=\"M12 4v6\" /><path d=\"M2 18h20\" />",
  spark: "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /><path d=\"M20 2v4\" /><path d=\"M22 4h-4\" /><circle cx=\"4\" cy=\"20\" r=\"2\" />",
  calendar: "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  chat: "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\" />",
  phone: "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />",
  masters: "<path d=\"M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z\" /><path d=\"M8 15H7a4 4 0 0 0-4 4v2\" /><circle cx=\"10\" cy=\"7\" r=\"4\" />",
  leaf: "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\" /><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" />",
  silence: "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\" /><line x1=\"22\" x2=\"16\" y1=\"9\" y2=\"15\" /><line x1=\"16\" x2=\"22\" y1=\"9\" y2=\"15\" />",
  pin: "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
  people: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /><circle cx=\"9\" cy=\"7\" r=\"4\" />",
  price: "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  check: "<path d=\"M20 6 9 17l-5-5\" />",
  hall: "<rect width=\"18\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" />",
  food: "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /><path d=\"M7 2v20\" /><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />",
  steam: "<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\" /><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\" /><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\" />",
  massage: "<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\" /><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\" /><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\" /><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\" />",
  sound: "<path d=\"M2 10v3\" /><path d=\"M6 6v11\" /><path d=\"M10 3v18\" /><path d=\"M14 8v7\" /><path d=\"M18 5v13\" /><path d=\"M22 10v3\" />",
  plan: "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /><path d=\"M12 11h4\" /><path d=\"M12 16h4\" /><path d=\"M8 11h.01\" /><path d=\"M8 16h.01\" />",
  support: "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\" /><path d=\"M21 16v2a4 4 0 0 1-4 4h-5\" />",
  logistics: "<path d=\"M8 6v6\" /><path d=\"M15 6v6\" /><path d=\"M2 12h19.6\" /><path d=\"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3\" /><circle cx=\"7\" cy=\"18\" r=\"2\" /><path d=\"M9 18h5\" /><circle cx=\"16\" cy=\"18\" r=\"2\" />",
  team: "<path d=\"M18 21a8 8 0 0 0-16 0\" /><circle cx=\"10\" cy=\"8\" r=\"5\" /><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\" />",
  shield: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />",
  tea: "<path d=\"m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8\" /><path d=\"M5 8h14\" /><path d=\"M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0\" /><path d=\"m12 8 1-6h2\" />",
  lotus: "<path d=\"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1\" /><circle cx=\"12\" cy=\"8\" r=\"2\" /><path d=\"M12 10v12\" /><path d=\"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z\" /><path d=\"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z\" />",
  music: "<circle cx=\"8\" cy=\"18\" r=\"4\" /><path d=\"M12 18V2l7 4\" />",
  brush: "<path d=\"m14.622 17.897-10.68-2.913\" /><path d=\"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z\" /><path d=\"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15\" />",
  craft: "<path d=\"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z\" /><circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\" /><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\" /><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\" /><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  drum: "<path d=\"m2 2 8 8\" /><path d=\"m22 2-8 8\" /><ellipse cx=\"12\" cy=\"9\" rx=\"10\" ry=\"5\" /><path d=\"M7 13.4v7.9\" /><path d=\"M12 14v8\" /><path d=\"M17 13.4v7.9\" /><path d=\"M2 9v8a10 5 0 0 0 20 0V9\" />",
  telegram: "<path d=\"M21 5L3 12l6 2 2 6 10-15z\"/><path d=\"M9 14l12-9\"/>",
  instagram: "<rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\" /><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\" /><line x1=\"17.5\" x2=\"17.51\" y1=\"6.5\" y2=\"6.5\" />",
  globe: "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
  back: "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  share: "<circle cx=\"18\" cy=\"5\" r=\"3\" /><circle cx=\"6\" cy=\"12\" r=\"3\" /><circle cx=\"18\" cy=\"19\" r=\"3\" /><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />",

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

function buildRequestRoute(type, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, value);
  });
  const query = search.toString();
  return `#/request/${type}${query ? `?${query}` : ""}`;
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

function normalizeRoute(route) {
  if (!route) return "/home";
  const normalized = route.replace(/^#/, "");
  return normalized || "/home";
}

function getActiveGalleryAlbum() {
  const { gallery } = state.data;
  if (!gallery?.albums?.length) return null;
  return gallery.albums.find((album) => album.id === state.ui.galleryAlbumId) || gallery.albums[0];
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
  bindShareButtons();
  if (content.bind) {
    content.bind();
  }
  bindLightbox();
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
    return renderMasterDetail(parts[1], query);
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
      return renderGallery(query);
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
  const { path } = parseRoute();
  const showBack = path !== "/" && path !== "/home";
  const backRoute = normalizeRoute(state.ui.lastRoute || "/home");
  const actions = [
    ...(showBack
      ? [
          {
            href: backRoute,
            label: `${renderIcon("back")}Назад`,
            variant: "btn--ghost"
          }
        ]
      : []),
    ...headerActions
  ]
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
      ${renderLightbox()}
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
  const { accommodation, kitchen, gallery } = state.data;
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
  const hallAlbum = gallery?.albums?.find((album) => album.id === hall.galleryAlbumId);
  const hallPreviewItems = (hallAlbum?.items || []).filter((item) => item.type === "image").slice(0, 4);
  const hallPreview = hallPreviewItems.length
    ? `
      <div class="media-grid hall-card__media">
        ${hallPreviewItems
          .map(
            (item) => `
              <div class="media-card">
                <img src="${item.thumb || item.src}" alt="${hall.title}" loading="lazy" />
              </div>
            `
          )
          .join("")}
      </div>
    `
    : "";
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
    <button class="card card--strong hall-card" type="button" data-nav="#/gallery?album=${hall.galleryAlbumId || "practice-hall"}">
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
      ${hall.description ? `<p class="card__text">${hall.description}</p>` : ""}
      <div class="pill-row">${hallFeatures}</div>
      ${hallPreview}
      <div class="hall-card__cta">${hall.ctaLabel || "Смотреть фото и описание"}</div>
    </button>
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
  const detailIntro = service.detail?.intro
    ? `
      <section class="card">
        <h2 class="section-title">${service.detail.intro.title}</h2>
        <div class="section-subtitle">${service.detail.intro.subtitle}</div>
      </section>
    `
    : "";
  const programCards = (service.detail?.programs || [])
    .map((program) => {
      const paragraphs = (program.paragraphs || [])
        .map((text) => `<p class="card__text">${text}</p>`)
        .join("");
      const about = program.about
        ? `
          <div class="massage-card__section">
            <h3 class="massage-card__subtitle">${program.about.title}</h3>
            ${program.about.intro ? `<div class="card__text">${program.about.intro}</div>` : ""}
            <ul class="list list--bulleted">
              ${(program.about.items || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        `
        : "";
      const session = program.session
        ? `
          <div class="massage-card__section">
            <h3 class="massage-card__subtitle">${program.session.title}</h3>
            <ol class="list list--numbered">
              ${(program.session.steps || [])
                .map((step) => {
                  const items = (step.items || []).length
                    ? `<ul class="list list--bulleted massage-card__nested">
                        ${step.items.map((item) => `<li>${item}</li>`).join("")}
                      </ul>`
                    : "";
                  return `
                    <li>
                      <span class="massage-card__step-title">${step.title}</span>
                      ${step.text ? `<div class="card__text">${step.text}</div>` : ""}
                      ${items}
                    </li>
                  `;
                })
                .join("")}
            </ol>
          </div>
        `
        : "";
      const results = program.results
        ? `
          <div class="massage-card__section">
            <h3 class="massage-card__subtitle">${program.results.title}</h3>
            <ul class="list list--bulleted">
              ${(program.results.items || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        `
        : "";
      const prices = (program.prices || [])
        .map(
          (price) => `
            <div class="massage-card__price">
              <div class="massage-card__price-title">${price.label}</div>
              ${price.note ? `<div class="card__text">${price.note}</div>` : ""}
            </div>
          `
        )
        .join("");
      const contact = program.contact?.phone
        ? `
          <div class="massage-card__cta">
            ${program.cta || "Записаться на программу"} ${program.contact.phone} ${program.contact.name || ""}
          </div>
        `
        : "";
      return `
        <article class="practice-card massage-card">
          <h3 class="practice-card__title">${program.title}</h3>
          ${program.lead ? `<div class="massage-card__lead">${program.lead}</div>` : ""}
          ${paragraphs}
          ${about}
          ${session}
          ${results}
          ${prices ? `<div class="massage-card__prices">${prices}</div>` : ""}
          ${contact}
        </article>
      `;
    })
    .join("");
  const programsSection = programCards
    ? `
      <section class="section">
        <h2 class="section-title">Программы массажа</h2>
        <div class="master-practices">
          ${programCards}
        </div>
      </section>
    `
    : "";

  const content = `
    <section class="page-hero">
      <h1 class="page-title">${service.title}</h1>
      <div class="page-subtitle">${service.short}</div>
    </section>
    ${detailIntro}
    <section class="card card--strong">
      ${carousel}
    </section>
    <section class="card">
      <h2 class="section-title">Описание</h2>
      <p class="card__text">${service.description}</p>
      <div class="pill-row">${params}</div>
    </section>
    ${programsSection}
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
      const tags = (master.tags || []).map((tag) => `<span class="master-chip">${tag}</span>`).join("");
      const anchor = master.anchor || master.bioShort || "";
      const priceLine = master.priceLine || "";
      const detailRoute = `#/master/${master.id}`;
      const focusRoute = master.practices?.length ? `${detailRoute}?focus=practices` : detailRoute;
      const ctaLabel = master.cardCtaLabel || "Подробнее";
      return `
        <article class="master-card master-card--premium" data-nav="${detailRoute}">
          <div class="avatar">${avatar}</div>
          <div class="master-card__content">
            <h3 class="master-card__name">${master.name}</h3>
            <div class="master-card__role">${master.role || ""}</div>
            ${tags ? `<div class="master-card__chips">${tags}</div>` : ""}
            ${anchor ? `<div class="master-card__anchor clamp-1">${anchor}</div>` : ""}
            ${priceLine ? `<div class="master-card__price">${priceLine}</div>` : ""}
            <div class="master-card__actions">
              <button class="btn btn--primary btn--small" data-nav="${focusRoute}">${ctaLabel}</button>
              <button class="btn btn--ghost btn--icon master-card__share" type="button" data-share-master="${master.id}" data-share-title="${master.name}" data-share-text="Мастер: ${master.name}" aria-label="Поделиться">
                ${renderIcon("share")}
              </button>
            </div>
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
      <div class="master-list">
        ${cards}
      </div>
    </section>
  `;

  return renderShell({ content, activeTab: "masters" });
}

function renderMasterDetail(masterId, query = new URLSearchParams()) {
  const { masters, services } = state.data;
  const master = masters.items.find((item) => item.id === masterId);
  if (!master) {
    return renderNotFound();
  }

  const heroImage = master.photos?.[0] || "";
  const aboutShort = master.bioSummary || master.bioShort || master.bioFull || "";
  const aboutFull = master.bioFull && master.bioFull !== aboutShort ? master.bioFull : "";
  const tags = (master.tags || []).map((tag) => `<span class="master-chip">${tag}</span>`).join("");
  const linked = (master.linkedServices || [])
    .map((id) => services.extras.items.find((item) => item.id === id))
    .filter(Boolean)
    .map((service) => `<li>${service.title}</li>`)
    .join("");

  const benefits = (master.benefits || [])
    .map(
      (benefit) => `
        <article class="benefit-card">
          ${renderIcon(benefit.icon)}
          <div class="benefit-card__title">${benefit.title}</div>
        </article>
      `
    )
    .join("");

  const practices = (master.practices || [])
    .map((practice) => {
      const meta = [practice.format, practice.duration, practice.price].filter(Boolean);
      const metaMarkup = meta.map((item) => `<span class="badge">${item}</span>`).join("");
      const note = practice.note ? `<div class="practice-card__note">${practice.note}</div>` : "";
      const actions = (practice.actions || [])
        .map((action, index) => {
          let route = "";
          if (action.route) {
            route = action.route;
          } else if (action.type === "tour") {
            route = buildRequestRoute("turnkey", { comment: `Добавить в тур: ${practice.title}` });
          } else if (action.type === "program") {
            route = buildRequestRoute("master", { masterId: master.id, comment: `Запросить программу: ${practice.title}` });
          } else if (action.type === "inquiry") {
            route = buildRequestRoute("master", { masterId: master.id, comment: `Запрос: ${practice.title}` });
          } else {
            route = buildRequestRoute("master", { masterId: master.id, comment: `Практика: ${practice.title}` });
          }

          const variant = action.variant || (index === 0 ? "primary" : "ghost");
          const size = action.size === "normal" ? "" : "btn--small";
          return `
            <button class="btn btn--${variant} ${size}" data-nav="${route}">
              ${action.label}
            </button>
          `;
        })
        .join("");

      return `
        <article class="practice-card">
          <h3 class="practice-card__title">${practice.title}</h3>
          ${metaMarkup ? `<div class="practice-card__meta">${metaMarkup}</div>` : ""}
          ${note}
          ${practice.description ? `<div class="practice-card__text">${practice.description}</div>` : ""}
          ${actions ? `<div class="practice-card__actions">${actions}</div>` : ""}
        </article>
      `;
    })
    .join("");

  const contraindications = (master.contraindications || [])
    .map((item) => `<li>${item}</li>`)
    .join("");

  const aboutMore = aboutFull
    ? `
        <details class="read-more">
          <summary class="btn btn--text">Читать полностью</summary>
          <div class="card__text">${aboutFull}</div>
        </details>
      `
    : "";

  const content = `
    <section class="master-hero ${heroImage ? "" : "master-hero--placeholder"}" ${heroImage ? `style="background-image: url('${heroImage}')"` : ""}>
      <div class="master-hero__actions">
        <button class="btn btn--ghost btn--icon master-hero__action" type="button" data-share-master="${master.id}" data-share-title="${master.name}" data-share-text="Мастер: ${master.name}" aria-label="Поделиться">
          ${renderIcon("share")}
        </button>
      </div>
      <div class="master-hero__content">
        <h1 class="master-hero__name">${master.name}</h1>
        <div class="master-hero__role">${master.role || ""}</div>
        ${tags ? `<div class="master-hero__tags">${tags}</div>` : ""}
      </div>
      ${heroImage ? "" : `<div class="master-hero__placeholder">Фото мастера</div>`}
    </section>
    <section class="card">
      <h2 class="section-title">О мастере</h2>
      ${aboutShort ? `<p class="card__text">${aboutShort}</p>` : ""}
      ${aboutMore}
    </section>
    ${benefits ? `<section class="card"><h2 class="section-title">Что даёт метод</h2><div class="master-benefits">${benefits}</div></section>` : ""}
    ${practices ? `<section class="section" id="master-practices"><h2 class="section-title">Практики</h2><div class="master-practices">${practices}</div></section>` : ""}
    ${!practices && linked ? `<section class=\"card\"><h2 class=\"section-title\">Услуги мастера</h2><ul class=\"list\">${linked}</ul></section>` : ""}
    ${contraindications ? `<section class="card alert-card"><details><summary><span>Важно: есть противопоказания</span><span class="alert-card__action">Открыть список</span></summary><ul class="list">${contraindications}</ul></details></section>` : ""}
    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">Контакты и соцсети</h2>
          <div class="section-subtitle">Ответим по доступности и формату.</div>
        </div>
        <button class="btn btn--ghost btn--small" data-nav="#/contact">Написать менеджеру</button>
      </div>
      <div class="socials">${renderSocialLinks(master.socials)}</div>
      <div class="cta-row">
        <button class="btn btn--primary" data-nav="#/request/master?masterId=${master.id}">Запросить проведение</button>
        <button class="btn btn--ghost" data-nav="#/contact">Связаться</button>
      </div>
    </section>
  `;

  return {
    ...renderShell({ content, activeTab: "masters" }),
    bind: () => {
      bindMasterProfile(query);
    }
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

function renderGallery(query = new URLSearchParams()) {
  const { gallery } = state.data;
  const requestedAlbum = query.get("album");
  if (requestedAlbum && gallery.albums.some((album) => album.id === requestedAlbum)) {
    state.ui.galleryAlbumId = requestedAlbum;
  }
  const activeAlbum = getActiveGalleryAlbum();

  const tabs = gallery.albums
    .map(
      (album) => `
        <button class="tab ${album.id === activeAlbum.id ? "tab--active" : ""}" data-gallery="${album.id}">
          ${album.title}
        </button>
      `
    )
    .join("");

  const items = activeAlbum?.items?.length
    ? activeAlbum.items
        .map((item, index) => {
          const media = item.type === "video"
            ? `<video src="${item.src}" preload="metadata" playsinline data-gallery-open data-gallery-index="${index}"></video>`
            : `<img src="${item.thumb || item.src}" alt="${item.caption || ""}" loading="lazy" data-gallery-open data-gallery-index="${index}" />`;
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

function openLightbox(items, index = 0) {
  if (!items || items.length === 0) return;
  const safeIndex = Math.max(0, Math.min(index, items.length - 1));
  const scrollY = window.scrollY;
  state.ui.lightbox = { items, index: safeIndex, scrollY };
  render();
  requestAnimationFrame(() => window.scrollTo(0, scrollY));
}

function closeLightbox() {
  if (!state.ui.lightbox) return;
  const scrollY = state.ui.lightbox.scrollY ?? window.scrollY;
  state.ui.lightbox = null;
  render();
  requestAnimationFrame(() => window.scrollTo(0, scrollY));
}

function stepLightbox(direction) {
  const lightbox = state.ui.lightbox;
  if (!lightbox || !lightbox.items?.length) return;
  const total = lightbox.items.length;
  lightbox.index = (lightbox.index + direction + total) % total;
  render();
}

function renderLightbox() {
  const lightbox = state.ui.lightbox;
  if (!lightbox || !lightbox.items?.length) return "";

  const item = lightbox.items[lightbox.index];
  const media = item.type === "video"
    ? `<video src="${item.src}" controls playsinline></video>`
    : `<img src="${item.src}" alt="${item.caption || ""}" />`;
  const caption = item.caption ? `<div class="lightbox__caption">${item.caption}</div>` : "";

  return `
    <div class="lightbox" data-lightbox>
      <div class="lightbox__backdrop" data-lightbox-close></div>
      <div class="lightbox__panel" role="dialog" aria-modal="true">
        <button class="lightbox__close" type="button" data-lightbox-close aria-label="Закрыть">×</button>
        <button class="lightbox__nav lightbox__prev" type="button" data-lightbox-prev aria-label="Предыдущее">
          ${renderIcon("back")}
        </button>
        <div class="lightbox__media">
          ${media}
        </div>
        <button class="lightbox__nav lightbox__next" type="button" data-lightbox-next aria-label="Следующее">
          ${renderIcon("back")}
        </button>
        <div class="lightbox__counter">${lightbox.index + 1} / ${lightbox.items.length}</div>
        ${caption}
      </div>
    </div>
  `;
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
  const backRoute = normalizeRoute(state.ui.lastRoute || "/home");
  const content = `
    <div class="modal">
      <div class="modal__card">
        <h2 class="section-title">${message.title}</h2>
        <div class="card__text">${message.message}</div>
        <button class="btn btn--primary" data-nav="#${backRoute}">Ок</button>
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

  const comment = query.get("comment");
  if (comment) {
    prefill.comment = comment;
  }

  return prefill;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = node.getAttribute("data-nav");
      if (target) {
        state.ui.lastRoute = normalizeRoute(window.location.hash || "#/home");
        window.location.hash = target.replace(/^#/, "");
      }
    });
  });
}

function bindShareButtons() {
  document.querySelectorAll("[data-share-master]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const masterId = button.getAttribute("data-share-master");
      const title = button.getAttribute("data-share-title") || "Мастер";
      const text = button.getAttribute("data-share-text") || title;
      const url = masterId
        ? `${window.location.origin}${window.location.pathname}#/master/${masterId}`
        : window.location.href;

      if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
        return;
      }

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          button.classList.add("is-copied");
          setTimeout(() => button.classList.remove("is-copied"), 1400);
        });
        return;
      }

      window.prompt("Скопируйте ссылку", url);
    });
  });
}

function bindMasterProfile(query) {
  if (!query) return;
  const focus = query.get("focus");
  if (focus === "practices") {
    const section = document.getElementById("master-practices");
    if (section) {
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
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

  const activeAlbum = getActiveGalleryAlbum();
  document.querySelectorAll("[data-gallery-open]").forEach((media) => {
    media.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(media.getAttribute("data-gallery-index"));
      if (!activeAlbum) return;
      openLightbox(activeAlbum.items, Number.isNaN(index) ? 0 : index);
    });
  });
}

function bindLightbox() {
  document.onkeydown = null;
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeLightbox();
    });
  });

  lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", (event) => {
    event.preventDefault();
    stepLightbox(-1);
  });

  lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", (event) => {
    event.preventDefault();
    stepLightbox(1);
  });

  let touchStartX = null;
  lightbox.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0]?.clientX ?? null;
    },
    { passive: true }
  );
  lightbox.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? null;
    if (touchEndX === null) return;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      stepLightbox(delta > 0 ? -1 : 1);
    }
    touchStartX = null;
  });

  document.onkeydown = (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }
    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  };
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
      state.ui.lastRoute = normalizeRoute(window.location.hash || "#/home");
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
