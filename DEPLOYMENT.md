# 🚀 Руководство по деплою

## Сравнение платформ

| Платформа | Бесплатный план | БД | Стабильность | Сложность | Рекомендация |
|-----------|----------------|-----|--------------|-----------|--------------|
| **Render** | ✅ 750 часов/мес | Ephemeral (теряется) | ⭐⭐⭐⭐ | Легко | ✅ Для старта |
| **Railway** | $5 кредит/мес | Persistent | ⭐⭐⭐⭐⭐ | Легко | ✅ Лучший выбор |
| **Fly.io** | 3 VM бесплатно | Persistent | ⭐⭐⭐⭐⭐ | Средне | ✅ Для продакшена |
| **DigitalOcean** | От $4/мес | Persistent | ⭐⭐⭐⭐⭐ | Сложно | Для масштаба |
| **Heroku** | Нет бесплатного | PostgreSQL | ⭐⭐⭐⭐ | Легко | Платный |

### 🏆 Рекомендация: Railway

**Почему Railway лучше для вашего проекта:**
- ✅ Persistent storage (данные не теряются)
- ✅ Простой деплой из GitHub
- ✅ Автоматический HTTPS
- ✅ Встроенный PostgreSQL
- ✅ Хорошая производительность
- ✅ $5 бесплатных кредитов (хватит на месяц тестирования)

---

## 1️⃣ Деплой на Render (текущий вариант)

### Проблемы Render Free Tier:
- ⚠️ База данных в `/tmp` - **теряется при каждом рестарте**
- ⚠️ Сервис засыпает после 15 минут неактивности
- ⚠️ Холодный старт ~30 секунд

### Решение проблем:

#### Вариант А: Render + Persistent Disk ($1/мес)
Добавьте в `render.yaml`:
```yaml
services:
  - type: web
    name: bali-tours-web
    env: python
    plan: starter  # $7/мес, включает persistent disk
    disk:
      name: bali-tours-data
      mountPath: /var/data
      sizeGB: 1
    envVars:
      - key: DB_PATH
        value: /var/data/leads.db
```

#### Вариант Б: Render + External PostgreSQL (бесплатно)
Используйте бесплатный PostgreSQL от [Supabase](https://supabase.com) или [Neon](https://neon.tech):

```yaml
envVars:
  - key: DATABASE_URL
    value: postgresql://user:pass@host:5432/db
```

### Пошаговая инструкция Render:

1. **Подготовка репозитория**
```bash
cd /Users/oleg/Downloads/Маршруты
git init
git add .
git commit -m "Initial commit with security improvements"
```

2. **Создайте GitHub репозиторий**
- Перейдите на https://github.com/new
- Создайте новый репозиторий (например, `bali-tours`)
- Не добавляйте README, .gitignore, license

3. **Push в GitHub**
```bash
git remote add origin https://github.com/ваш-username/bali-tours.git
git branch -M main
git push -u origin main
```

4. **Деплой на Render**
- Откройте https://dashboard.render.com
- Нажмите **New +** → **Blueprint**
- Подключите GitHub репозиторий
- Render автоматически найдет `render.yaml`
- Нажмите **Apply**

5. **Настройка переменных окружения**

После создания сервисов, добавьте в **bali-tours-web**:
- `ADMIN_TOKEN`: Сгенерируйте безопасный токен
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
- `BOT_TOKEN`: Токен от @BotFather
- `ADMIN_CHAT_ID`: Ваш Telegram ID

В **bali-tours-bot** добавьте те же переменные.

6. **Проверка работы**
```bash
curl https://bali-tours-web.onrender.com/api/health
```

### ⚠️ Важно для Render Free:
- База данных будет очищаться при каждом рестарте
- Настройте автоматические бэкапы (см. ниже)
- Рассмотрите переход на Starter план ($7/мес) для persistent disk

---

## 2️⃣ Деплой на Railway (РЕКОМЕНДУЕТСЯ) 🏆

### Преимущества:
- ✅ Persistent storage из коробки
- ✅ Встроенный PostgreSQL
- ✅ Автоматический HTTPS
- ✅ Простой деплой

### Пошаговая инструкция:

1. **Подготовка (если еще не сделано)**
```bash
cd /Users/oleg/Downloads/Маршруты
git init
git add .
git commit -m "Initial commit"
# Push в GitHub (см. инструкцию выше)
```

2. **Создание проекта на Railway**
- Откройте https://railway.app
- Войдите через GitHub
- Нажмите **New Project**
- Выберите **Deploy from GitHub repo**
- Выберите ваш репозиторий

3. **Создание двух сервисов**

Railway создаст один сервис. Нужно создать второй:

**Сервис 1: Web (Flask)**
- Нажмите **New** → **GitHub Repo** → выберите тот же репозиторий
- Settings → Environment:
  ```
  APP_ROLE=web
  ADMIN_TOKEN=ваш_безопасный_токен
  BOT_TOKEN=ваш_токен_от_botfather
  ADMIN_CHAT_ID=ваш_telegram_id
  DB_PATH=/app/data/leads.db
  ALLOWED_ORIGINS=https://ваш-домен.up.railway.app
  ```
- Settings → Networking → Generate Domain

**Сервис 2: Bot (Worker)**
- Нажмите **New** → **GitHub Repo** → выберите тот же репозиторий
- Settings → Environment:
  ```
  APP_ROLE=bot
  BOT_TOKEN=ваш_токен_от_botfather
  ADMIN_CHAT_ID=ваш_telegram_id
  WEB_APP_URL=https://ваш-web-домен.up.railway.app
  BACKEND_URL=https://ваш-web-домен.up.railway.app
  ```

4. **Добавление PostgreSQL (опционально, но рекомендуется)**
- В проекте нажмите **New** → **Database** → **PostgreSQL**
- Railway автоматически создаст `DATABASE_URL`
- Добавьте в Web сервис:
  ```
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  ```

5. **Добавление Persistent Volume**
- В Web сервисе: Settings → Volumes
- Нажмите **New Volume**
- Mount Path: `/app/data`
- Size: 1 GB

6. **Проверка работы**
```bash
curl https://ваш-домен.up.railway.app/api/health
```

### 💰 Стоимость Railway:
- $5 бесплатных кредитов при регистрации
- ~$5-10/мес для вашего проекта
- Первый месяц бесплатно

---

## 3️⃣ Деплой на Fly.io (для продакшена)

### Преимущества:
- ✅ 3 VM бесплатно (256MB RAM каждая)
- ✅ Persistent volumes
- ✅ Глобальная CDN
- ✅ Отличная производительность

### Пошаговая инструкция:

1. **Установка Fly CLI**
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. **Авторизация**
```bash
flyctl auth login
```

3. **Создание приложений**
```bash
cd /Users/oleg/Downloads/Маршруты

# Web сервис
flyctl launch --name bali-tours-web --no-deploy
# Выберите регион (например, Frankfurt для Европы)

# Bot сервис
flyctl launch --name bali-tours-bot --no-deploy
```

4. **Настройка fly.toml для Web**

Создайте `fly.web.toml`:
```toml
app = "bali-tours-web"
primary_region = "fra"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  APP_ROLE = "web"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[mounts]
  source = "bali_data"
  destination = "/data"
```

5. **Создание volume**
```bash
flyctl volumes create bali_data --size 1 --app bali-tours-web
```

6. **Настройка секретов**
```bash
flyctl secrets set ADMIN_TOKEN="ваш_токен" --app bali-tours-web
flyctl secrets set BOT_TOKEN="ваш_токен" --app bali-tours-web
flyctl secrets set ADMIN_CHAT_ID="ваш_id" --app bali-tours-web
flyctl secrets set DB_PATH="/data/leads.db" --app bali-tours-web
```

7. **Деплой**
```bash
flyctl deploy --config fly.web.toml --app bali-tours-web
flyctl deploy --config fly.bot.toml --app bali-tours-bot
```

---

## 4️⃣ Деплой на DigitalOcean App Platform

### Преимущества:
- ✅ Managed PostgreSQL
- ✅ Автоматический HTTPS
- ✅ Простое масштабирование

### Стоимость:
- От $5/мес за приложение
- PostgreSQL от $15/мес

### Инструкция:
1. Откройте https://cloud.digitalocean.com/apps
2. Create App → GitHub
3. Выберите репозиторий
4. Настройте 2 компонента (Web + Worker)
5. Добавьте PostgreSQL database
6. Настройте environment variables

---

## 🔄 Автоматические бэкапы

### Для Render (обязательно!)

Создайте GitHub Action `.github/workflows/backup.yml`:
```yaml
name: Database Backup

on:
  schedule:
    - cron: '0 3 * * *'  # Каждый день в 3:00 UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download database
        run: |
          curl -H "X-Admin-Token: ${{ secrets.ADMIN_TOKEN }}" \
               https://bali-tours-web.onrender.com/api/leads?limit=500 \
               > backup_$(date +%Y%m%d).json
      
      - name: Upload to GitHub
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup_*.json
          retention-days: 30
```

### Для Railway/Fly.io

Используйте встроенный `backup_db.py`:
```bash
# Локально через SSH или cron
python3 backup_db.py
```

---

## 📊 Сравнение стоимости

### Бесплатные варианты:
1. **Render Free** - Бесплатно, но база теряется
2. **Railway** - $5 кредит (хватит на месяц)
3. **Fly.io** - 3 VM бесплатно (достаточно для старта)

### Платные варианты (стабильная работа):
1. **Railway** - ~$5-10/мес (рекомендуется)
2. **Render Starter** - $7/мес + $1 за disk
3. **Fly.io** - ~$5-10/мес
4. **DigitalOcean** - От $20/мес (с PostgreSQL)

---

## 🎯 Моя рекомендация

### Для тестирования (1-2 месяца):
**Railway** - простой деплой, persistent storage, $5 бесплатно

### Для продакшена:
**Railway** или **Fly.io** - стабильность, производительность, разумная цена

### Если нужно бесплатно:
**Render Free + External PostgreSQL** (Supabase/Neon)

---

## 🚀 Быстрый старт на Railway

```bash
# 1. Push в GitHub
git init && git add . && git commit -m "Initial"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 2. Откройте Railway
# https://railway.app → New Project → Deploy from GitHub

# 3. Создайте 2 сервиса (Web + Bot)
# Настройте environment variables

# 4. Готово!
```

---

## 📞 Нужна помощь?

- Railway: https://railway.app/help
- Render: https://render.com/docs
- Fly.io: https://fly.io/docs

Хотите, чтобы я помог с конкретной платформой? Просто скажите!
