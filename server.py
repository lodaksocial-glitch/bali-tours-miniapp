import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, abort, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "leads.db"
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "change-me")
ALLOWED_STATUSES = {"new", "contacted", "booked", "archived"}
CATALOG_CONFIG_KEY = "catalog_spots"

app = Flask(__name__)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
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
            """
            CREATE TABLE IF NOT EXISTS app_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )


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


def require_admin_token() -> None:
    header_token = request.headers.get("X-Admin-Token", "")
    query_token = request.args.get("token", "")
    token = header_token or query_token

    if ADMIN_TOKEN and token != ADMIN_TOKEN:
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

    normalized = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "customer_name": customer_name,
        "customer_phone": customer_phone,
        "travel_date": str(customer.get("travel_date", "")).strip() or None,
        "customer_note": str(customer.get("note", "")).strip() or None,
        "source": str(data.get("source", "miniapp")).strip() or "miniapp",
        "route_days": route_days,
        "route_driver_name": str(route.get("driver_name", "")).strip(),
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
def health() -> Any:
    return jsonify({"ok": True})


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
def create_lead() -> Any:
    data = request.get_json(silent=True) or {}
    normalized, error = validate_payload(data)
    if error:
        return jsonify({"ok": False, "error": error}), 400

    tg_user = normalized["telegram_user"] if isinstance(normalized["telegram_user"], dict) else {}

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

    return jsonify({"ok": True, "lead_id": lead_id})


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
        query += " WHERE status = ?"
        params.append(status)

    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    with get_connection() as conn:
        rows = conn.execute(query, params).fetchall()

    return jsonify({"ok": True, "items": [map_row(row) for row in rows]})


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

    with get_connection() as conn:
        cur = conn.execute("UPDATE leads SET status = ? WHERE id = ?", (status, lead_id))

    if cur.rowcount == 0:
        return jsonify({"ok": False, "error": "Lead not found"}), 404

    return jsonify({"ok": True})


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
