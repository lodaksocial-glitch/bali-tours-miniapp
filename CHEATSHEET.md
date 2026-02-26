# 📝 Шпаргалка - Бесплатный деплой

## 🚀 Быстрый старт (30 минут)

### 1. Supabase (5 мин)
```
1. https://supabase.com → Sign up
2. New project → Name: bali-tours
3. Database Password: [придумайте и сохраните]
4. Region: Europe West
5. Create project
6. Settings → Database → Connection string (URI)
7. Скопируйте и замените [YOUR-PASSWORD]
```

### 2. GitHub (5 мин)
```bash
cd /Users/oleg/Downloads/Маршруты
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/bali-tours.git
git push -u origin main
```

### 3. Render (10 мин)
```
1. https://dashboard.render.com → Sign up
2. New + → Blueprint
3. Connect GitHub → Select bali-tours
4. Apply

В bali-tours-web → Environment:
  DATABASE_URL = postgresql://postgres:...  (из Supabase)
  ADMIN_TOKEN = [сгенерируйте: python3 -c "import secrets; print(secrets.token_urlsafe(32))"]
  BOT_TOKEN = [от @BotFather]
  ADMIN_CHAT_ID = [от @userinfobot]

В bali-tours-bot → Environment:
  BOT_TOKEN = [тот же]
  ADMIN_CHAT_ID = [тот же]
  WEB_APP_URL = https://bali-tours-web.onrender.com
  BACKEND_URL = https://bali-tours-web.onrender.com
```

### 4. Telegram (5 мин)
```
@BotFather:
  /mybots → [ваш бот]
  Bot Settings → Menu Button → Configure Menu Button
  URL: https://bali-tours-web.onrender.com
  Text: Создать маршрут
```

### 5. Проверка (5 мин)
```
✅ https://bali-tours-web.onrender.com/api/health
✅ https://bali-tours-web.onrender.com/admin
✅ Telegram бот → /start → Создать маршрут
✅ Создать тестовую заявку
```

---

## 🔑 Важные ссылки

### Dashboards:
- Render: https://dashboard.render.com
- Supabase: https://supabase.com/dashboard
- GitHub: https://github.com/USERNAME/bali-tours

### Ваше приложение:
- Web: https://bali-tours-web.onrender.com
- Admin: https://bali-tours-web.onrender.com/admin
- Health: https://bali-tours-web.onrender.com/api/health

### Telegram:
- @BotFather - управление ботом
- @userinfobot - получить ваш ID

---

## 🔧 Полезные команды

### Генерация ADMIN_TOKEN:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Обновление кода:
```bash
git add .
git commit -m "Update"
git push
# Render автоматически задеплоит
```

### Локальный запуск бота (если Render лимит):
```bash
export BOT_TOKEN="ваш_токен"
export ADMIN_CHAT_ID="ваш_id"
export WEB_APP_URL="https://bali-tours-web.onrender.com"
export BACKEND_URL="https://bali-tours-web.onrender.com"
python3 bot.py
```

### Проверка здоровья:
```bash
curl https://bali-tours-web.onrender.com/api/health
```

### Скачать бэкап заявок:
```bash
curl -H "X-Admin-Token: ваш_токен" \
     https://bali-tours-web.onrender.com/api/leads?limit=500 \
     > backup.json
```

---

## ⚠️ Частые проблемы

### "Service Unavailable"
→ Сервис заснул, подождите 30 секунд

### "Database connection error"
→ Проверьте DATABASE_URL в Render
→ Проверьте пароль в строке подключения

### "Invalid admin token"
→ Проверьте ADMIN_TOKEN в обоих сервисах
→ Убедитесь, что нет пробелов

### Бот не отвечает
→ Проверьте логи bali-tours-bot
→ Проверьте BOT_TOKEN
→ Перезапустите bot сервис

### "Out of hours"
→ Использовали 750 часов Render
→ Остановите bot сервис
→ Запускайте бота локально

---

## 💰 Лимиты бесплатного плана

### Render Free:
- 750 часов/месяц
- Засыпает через 15 минут
- Холодный старт ~30 сек

### Supabase Free:
- 500MB базы данных
- Засыпает через 1 неделю неактивности
- Автоматически просыпается

### Оптимизация:
- Используйте только Web на Render (24/7)
- Bot запускайте локально
- Или оба на Render (~15 дней/месяц каждый)

---

## 📚 Документация

- **FREE_DEPLOY.md** - Полная инструкция (читайте это!)
- **RECOMMENDATION.md** - Сравнение платформ
- **SECURITY.md** - Безопасность
- **TROUBLESHOOTING.md** - Решение проблем

---

## 🆘 Нужна помощь?

1. Проверьте логи в Render
2. Проверьте Supabase Dashboard
3. Перечитайте FREE_DEPLOY.md
4. Спросите меня!

---

## ✅ Чеклист деплоя

- [ ] Supabase проект создан
- [ ] DATABASE_URL скопирован
- [ ] Код в GitHub
- [ ] Render Blueprint применен
- [ ] Environment variables настроены
- [ ] Telegram Mini App настроен
- [ ] Health check работает
- [ ] Админка открывается
- [ ] Тестовая заявка создана
- [ ] Уведомление в Telegram пришло

**Все галочки? Поздравляю! 🎉**
