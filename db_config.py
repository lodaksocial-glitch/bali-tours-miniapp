"""
Database configuration module supporting both SQLite and PostgreSQL.
Set DATABASE_URL environment variable to use PostgreSQL.

Example PostgreSQL URL:
    postgresql://user:password@host:port/database
"""

import logging
import os
from typing import Any

LOGGER = logging.getLogger("db-config")

# Check if PostgreSQL is requested
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
USE_POSTGRES = DATABASE_URL.startswith("postgresql://") or DATABASE_URL.startswith("postgres://")

if USE_POSTGRES:
    try:
        import psycopg2
        import psycopg2.extras
        POSTGRES_AVAILABLE = True
    except ImportError:
        LOGGER.warning(
            "PostgreSQL requested but psycopg2 not installed. "
            "Install with: pip install psycopg2-binary"
        )
        POSTGRES_AVAILABLE = False
        USE_POSTGRES = False
else:
    POSTGRES_AVAILABLE = False


def get_db_connection() -> Any:
    """Get database connection based on configuration."""
    if USE_POSTGRES and POSTGRES_AVAILABLE:
        return psycopg2.connect(DATABASE_URL)
    
    # Fallback to SQLite
    import sqlite3
    from pathlib import Path
    
    db_path = Path(os.getenv("DB_PATH", "./leads.db")).expanduser()
    conn = sqlite3.connect(db_path, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def init_database() -> None:
    """Initialize database schema."""
    if USE_POSTGRES and POSTGRES_AVAILABLE:
        _init_postgres()
    else:
        _init_sqlite()


def _init_sqlite() -> None:
    """Initialize SQLite schema."""
    from pathlib import Path
    import sqlite3
    
    db_path = Path(os.getenv("DB_PATH", "./leads.db")).expanduser()
    
    try:
        db_path.parent.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        fallback = Path("/tmp/leads.db")
        fallback.parent.mkdir(parents=True, exist_ok=True)
        LOGGER.warning("Using fallback database path: %s", fallback)
        os.environ["DB_PATH"] = str(fallback)
    
    conn = get_db_connection()
    with conn:
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
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_travel_date ON leads(travel_date)")
        
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS app_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
    conn.close()
    LOGGER.info("SQLite database initialized")


def _init_postgres() -> None:
    """Initialize PostgreSQL schema."""
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                travel_date DATE,
                customer_note TEXT,
                source TEXT,
                route_days INTEGER NOT NULL,
                route_driver_name TEXT,
                places_count INTEGER NOT NULL,
                places_json JSONB NOT NULL,
                pricing_json JSONB NOT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                tg_user_id TEXT,
                tg_username TEXT,
                tg_first_name TEXT,
                tg_last_name TEXT
            )
            """
        )
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_travel_date ON leads(travel_date)")
        
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS app_config (
                key TEXT PRIMARY KEY,
                value JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL
            )
            """
        )
    conn.commit()
    conn.close()
    LOGGER.info("PostgreSQL database initialized")


# Export configuration
__all__ = ["get_db_connection", "init_database", "USE_POSTGRES", "POSTGRES_AVAILABLE"]
