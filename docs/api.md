# Pseudo-API (Mini App + Bot)

Base URL: `/api`

## Content

- `GET /content/app`
- `GET /content/home`
- `GET /content/accommodation`
- `GET /content/practices`
- `GET /content/kitchen`
- `GET /content/gallery`
- `GET /content/calendar`
- `GET /content/shop`
- `GET /content/forms`

Optional aggregator:
- `GET /content/all`

## Requests (Forms)

All request payloads must include:
- `name` (required)
- at least one of `phone` or `telegram` (required)
- dates are required for all requests except `shop`

Optional headers from Telegram WebApp:
- `x-telegram-init-data` — initData string for verification
- `x-telegram-user-id` — user id (fallback when initData is absent)

### `POST /requests/accommodation`

```json
{
  "dateFrom": "2025-07-01",
  "dateTo": "2025-07-05",
  "guestsCount": 18,
  "requesterType": "organizer",
  "wishes": "Тихий корпус, 2-местные номера",
  "foodType": "full",
  "foodPreferences": ["vegetarian"],
  "foodAllergies": "без орехов",
  "foodAddons": ["coffee-break"],
  "foodAddonsComment": "1 кофе-брейк в день",
  "name": "Ирина",
  "phone": "+7 999 000-00-00",
  "telegram": "@irina",
  "comment": ""
}
```

### `POST /requests/practices`

```json
{
  "datesOrDays": "3 дня подряд во второй половине дня",
  "participantsCount": 22,
  "practiceIds": ["gong-meditation", "cacao-ceremony"],
  "wishes": "Предпочтительно на природе",
  "name": "Алексей",
  "phone": "+7 999 000-00-00",
  "telegram": "@alex",
  "comment": ""
}
```

### `POST /requests/turnkey`

```json
{
  "dateFrom": "2025-08-10",
  "dateTo": "2025-08-16",
  "guestsCount": 30,
  "interests": ["accommodation", "food", "practices"],
  "foodType": "twoMeals",
  "foodPreferences": ["meatOnRequest"],
  "foodAllergies": "без глютена",
  "foodAddons": ["cake"],
  "foodAddonsComment": "2 кг",
  "organizerComment": "Хотим 1 экскурсию",
  "name": "Мария",
  "phone": "+7 999 000-00-00",
  "telegram": "@maria",
  "comment": ""
}
```

### `POST /requests/shop`

```json
{
  "items": ["tshirt", "bag"],
  "comment": "Интересны размеры S/M",
  "name": "Олег",
  "phone": "+7 999 000-00-00",
  "telegram": "@oleg"
}
```

### Response (all requests)

```json
{
  "status": "ok",
  "requestId": "req_2025_08_10_001",
  "message": "Заявка принята"
}
```

## Rate limit

Minimum: 1 request per 30 seconds per Telegram user.
Suggested key: `telegram_user_id` from WebApp `initData`.

## Logging

Log all deliveries to admin chat:
- requestId
- type
- telegram_user_id
- status (success/error)
- error message (if any)

## Telegram

- Validate WebApp `initData` on backend.
- Bot must be added to admin chat and allowed to post.

## Calendar status logic

- 0 groups → 🟢
- 1 group → 🟡
- 2 groups → 🔴

Use `bookings` from `data/calendar.json` and count overlaps per date.
