# Telegram Mini App + Bot + Admin (Bali Tours)

Проект для авторских туров по Бали/Нуса Пенида/Ява:
- Mini App (конструктор маршрута + расчет цены)
- Backend API (Flask + SQLite)
- Админка заявок + редактор локаций (`/admin`)
- Telegram бот с кнопкой открытия Mini App

## Бизнес-логика цены

- Базовая цена: `1 200 000 IDR`
- В базу включено: `5 мест`
- Каждая дополнительная точка после 5: `+100 000 IDR`
- Входные билеты суммируются и добавляются к итогу

Формула:
`Итого = 1 200 000 + (доп.точки * 100 000) + сумма билетов`

## Структура

- `index.html` - интерфейс Mini App
- `styles.css` - стили Mini App
- `app.js` - логика маршрутов, калькулятор, отправка заявки
- `server.py` - Flask сервер, API, SQLite, админка
- `admin.html` - интерфейс управления заявками
- `bot.py` - Telegram бот (WebApp кнопка + прием данных)
- `render.yaml` - автодеплой на Render (web + worker)
- `Dockerfile` - контейнер для Railway/Render Docker
- `requirements.txt` - Python зависимости
- `.env.example` - пример переменных окружения

## API

- `POST /api/leads` - создать заявку
- `GET /api/leads` - список заявок (нужен `X-Admin-Token`)
- `PATCH /api/leads/<id>` - сменить статус (`new/contacted/booked/archived`)
- `GET /api/spots` - список локаций для Mini App и админки
- `POST /api/spots/bootstrap` - первичная инициализация локаций дефолтным каталогом
- `PUT /api/spots` - сохранить локации из админки (нужен `X-Admin-Token`)
- `GET /api/health` - проверка сервиса

## Быстрый деплой на Render

В проект уже добавлен `render.yaml`, поэтому можно сделать Blueprint deploy.

1. Push проекта в GitHub.
2. В Render: `New +` -> `Blueprint` -> выбрать репозиторий.
3. Render поднимет 2 сервиса:
   - `bali-tours-web` (Flask)
   - `bali-tours-bot` (Telegram worker)
4. В сервисе `bali-tours-bot` заполните секреты:
   - `BOT_TOKEN`
   - `ADMIN_CHAT_ID`
5. В `@BotFather` запускайте бота и проверяйте `/start`.

### Точные значения URL для Render

Если используете имена из `render.yaml`, ставьте так:
- `WEB_APP_URL=https://bali-tours-web.onrender.com`
- `BACKEND_URL=https://bali-tours-web.onrender.com`

Админка:
- `https://bali-tours-web.onrender.com/admin`

## Деплой на Railway

Можно деплоить этот же репозиторий как 2 сервиса:
- `web` сервис: `APP_ROLE=web`
- `bot` сервис: `APP_ROLE=bot`

`Dockerfile` уже готов и запускает нужный процесс по `APP_ROLE`.

Минимальные переменные:
- Для `web`: `ADMIN_TOKEN`, `PORT` (Railway задает автоматически)
- Для `bot`: `BOT_TOKEN`, `ADMIN_CHAT_ID`, `WEB_APP_URL`, `BACKEND_URL`, `APP_ROLE=bot`

Для Railway `WEB_APP_URL` и `BACKEND_URL` должны быть равны публичному URL web-сервиса, например:
- `WEB_APP_URL=https://<your-web-service>.up.railway.app`
- `BACKEND_URL=https://<your-web-service>.up.railway.app`

## Локальный запуск

```bash
cd /Users/oleg/Downloads/Маршруты
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
export $(grep -v '^#' .env | xargs)
python3 server.py
```

В другом терминале:

```bash
cd /Users/oleg/Downloads/Маршруты
source .venv/bin/activate
export $(grep -v '^#' .env | xargs)
python3 bot.py
```

## Настройка в BotFather

1. Создайте бота через `@BotFather`.
2. Получите токен и вставьте в `BOT_TOKEN`.
3. Убедитесь, что `WEB_APP_URL` - HTTPS ссылка на ваш Mini App.
4. Запустите бота и отправьте `/start`.

## Важно про базу

Сейчас используется SQLite (`leads.db`).
- На локалке это удобно.
- На облаке без постоянного диска база может очищаться после рестартов.
- Для продакшена лучше подключить Postgres (следующий шаг).
