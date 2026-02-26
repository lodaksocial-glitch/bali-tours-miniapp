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

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        LOGGER.error("HTTP error posting to backend: %s - %s", error.code, error.reason)
        return {"ok": False, "error": f"Backend HTTP error: {error.code}"}
    except urllib.error.URLError as error:
        LOGGER.error("Connection error posting to backend: %s", error.reason)
        return {"ok": False, "error": "Cannot connect to backend"}
    except Exception as error:
        LOGGER.error("Unexpected error posting to backend: %s", error)
        return {"ok": False, "error": "Unexpected error"}

    try:
        return json.loads(raw)
    except json.JSONDecodeError as error:
        LOGGER.error("Invalid JSON response from backend: %s", error)
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


def render_customer_followup(payload: dict[str, Any], lead_id: Any, language_code: str) -> str:
    customer = payload.get("customer", {})
    route = payload.get("route", {})
    pricing = payload.get("pricing", {})

    is_en = str(language_code or "").lower().startswith("en")
    travel_date = customer.get("travel_date") or "-"
    days = route.get("days", "-")
    total = pricing.get("total", 0)
    total_str = f"{int(total):,}".replace(",", " ") if isinstance(total, (int, float)) else str(total)

    if is_en:
        return (
            f"Your request is confirmed. Booking ID: #{lead_id}\n"
            f"Travel date: {travel_date}\n"
            f"Trip length: {days} day(s)\n"
            f"Estimated total: {total_str} IDR (per car)\n\n"
            "Recommended departure: 06:00 to avoid traffic and crowds.\n"
            "What to bring: swimwear, towel, spare clothes, comfy shoes, sunscreen, cash, charged phone/camera.\n\n"
            "I will contact you soon to finalize details."
        )

    return (
        f"Ваша заявка подтверждена. Номер: #{lead_id}\n"
        f"Дата поездки: {travel_date}\n"
        f"Длительность: {days} дн.\n"
        f"Ориентировочная стоимость: {total_str} IDR (за машину)\n\n"
        "Рекомендуемый выезд: 06:00, чтобы избежать трафика и толп.\n"
        "Что взять с собой: купальник, полотенце, сменную одежду, удобную обувь, крем от солнца, наличные, заряженный телефон/камеру.\n\n"
        "Скоро свяжусь с вами для подтверждения деталей."
    )


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
    except json.JSONDecodeError as error:
        LOGGER.error("Failed to parse web app data: %s", error)
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
                LOGGER.info("Lead created via bot: ID=%s, user=%s", lead_id, user.id)
            else:
                error_msg = response.get("error", "Unknown error")
                LOGGER.warning("Backend rejected lead: %s", error_msg)
        except Exception as error:
            LOGGER.error("Unexpected error creating lead: %s", error)

    summary = render_summary(lead_payload, lead_id)

    # Avoid duplicate notifications: when lead_id exists, backend already notified admin.
    if ADMIN_CHAT_ID and not lead_id and not is_preview_only:
        try:
            await context.bot.send_message(chat_id=int(ADMIN_CHAT_ID), text=summary)
            LOGGER.info("Admin notification sent for preview-only submission")
        except ValueError as error:
            LOGGER.error("Invalid ADMIN_CHAT_ID format: %s", error)
        except Exception as error:
            LOGGER.error("Failed to send admin notification: %s", error)

    if lead_id:
        await message.reply_text(
            render_customer_followup(
                lead_payload,
                lead_id,
                getattr(user, "language_code", "") or "",
            )
        )
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
        LOGGER.error("BOT_TOKEN is required but not set")
        raise RuntimeError("BOT_TOKEN is required")

    if not WEB_APP_URL:
        LOGGER.warning("WEB_APP_URL is not set - bot will not function properly")

    LOGGER.info("Starting Telegram bot...")
    LOGGER.info("Web App URL: %s", WEB_APP_URL or "NOT SET")
    LOGGER.info("Backend URL: %s", BACKEND_URL or "NOT SET")

    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, fallback))

    LOGGER.info("Bot is running and polling for updates...")
    application.run_polling(close_loop=False)


if __name__ == "__main__":
    main()
