# Руководство по безопасности

## Критичные настройки безопасности

### 1. ADMIN_TOKEN

**КРИТИЧНО:** Никогда не используйте дефолтный токен `change-me` в продакшене!

Генерация безопасного токена:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Минимальные требования:
- Длина: 32+ символов
- Случайная генерация
- Уникальный для каждого окружения

### 2. CORS настройки

По умолчанию разрешены все origins (`*`). Для продакшена ограничьте:

```bash
ALLOWED_ORIGINS=https://your-app.onrender.com,https://your-domain.com
```

### 3. Rate Limiting

Встроенная защита от злоупотреблений:
- 200 запросов в час на IP
- 50 запросов в минуту на IP
- 10 запросов в минуту на создание заявок

Настройка в `server.py`:
```python
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per hour", "50 per minute"],
)
```

### 4. База данных

#### SQLite (по умолчанию)
- Включен WAL режим для лучшей конкурентности
- Включены foreign keys
- Timeout 10 секунд для предотвращения блокировок

#### PostgreSQL (рекомендуется для продакшена)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
pip install psycopg2-binary
```

### 5. Валидация входных данных

Все входные данные проходят валидацию:
- Санитизация строк (удаление null-байтов, контрольных символов)
- Проверка на SQL injection паттерны
- Ограничение длины полей
- Валидация форматов (телефон, дата, URL)

### 6. Логирование

Все критичные операции логируются:
- Создание заявок
- Попытки доступа к админ-эндпоинтам
- Ошибки базы данных
- Ошибки Telegram API

Логи включают:
- Timestamp
- Уровень (INFO, WARNING, ERROR)
- IP адрес (для админ-запросов)
- Детали операции

## Рекомендации по деплою

### Render / Railway

1. Используйте Environment Variables для всех секретов
2. Включите HTTPS (автоматически на Render/Railway)
3. Настройте Persistent Disk для базы данных
4. Регулярно делайте бэкапы

### Бэкапы базы данных

Автоматический бэкап:
```bash
python3 backup_db.py
```

Настройка cron (ежедневно в 3:00):
```bash
0 3 * * * cd /path/to/app && python3 backup_db.py
```

Environment variables для бэкапа:
```bash
DB_PATH=./leads.db
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
```

## Мониторинг безопасности

### Health Check

Эндпоинт `/api/health` проверяет:
- Доступность базы данных
- Конфигурацию Telegram бота
- Общий статус приложения

### Логи для мониторинга

Важные события для отслеживания:
```
WARNING | Admin endpoint accessed without token
WARNING | Invalid admin token attempt
ERROR | Database connection error
ERROR | Failed to initialize database
```

## Известные ограничения

1. **SQLite на Render Free Tier**
   - База хранится в `/tmp` (ephemeral storage)
   - Данные теряются при рестарте
   - Решение: используйте Persistent Disk или PostgreSQL

2. **Rate Limiting в памяти**
   - Лимиты сбрасываются при рестарте
   - Для распределенных систем используйте Redis

3. **Telegram уведомления**
   - Нет retry механизма
   - Ошибки только логируются
   - Рекомендуется мониторинг логов

## Чеклист перед продакшеном

- [ ] Сгенерирован и установлен безопасный ADMIN_TOKEN
- [ ] Настроены ALLOWED_ORIGINS
- [ ] Включен HTTPS
- [ ] Настроен Persistent Disk или PostgreSQL
- [ ] Настроены автоматические бэкапы
- [ ] Проверены логи на warnings
- [ ] Протестирован health check
- [ ] Настроен мониторинг (Sentry, LogDNA и т.д.)
- [ ] Документированы все environment variables
- [ ] Проверена работа rate limiting

## Отчет об уязвимостях

Если вы обнаружили уязвимость безопасности, пожалуйста:
1. НЕ создавайте публичный issue
2. Свяжитесь с администратором напрямую
3. Предоставьте детальное описание и шаги воспроизведения

## Обновления безопасности

Регулярно обновляйте зависимости:
```bash
pip install --upgrade Flask python-telegram-bot Flask-Limiter Flask-CORS
```

Проверка уязвимостей:
```bash
pip install safety
safety check
```
