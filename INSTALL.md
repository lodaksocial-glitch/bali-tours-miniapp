# Инструкция по установке улучшений

## Шаг 1: Установка зависимостей

```bash
pip install -r requirements.txt
```

Или вручную:
```bash
pip install Flask==3.0.3
pip install python-telegram-bot==21.10
pip install Flask-Limiter==3.5.0
pip install Flask-CORS==4.0.0
```

Для PostgreSQL (опционально):
```bash
pip install psycopg2-binary
```

## Шаг 2: Настройка окружения

1. Создайте .env файл:
```bash
cp .env.example .env
```

2. Сгенерируйте безопасный ADMIN_TOKEN:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

3. Отредактируйте .env и вставьте:
   - Сгенерированный ADMIN_TOKEN
   - BOT_TOKEN от @BotFather
   - ADMIN_CHAT_ID (ваш Telegram ID)
   - WEB_APP_URL и BACKEND_URL

Пример .env:
```bash
HOST=0.0.0.0
PORT=8080
DB_PATH=./leads.db
ADMIN_TOKEN=ваш_безопасный_токен_32_символа
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ADMIN_CHAT_ID=123456789
WEB_APP_URL=https://your-app.onrender.com
BACKEND_URL=https://your-app.onrender.com
ALLOWED_ORIGINS=https://your-app.onrender.com
```

## Шаг 3: Проверка безопасности

```bash
python3 check_security.py
```

Убедитесь, что нет критичных ошибок (❌).

## Шаг 4: Инициализация базы данных

База данных создастся автоматически при первом запуске:
```bash
python3 server.py
```

## Шаг 5: Создание первого бэкапа

```bash
python3 backup_db.py
```

## Шаг 6: Настройка автоматических бэкапов (опционально)

### Linux/macOS (cron)

Откройте crontab:
```bash
crontab -e
```

Добавьте строку (бэкап каждый день в 3:00):
```bash
0 3 * * * cd /path/to/your/app && /path/to/python3 backup_db.py >> /path/to/backup.log 2>&1
```

### Windows (Task Scheduler)

1. Откройте Task Scheduler
2. Create Basic Task
3. Trigger: Daily, 3:00 AM
4. Action: Start a program
5. Program: `python3`
6. Arguments: `backup_db.py`
7. Start in: путь к вашему приложению

## Шаг 7: Запуск приложения

### Локально

Терминал 1 (Flask сервер):
```bash
source .venv/bin/activate  # или venv\Scripts\activate на Windows
export $(grep -v '^#' .env | xargs)  # Linux/macOS
python3 server.py
```

Терминал 2 (Telegram бот):
```bash
source .venv/bin/activate
export $(grep -v '^#' .env | xargs)
python3 bot.py
```

### На Render

1. Push код в GitHub
2. В Render: New → Blueprint
3. Выберите репозиторий
4. Render создаст 2 сервиса автоматически
5. Добавьте environment variables в каждый сервис

### На Railway

1. Push код в GitHub
2. Создайте 2 сервиса:
   - Web: `APP_ROLE=web`
   - Bot: `APP_ROLE=bot`
3. Добавьте environment variables

## Шаг 8: Проверка работы

1. Health check:
```bash
curl https://your-app.onrender.com/api/health
```

Ожидаемый ответ:
```json
{
  "ok": true,
  "timestamp": "2026-02-26T10:00:00Z",
  "database": "connected",
  "telegram": "configured"
}
```

2. Проверьте логи на warnings:
```bash
# Локально
tail -f server.log

# На Render/Railway
Смотрите логи в веб-интерфейсе
```

3. Отправьте тестовую заявку через Mini App

## Миграция с PostgreSQL

Если хотите использовать PostgreSQL вместо SQLite:

1. Установите драйвер:
```bash
pip install psycopg2-binary
```

2. Получите DATABASE_URL от вашего провайдера:
   - Render: Add PostgreSQL database
   - Railway: Add PostgreSQL plugin
   - Heroku: Add Heroku Postgres

3. Добавьте в .env:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

4. Приложение автоматически переключится на PostgreSQL

5. Для миграции данных из SQLite:
```bash
# Экспорт из SQLite
sqlite3 leads.db .dump > backup.sql

# Импорт в PostgreSQL (требует адаптации SQL)
# Рекомендуется использовать специальные инструменты миграции
```

## Troubleshooting

### Ошибка: "Flask not installed"
```bash
pip install Flask==3.0.3
```

### Ошибка: "Database is locked"
- Убедитесь, что только один процесс использует БД
- Проверьте, что WAL режим включен
- Увеличьте timeout в коде

### Ошибка: "Invalid admin token"
- Проверьте, что ADMIN_TOKEN в .env совпадает с токеном в запросе
- Убедитесь, что .env загружен: `export $(grep -v '^#' .env | xargs)`

### Telegram бот не отвечает
- Проверьте BOT_TOKEN
- Проверьте, что WEB_APP_URL доступен по HTTPS
- Проверьте логи бота: `python3 bot.py`

### Rate limiting слишком строгий
Измените лимиты в `server.py`:
```python
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["500 per hour", "100 per minute"],  # Увеличенные лимиты
)
```

## Полезные команды

```bash
# Проверка безопасности
python3 check_security.py

# Создание бэкапа
python3 backup_db.py

# Просмотр логов (если настроено логирование в файл)
tail -f server.log

# Проверка зависимостей
pip list

# Обновление зависимостей
pip install --upgrade Flask python-telegram-bot Flask-Limiter Flask-CORS

# Проверка уязвимостей
pip install safety
safety check
```

## Дополнительная помощь

- Прочитайте [SECURITY.md](SECURITY.md) для деталей по безопасности
- Прочитайте [IMPROVEMENTS.md](IMPROVEMENTS.md) для списка улучшений
- Проверьте [README.md](README.md) для общей информации
