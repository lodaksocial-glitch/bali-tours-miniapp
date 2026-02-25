import asyncio
import json
import logging
import os
import urllib.error
import urllib.request
from typing import Any

from telegram import KeyboardButton, ReplyKeyboardMarkup, Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

logging.basicConfig(
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
    level=logging.INFO,
)

LOGGER = logging.getLogger("tour-bot")
BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
WEB_APP_URL = os.getenv("WEB_APP_URL", "").strip()
BACKEND_URL = os.getenv("BACKEND_URL", "").rstrip("/")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "").strip()

if not WEB_APP_URL and BACKEND_URL:
    WEB_APP_URL = BACKEND_URL
if not BACKEND_URL and WEB_APP_URL:
    BACKEND_URL = WEB_APP_URL.rstrip("/")


def post_json(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )

    with urllib.request.urlopen(req, timeout=12) as response:
        raw = response.read().decode("utf-8")

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"ok": False, "error": "Invalid JSON response from backend"}


def normalize_payload(raw_payload: dict[str, Any], user: Any) -> dict[str, Any]:
    customer_name = raw_payload.get("customer_name") or f"{user.first_name or ''} {user.last_name or ''}".strip() or "Клиент Telegram"

    customer = {
        "name": customer_name,
        "phone": str(raw_payload.get("customer_phone", "")).strip() or "не указан",
        "travel_date": str(raw_payload.get("travel_date", "")).strip(),
        "note": str(raw_payload.get("note", "")).strip(),
    }

    raw_places = raw_payload.get("places")
    if isinstance(raw_places, list):
        places = raw_places
    else:
        preview = raw_payload.get("route_preview") or []
        places = [{"name": name} for name in preview if isinstance(name, str)]

    route = raw_payload.get("route") or {
        "days": int(raw_payload.get("days") or 1),
        "driver_name": str(raw_payload.get("driver", "Авторский тур")),
        "places": places,
    }

    pricing = raw_payload.get("pricing") or {
        "total": raw_payload.get("total_price", 0),
        "base": 1_200_000,
        "surcharge": 0,
        "ticketTotal": 0,
    }

    return {
        "customer": customer,
        "route": route,
        "pricing": pricing,
        "source": "telegram-webapp",
        "telegram_user": {
            "id": user.id,
            "username": user.username or "",
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "language_code": user.language_code or "",
        },
    }


def render_summary(payload: dict[str, Any], lead_id: Any = None) -> str:
    customer = payload.get("customer", {})
    route = payload.get("route", {})
    pricing = payload.get("pricing", {})

    places = route.get("places") or []
    if isinstance(places, list):
        preview_names = [item.get("name", "") for item in places if isinstance(item, dict)]
    else:
        preview_names = []

    preview = ", ".join([name for name in preview_names[:6] if name])
    if len(preview_names) > 6:
        preview = f"{preview} +{len(preview_names) - 6}"

    total = pricing.get("total", 0)
    total_str = f"{int(total):,}".replace(",", " ") if isinstance(total, (int, float)) else str(total)

    lines = []
    lines.append("Новая заявка на тур")
    if lead_id:
        lines.append(f"ID: {lead_id}")
    lines.append(f"Клиент: {customer.get('name', '-')}")
    lines.append(f"Контакт: {customer.get('phone', '-')}")
    lines.append(f"Дата: {customer.get('travel_date', '-') or '-'}")
    lines.append(f"Дней: {route.get('days', '-')}")
    lines.append(f"Локаций: {len(places) if isinstance(places, list) else 0}")
    lines.append(f"Итого: {total_str} IDR")
    if preview:
        lines.append(f"Маршрут: {preview}")
    if customer.get("note"):
        lines.append(f"Комментарий: {customer['note']}")

    return "\n".join(lines)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return

    if not WEB_APP_URL:
        await update.message.reply_text("WEB_APP_URL не настроен. Добавьте его в .env")
        return

    keyboard = ReplyKeyboardMarkup(
        [[KeyboardButton(text="Открыть конструктор тура", web_app=WebAppInfo(url=WEB_APP_URL))]],
        resize_keyboard=True,
    )

    await update.message.reply_text(
        "Нажмите кнопку ниже, чтобы собрать маршрут и отправить заявку.",
        reply_markup=keyboard,
    )


async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    user = update.effective_user
    if not message or not user or not message.web_app_data:
        return

    try:
        raw_payload = json.loads(message.web_app_data.data)
    except json.JSONDecodeError:
        await message.reply_text("Не удалось прочитать данные маршрута.")
        return

    lead_id = raw_payload.get("lead_id")
    is_preview_only = (
        bool(raw_payload.get("route_preview"))
        and not raw_payload.get("customer_phone")
        and not raw_payload.get("route")
        and not raw_payload.get("places")
    )
    lead_payload = normalize_payload(raw_payload, user)

    if BACKEND_URL and not lead_id and not is_preview_only:
        try:
            response = await asyncio.to_thread(
                post_json,
                f"{BACKEND_URL}/api/leads",
                lead_payload,
            )
            if response.get("ok"):
                lead_id = response.get("lead_id")
            else:
                LOGGER.warning("Backend rejected lead: %s", response)
        except urllib.error.URLError as error:
            LOGGER.warning("Cannot reach backend: %s", error)

    summary = render_summary(lead_payload, lead_id)

    # Avoid duplicate notifications: when lead_id exists, backend already notified admin.
    if ADMIN_CHAT_ID and not lead_id and not is_preview_only:
        try:
            await context.bot.send_message(chat_id=int(ADMIN_CHAT_ID), text=summary)
        except Exception as error:  # noqa: BLE001
            LOGGER.warning("Failed to send admin notification: %s", error)

    if lead_id:
        await message.reply_text(f"Заявка принята. Номер: #{lead_id}")
    elif is_preview_only:
        await message.reply_text("Маршрут отправлен. Для заявки заполните форму клиента в Mini App.")
    else:
        await message.reply_text("Маршрут получен. Я свяжусь с вами для подтверждения.")


async def fallback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    await update.message.reply_text("Напишите /start, чтобы открыть мини-приложение.")


def main() -> None:
    if not BOT_TOKEN:
        raise RuntimeError("BOT_TOKEN is required")

    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, fallback))

    application.run_polling(close_loop=False)


if __name__ == "__main__":
    main()
