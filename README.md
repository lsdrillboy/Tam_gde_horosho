# Ретритный центр «Там, где Хорошо» — контент и псевдо-API

Этот репозиторий содержит стартовую структуру данных и спецификацию псевдо-API для Telegram Mini App + бота уведомлений.

## Структура

- `data/app.json` — имя, подпись, интро, CTA.
- `data/home.json` — кнопки Home + CTA-заявки.
- `data/accommodation.json` — размещение (ёмкости, price_mode).
- `data/practices.json` — практики/услуги + фильтры + флагман.
- `data/kitchen.json` — тарифы питания + автоподбор.
- `data/gallery.json` — альбомы галереи.
- `data/calendar.json` — модель бронирований и статусов.
- `data/shop.json` — концепция мерча (MVP).
- `data/forms.json` — формы заявок и правила валидации.
- `docs/api.md` — псевдо-API и требования по rate limit/логам.
- `docs/messages.md` — шаблоны сообщений в админ-чат.

## Минимальный запуск UI

UI находится в корне: `index.html`, `styles.css`, `app.js`.

Простой локальный сервер:

```bash
python3 -m http.server 8000
```

Открыть: `http://localhost:8000`

## Бэкенд + бот (локально)

Требуется Node.js 18+.

1) Установить зависимости:

```bash
npm install
```

2) Создать `.env` (можно скопировать из `.env.example`) и заполнить:

- `BOT_TOKEN` — токен Telegram-бота
- `ADMIN_CHAT_ID` — числовой ID админ-чата (бот должен быть добавлен в чат)
- `DRY_RUN=true` — если хотите тестировать без отправки сообщений

3) Запустить сервер:

```bash
npm start
```

Сервер поднимется на `http://localhost:3000` и обслужит UI + `/api` endpoints.

## Mini App в Telegram-боте (локально, polling)

Чтобы кнопка открывала Mini App прямо в Telegram, нужен публичный HTTPS URL.

1) Поднимите доступный HTTPS URL (например, через ngrok или Cloudflare Tunnel).
2) В `.env` укажите `WEB_APP_URL=https://<ваш-домен>`.
3) Включите polling: `BOT_POLLING=true`.
4) Перезапустите сервер.

После этого бот будет отвечать на `/start` кнопкой “Открыть Mini App”.
Опционально `BOT_SET_MENU_BUTTON=true` добавит кнопку в меню чата.

Важно: в BotFather для бота должен быть задан домен web app (`/setdomain`).

## Два проекта на Vercel (frontend + backend)

### Frontend (Mini App UI)

Корень проекта: `/`  
Проект — статический (index.html + data/*.json). Для Vercel добавлен `vercel.json`.

1) Задеплой заново (redeploy).
2) Убедитесь, что `https://<your-frontend-domain>` открывает главную страницу (без 404).
3) В BotFather задайте домен WebApp: `/setdomain` → `<your-frontend-domain>`.

Если формы будут отправлять данные, настройте `data/app.json` → `apiBaseUrl` на адрес бэкенда.

### Backend (бот + заявки)

Корень проекта: `/backend`  
В этом каталоге лежат serverless функции для Vercel.

Нужные переменные окружения в Vercel:
- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `WEB_APP_URL=https://<your-frontend-domain>`
- `ALLOWED_ORIGIN=https://<your-frontend-domain>`
- `INIT_DATA_REQUIRED=false` (включить позже)
- `INIT_DATA_MAX_AGE_SEC=86400`
- `RATE_LIMIT_WINDOW_MS=30000`
- `WEBHOOK_SECRET=<any-string>` (рекомендуется)
- `ADMIN_TOKEN=<any-string>` (для установки webhook)
- `BOT_MENU_BUTTON_TEXT=Открыть Mini App` (опционально)

После деплоя backend:
1) Вызовите `https://<your-backend-domain>/api/telegram/set-webhook?token=<ADMIN_TOKEN>`  
   Это зарегистрирует webhook и настроит кнопку WebApp.
2) В боте выполните `/start`.

### Обновление Mini App URL

Если меняете домен фронта, обновите:
- `WEB_APP_URL` в backend
- `apiBaseUrl` в `data/app.json`

## Деплой фронта на Vercel (один проект)

Если хотите одним проектом (frontend + локальный backend), оставьте как было.  
Для боевого сценария лучше разделять frontend и backend на два Vercel проекта.

## Важно

Подпись во всех сообщениях и заявках должна быть строго:
`Ретритный центр „Там, где Хорошо“`
