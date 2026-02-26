import json
import logging
import os
import sqlite3
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, abort, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("DB_PATH", str(BASE_DIR / "leads.db"))).expanduser()
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "change-me")
ALLOWED_STATUSES = {"new", "contacted", "booked", "archived"}
CATALOG_CONFIG_KEY = "catalog_spots"
AVAILABILITY_CONFIG_KEY = "blocked_dates"
TELEGRAM_BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
TELEGRAM_ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "").strip()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
LOGGER = logging.getLogger("tour-server")

# Validate ADMIN_TOKEN on startup
if ADMIN_TOKEN == "change-me" or len(ADMIN_TOKEN) < 32:
    LOGGER.warning(
        "⚠️  SECURITY WARNING: ADMIN_TOKEN is weak or default! "
        "Generate a strong token with: python3 -c \"import secrets; print(secrets.token_urlsafe(32))\""
    )

app = Flask(__name__)

# Configure CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)

# Configure rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per hour", "50 per minute"],
    storage_uri="memory://",
)


def get_connection() -> sqlite3.Connection:
    try:
        conn = sqlite3.connect(DB_PATH, timeout=10.0)
        conn.row_factory = sqlite3.Row
        # Enable foreign keys and WAL mode for better concurrency
        conn.execute("PRAGMA foreign_keys = ON")
        conn.execute("PRAGMA journal_mode = WAL")
        return conn
    except sqlite3.Error as error:
        LOGGER.error("Database connection error: %s", error)
        raise


def init_db() -> None:
    global DB_PATH
    try:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        fallback = Path("/tmp/leads.db")
        fallback.parent.mkdir(parents=True, exist_ok=True)
        LOGGER.warning(
            "DB_PATH %s is not writable, fallback to %s (ephemeral storage).",
            DB_PATH,
            fallback,
        )
        DB_PATH = fallback

    try:
        with get_connection() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS leads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TEXT NOT NULL,
                    customer_name TEXT NOT NULL,
                    customer_phone TEXT NOT NULL,
                    travel_date TEXT,
                    customer_note TEXT,
                    source TEXT,
                    route_days INTEGER NOT NULL,
                    route_driver_name TEXT,
                    places_count INTEGER NOT NULL,
                    places_json TEXT NOT NULL,
                    pricing_json TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'new',
                    tg_user_id TEXT,
                    tg_username TEXT,
                    tg_first_name TEXT,
                    tg_last_name TEXT
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)"
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_leads_travel_date ON leads(travel_date)"
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS app_config (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            LOGGER.info("Database initialized successfully at %s", DB_PATH)
    except sqlite3.Error as error:
        LOGGER.error("Failed to initialize database: %s", error)
        raise


def json_dumps(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False)


def json_loads(raw: str) -> Any:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def get_config_value(key: str) -> tuple[Any, str | None]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT value, updated_at FROM app_config WHERE key = ?",
            (key,),
        ).fetchone()

    if not row:
        return None, None
    return json_loads(row["value"]), row["updated_at"]


def set_config_value(key: str, value: Any) -> str:
    updated_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO app_config (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = excluded.updated_at
            """,
            (key, json_dumps(value), updated_at),
        )
    return updated_at


def parse_date_ymd(raw: str) -> str | None:
    value = str(raw or "").strip()
    if not value:
        return None
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return None
    return parsed.strftime("%Y-%m-%d")


def get_blocked_dates() -> list[str]:
    value, _ = get_config_value(AVAILABILITY_CONFIG_KEY)
    if not isinstance(value, list):
        return []

    result: list[str] = []
    for item in value:
        parsed = parse_date_ymd(str(item))
        if parsed:
            result.append(parsed)
    return sorted(set(result))


def add_blocked_date(date_value: str | None) -> None:
    parsed = parse_date_ymd(str(date_value or ""))
    if not parsed:
        return

    current = set(get_blocked_dates())
    if parsed in current:
        return

    current.add(parsed)
    set_config_value(AVAILABILITY_CONFIG_KEY, sorted(current))


def normalize_blocked_dates_payload(items: Any) -> tuple[list[str], str | None]:
    if not isinstance(items, list):
        return [], "blocked_dates must be an array"
    if len(items) > 730:
        return [], "blocked_dates is too large"

    normalized: list[str] = []
    for idx, item in enumerate(items, start=1):
        parsed = parse_date_ymd(str(item))
        if not parsed:
            return [], f"blocked_dates item #{idx} must be YYYY-MM-DD"
        normalized.append(parsed)

    return sorted(set(normalized)), None


def normalize_spots_payload(items: Any) -> tuple[list[dict[str, Any]], str | None]:
    if not isinstance(items, list):
        return [], "items must be an array"
    if len(items) > 2000:
        return [], "items is too large"

    normalized: list[dict[str, Any]] = []
    for idx, raw in enumerate(items, start=1):
        if not isinstance(raw, dict):
            return [], f"item #{idx} must be an object"

        name = str(raw.get("name", "")).strip()
        if not name:
            return [], f"item #{idx}: name is required"

        region = str(raw.get("region", "")).strip().lower() or "bali"
        category = str(raw.get("category", "")).strip().lower() or "viewpoints"
        description = str(raw.get("description", "")).strip()
        image = str(raw.get("image", "")).strip()
        tip = str(raw.get("tip", "")).strip()

        try:
            duration = float(raw.get("duration", 1))
        except (TypeError, ValueError):
            return [], f"item #{idx}: duration must be a number"

        try:
            ticket = int(raw.get("ticket", 0))
        except (TypeError, ValueError):
            return [], f"item #{idx}: ticket must be an integer"

        duration = max(0.1, min(duration, 24.0))
        ticket = max(0, min(ticket, 10_000_000))

        normalized.append(
            {
                "name": name,
                "region": region,
                "category": category,
                "duration": duration,
                "ticket": ticket,
                "description": description,
                "image": image,
                "tip": tip,
            }
        )

    return normalized, None


def build_analytics() -> dict[str, Any]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, created_at, status, route_driver_name, places_json, pricing_json
            FROM leads
            ORDER BY id DESC
            """
        ).fetchall()

    total_leads = len(rows)
    total_revenue = 0.0
    status_counts: dict[str, int] = {status: 0 for status in sorted(ALLOWED_STATUSES)}
    route_counts: dict[str, int] = {}
    place_counts: dict[str, int] = {}
    leads_by_day: dict[str, int] = {}

    for row in rows:
        status = str(row["status"] or "new").lower()
        status_counts[status] = status_counts.get(status, 0) + 1

        route_name = str(row["route_driver_name"] or "").strip() or "Без названия"
        route_counts[route_name] = route_counts.get(route_name, 0) + 1

        created_at = str(row["created_at"] or "")
        day = created_at[:10] if len(created_at) >= 10 else "unknown"
        leads_by_day[day] = leads_by_day.get(day, 0) + 1

        pricing = json_loads(str(row["pricing_json"] or "{}"))
        if isinstance(pricing, dict):
            total_value = pricing.get("total", 0)
            if isinstance(total_value, (int, float)):
                total_revenue += float(total_value)

        places = json_loads(str(row["places_json"] or "[]"))
        if isinstance(places, list):
            for place in places:
                if not isinstance(place, dict):
                    continue
                name = str(place.get("name", "")).strip()
                if not name:
                    continue
                place_counts[name] = place_counts.get(name, 0) + 1

    avg_check = (total_revenue / total_leads) if total_leads else 0.0

    top_routes = [
        {"name": name, "count": count}
        for name, count in sorted(route_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    ]
    top_places = [
        {"name": name, "count": count}
        for name, count in sorted(place_counts.items(), key=lambda item: item[1], reverse=True)[:12]
    ]
    leads_timeline = [
        {"date": date, "count": count}
        for date, count in sorted(leads_by_day.items(), key=lambda item: item[0], reverse=True)[:30]
    ]

    return {
        "total_leads": total_leads,
        "total_revenue": int(round(total_revenue)),
        "avg_check": int(round(avg_check)),
        "status_counts": status_counts,
        "top_routes": top_routes,
        "top_places": top_places,
        "leads_timeline": leads_timeline,
    }


def format_money_idr(value: Any) -> str:
    if isinstance(value, (int, float)):
        return f"{int(round(value)):,}".replace(",", " ")
    return str(value)


def render_lead_summary(normalized: dict[str, Any], lead_id: int) -> str:
    customer = normalized.get("customer_name", "-")
    contact = normalized.get("customer_phone", "-")
    travel_date = normalized.get("travel_date") or "-"
    route_days = normalized.get("route_days", "-")
    places = normalized.get("places") if isinstance(normalized.get("places"), list) else []
    places_count = normalized.get("places_count", len(places))

    pricing = normalized.get("pricing") if isinstance(normalized.get("pricing"), dict) else {}
    total = format_money_idr(pricing.get("total", 0))
    package_id = str(pricing.get("packageId") or normalized.get("route_package_id") or "")
    addons = pricing.get("addons") if isinstance(pricing.get("addons"), list) else []

    preview_names = [
        item.get("name", "")
        for item in places[:6]
        if isinstance(item, dict) and item.get("name")
    ]
    route_preview = ", ".join(preview_names)
    if len(places) > 6:
        route_preview = f"{route_preview} +{len(places) - 6}"

    lines = [
        "Новая заявка (backend)",
        f"ID: {lead_id}",
        f"Клиент: {customer}",
        f"Контакт: {contact}",
        f"Дата: {travel_date}",
        f"Дней: {route_days}",
        f"Локаций: {places_count}",
        f"Итого: {total} IDR",
    ]
    if package_id:
        lines.append(f"Пакет: {package_id}")
    if addons:
        lines.append(f"Допуслуги: {', '.join([str(item) for item in addons])}")
    if route_preview:
        lines.append(f"Маршрут: {route_preview}")
    note = normalized.get("customer_note")
    if note:
        lines.append(f"Комментарий: {note}")
    return "\n".join(lines)


def notify_admin_telegram(text: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_ADMIN_CHAT_ID:
        LOGGER.debug("Telegram notification skipped: bot not configured")
        return

    try:
        chat_id: Any = int(TELEGRAM_ADMIN_CHAT_ID)
    except ValueError:
        chat_id = TELEGRAM_ADMIN_CHAT_ID

    payload = {"chat_id": chat_id, "text": text}
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request_obj = urllib.request.Request(
        f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(request_obj, timeout=12):
            LOGGER.info("Telegram notification sent successfully")
            return
    except urllib.error.HTTPError as error:
        LOGGER.error("Telegram API error: HTTP %s - %s", error.code, error.reason)
    except urllib.error.URLError as error:
        LOGGER.error("Telegram connection error: %s", error.reason)
    except Exception as error:
        LOGGER.error("Unexpected error sending Telegram notification: %s", error)


def require_admin_token() -> None:
    header_token = request.headers.get("X-Admin-Token", "")
    query_token = request.args.get("token", "")
    token = header_token or query_token

    if not token:
        LOGGER.warning("Admin endpoint accessed without token from %s", get_remote_address(request))
        abort(401, description="Admin token required")

    if ADMIN_TOKEN and token != ADMIN_TOKEN:
        LOGGER.warning("Invalid admin token attempt from %s", get_remote_address(request))
        abort(401, description="Invalid admin token")


def validate_payload(data: dict[str, Any]) -> tuple[dict[str, Any], str | None]:
    customer = data.get("customer") or {}
    route = data.get("route") or {}
    pricing = data.get("pricing") or {}

    customer_name = str(customer.get("name", "")).strip()
    customer_phone = str(customer.get("phone", "")).strip()

    if not customer_name:
        return {}, "customer.name is required"
    if not customer_phone:
        return {}, "customer.phone is required"

    days_raw = route.get("days", 1)
    try:
        route_days = int(days_raw)
    except (TypeError, ValueError):
        return {}, "route.days must be an integer"

    if route_days < 1 or route_days > 14:
        return {}, "route.days must be between 1 and 14"

    places = route.get("places") or []
    if not isinstance(places, list):
        return {}, "route.places must be an array"

    travel_date = parse_date_ymd(str(customer.get("travel_date", "")).strip())
    if str(customer.get("travel_date", "")).strip() and not travel_date:
        return {}, "customer.travel_date must be YYYY-MM-DD"

    if travel_date and travel_date in set(get_blocked_dates()):
        return {}, "Эта дата занята. Выберите другую дату поездки."

    normalized = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "customer_name": customer_name,
        "customer_phone": customer_phone,
        "travel_date": travel_date,
        "customer_note": str(customer.get("note", "")).strip() or None,
        "source": str(data.get("source", "miniapp")).strip() or "miniapp",
        "route_days": route_days,
        "route_driver_name": str(route.get("driver_name", "")).strip(),
        "route_package_id": str(route.get("package_id", "")).strip() or None,
        "route_addons": route.get("addons") if isinstance(route.get("addons"), list) else [],
        "places_count": len(places),
        "places": places,
        "pricing": pricing,
        "telegram_user": data.get("telegram_user") or {},
    }

    return normalized, None


def map_row(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "customer_name": row["customer_name"],
        "customer_phone": row["customer_phone"],
        "travel_date": row["travel_date"],
        "customer_note": row["customer_note"],
        "source": row["source"],
        "route_days": row["route_days"],
        "route_driver_name": row["route_driver_name"],
        "places_count": row["places_count"],
        "places": json_loads(row["places_json"]),
        "pricing": json_loads(row["pricing_json"]),
        "status": row["status"],
        "telegram_user": {
            "id": row["tg_user_id"],
            "username": row["tg_username"],
            "first_name": row["tg_first_name"],
            "last_name": row["tg_last_name"],
        },
    }


@app.get("/")
def index() -> Any:
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/admin")
def admin_page() -> Any:
    return send_from_directory(BASE_DIR, "admin.html")


@app.get("/api/health")
@limiter.exempt
def health() -> Any:
    health_status = {"ok": True, "timestamp": datetime.now(timezone.utc).isoformat()}

    # Check database connectivity
    try:
        with get_connection() as conn:
            conn.execute("SELECT 1").fetchone()
        health_status["database"] = "connected"
    except sqlite3.Error as error:
        LOGGER.error("Health check: database error - %s", error)
        health_status["database"] = "error"
        health_status["ok"] = False

    # Check Telegram bot configuration
    if TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID:
        health_status["telegram"] = "configured"
    else:
        health_status["telegram"] = "not_configured"

    status_code = 200 if health_status["ok"] else 503
    return jsonify(health_status), status_code


@app.get("/api/spots")
def list_spots() -> Any:
    items, updated_at = get_config_value(CATALOG_CONFIG_KEY)
    if not isinstance(items, list):
        items = []
    return jsonify(
        {
            "ok": True,
            "items": items,
            "updated_at": updated_at,
        }
    )


@app.get("/api/availability")
def get_availability() -> Any:
    blocked_dates = get_blocked_dates()
    _, updated_at = get_config_value(AVAILABILITY_CONFIG_KEY)
    return jsonify(
        {
            "ok": True,
            "blocked_dates": blocked_dates,
            "updated_at": updated_at,
        }
    )


@app.put("/api/availability")
def update_availability() -> Any:
    require_admin_token()
    data = request.get_json(silent=True) or {}
    blocked_dates, error = normalize_blocked_dates_payload(data.get("blocked_dates"))
    if error:
        return jsonify({"ok": False, "error": error}), 400

    saved_at = set_config_value(AVAILABILITY_CONFIG_KEY, blocked_dates)
    return jsonify(
        {
            "ok": True,
            "blocked_dates": blocked_dates,
            "updated_at": saved_at,
        }
    )


@app.post("/api/spots/bootstrap")
def bootstrap_spots() -> Any:
    data = request.get_json(silent=True) or {}
    normalized, error = normalize_spots_payload(data.get("items"))
    if error:
        return jsonify({"ok": False, "error": error}), 400

    existing, updated_at = get_config_value(CATALOG_CONFIG_KEY)
    if isinstance(existing, list) and existing:
        return jsonify(
            {
                "ok": True,
                "bootstrapped": False,
                "items_count": len(existing),
                "updated_at": updated_at,
            }
        )

    saved_at = set_config_value(CATALOG_CONFIG_KEY, normalized)
    return jsonify(
        {
            "ok": True,
            "bootstrapped": True,
            "items_count": len(normalized),
            "updated_at": saved_at,
        }
    )


@app.put("/api/spots")
def save_spots() -> Any:
    require_admin_token()
    data = request.get_json(silent=True) or {}
    normalized, error = normalize_spots_payload(data.get("items"))
    if error:
        return jsonify({"ok": False, "error": error}), 400

    saved_at = set_config_value(CATALOG_CONFIG_KEY, normalized)
    return jsonify(
        {
            "ok": True,
            "items_count": len(normalized),
            "updated_at": saved_at,
        }
    )


@app.post("/api/leads")
@limiter.limit("10 per minute")
def create_lead() -> Any:
    data = request.get_json(silent=True) or {}
    normalized, error = validate_payload(data)
    if error:
        LOGGER.warning("Lead validation failed: %s", error)
        return jsonify({"ok": False, "error": error}), 400

    tg_user = normalized["telegram_user"] if isinstance(normalized["telegram_user"], dict) else {}

    try:
        with get_connection() as conn:
            cur = conn.execute(
                """
                INSERT INTO leads (
                    created_at,
                    customer_name,
                    customer_phone,
                    travel_date,
                    customer_note,
                    source,
                    route_days,
                    route_driver_name,
                    places_count,
                    places_json,
                    pricing_json,
                    tg_user_id,
                    tg_username,
                    tg_first_name,
                    tg_last_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    normalized["created_at"],
                    normalized["customer_name"],
                    normalized["customer_phone"],
                    normalized["travel_date"],
                    normalized["customer_note"],
                    normalized["source"],
                    normalized["route_days"],
                    normalized["route_driver_name"],
                    normalized["places_count"],
                    json_dumps(normalized["places"]),
                    json_dumps(normalized["pricing"]),
                    str(tg_user.get("id", "")) or None,
                    str(tg_user.get("username", "")) or None,
                    str(tg_user.get("first_name", "")) or None,
                    str(tg_user.get("last_name", "")) or None,
                ),
            )
            lead_id = cur.lastrowid

        LOGGER.info("Lead created: ID=%s, customer=%s", lead_id, normalized["customer_name"])

        summary_text = render_lead_summary(normalized, int(lead_id))
        notify_admin_telegram(summary_text)
        add_blocked_date(normalized.get("travel_date"))

        return jsonify({"ok": True, "lead_id": lead_id})

    except sqlite3.Error as error:
        LOGGER.error("Database error creating lead: %s", error)
        return jsonify({"ok": False, "error": "Database error"}), 500


@app.get("/api/leads")
def list_leads() -> Any:
    require_admin_token()

    status = request.args.get("status", "").strip().lower()
    limit_raw = request.args.get("limit", "100")
    try:
        limit = max(1, min(500, int(limit_raw)))
    except ValueError:
        return jsonify({"ok": False, "error": "Invalid limit"}), 400

    query = "SELECT * FROM leads"
    params: list[Any] = []
    if status:
        if status not in ALLOWED_STATUSES:
            return jsonify({"ok": False, "error": "Invalid status"}), 400
        query += " WHERE status = ?"
        params.append(status)

    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    try:
        with get_connection() as conn:
            rows = conn.execute(query, params).fetchall()

        LOGGER.info("Listed %d leads (status=%s)", len(rows), status or "all")
        return jsonify({"ok": True, "items": [map_row(row) for row in rows]})

    except sqlite3.Error as error:
        LOGGER.error("Database error listing leads: %s", error)
        return jsonify({"ok": False, "error": "Database error"}), 500


@app.get("/api/analytics")
def get_analytics() -> Any:
    require_admin_token()
    analytics = build_analytics()
    return jsonify({"ok": True, "analytics": analytics})


@app.patch("/api/leads/<int:lead_id>")
def update_lead(lead_id: int) -> Any:
    require_admin_token()

    data = request.get_json(silent=True) or {}
    status = str(data.get("status", "")).strip().lower()
    if status not in ALLOWED_STATUSES:
        return (
            jsonify(
                {
                    "ok": False,
                    "error": f"status must be one of: {', '.join(sorted(ALLOWED_STATUSES))}",
                }
            ),
            400,
        )

    try:
        with get_connection() as conn:
            cur = conn.execute("UPDATE leads SET status = ? WHERE id = ?", (status, lead_id))

        if cur.rowcount == 0:
            LOGGER.warning("Lead update failed: ID=%s not found", lead_id)
            return jsonify({"ok": False, "error": "Lead not found"}), 404

        LOGGER.info("Lead updated: ID=%s, status=%s", lead_id, status)
        return jsonify({"ok": True})

    except sqlite3.Error as error:
        LOGGER.error("Database error updating lead %s: %s", lead_id, error)
        return jsonify({"ok": False, "error": "Database error"}), 500


@app.get("/<path:filename>")
def static_files(filename: str) -> Any:
    file_path = BASE_DIR / filename
    allowed_suffixes = {".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".map"}
    if file_path.suffix.lower() not in allowed_suffixes:
        abort(404)
    if not file_path.exists() or not file_path.is_file():
        abort(404)
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    init_db()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8080"))
    app.run(host=host, port=port, debug=False)
else:
    init_db()
