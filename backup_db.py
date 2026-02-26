#!/usr/bin/env python3
"""
Database backup script for Bali Tours application.
Creates timestamped backups of the SQLite database.

Usage:
    python3 backup_db.py
    
Environment variables:
    DB_PATH - Path to the database file (default: ./leads.db)
    BACKUP_DIR - Directory for backups (default: ./backups)
    BACKUP_RETENTION_DAYS - Days to keep old backups (default: 30)
"""

import logging
import os
import shutil
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
LOGGER = logging.getLogger("backup")

DB_PATH = Path(os.getenv("DB_PATH", "./leads.db")).expanduser()
BACKUP_DIR = Path(os.getenv("BACKUP_DIR", "./backups")).expanduser()
BACKUP_RETENTION_DAYS = int(os.getenv("BACKUP_RETENTION_DAYS", "30"))


def create_backup() -> Path | None:
    """Create a timestamped backup of the database."""
    if not DB_PATH.exists():
        LOGGER.error("Database file not found: %s", DB_PATH)
        return None
    
    try:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    except OSError as error:
        LOGGER.error("Failed to create backup directory: %s", error)
        return None
    
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_path = BACKUP_DIR / f"leads_backup_{timestamp}.db"
    
    try:
        # Use SQLite backup API for safe backup
        source_conn = sqlite3.connect(DB_PATH)
        backup_conn = sqlite3.connect(backup_path)
        
        with backup_conn:
            source_conn.backup(backup_conn)
        
        source_conn.close()
        backup_conn.close()
        
        backup_size = backup_path.stat().st_size
        LOGGER.info("Backup created: %s (%.2f MB)", backup_path.name, backup_size / 1024 / 1024)
        return backup_path
    
    except sqlite3.Error as error:
        LOGGER.error("Database backup failed: %s", error)
        if backup_path.exists():
            backup_path.unlink()
        return None
    except Exception as error:
        LOGGER.error("Unexpected error during backup: %s", error)
        if backup_path.exists():
            backup_path.unlink()
        return None


def cleanup_old_backups() -> None:
    """Remove backups older than BACKUP_RETENTION_DAYS."""
    if not BACKUP_DIR.exists():
        return
    
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=BACKUP_RETENTION_DAYS)
    removed_count = 0
    
    try:
        for backup_file in BACKUP_DIR.glob("leads_backup_*.db"):
            file_mtime = datetime.fromtimestamp(backup_file.stat().st_mtime, tz=timezone.utc)
            
            if file_mtime < cutoff_date:
                try:
                    backup_file.unlink()
                    removed_count += 1
                    LOGGER.info("Removed old backup: %s", backup_file.name)
                except OSError as error:
                    LOGGER.warning("Failed to remove old backup %s: %s", backup_file.name, error)
        
        if removed_count > 0:
            LOGGER.info("Cleanup complete: removed %d old backup(s)", removed_count)
        else:
            LOGGER.info("No old backups to remove")
    
    except Exception as error:
        LOGGER.error("Error during backup cleanup: %s", error)


def verify_backup(backup_path: Path) -> bool:
    """Verify that the backup is a valid SQLite database."""
    try:
        conn = sqlite3.connect(backup_path)
        cursor = conn.execute("SELECT COUNT(*) FROM leads")
        count = cursor.fetchone()[0]
        conn.close()
        LOGGER.info("Backup verification: %d leads found", count)
        return True
    except sqlite3.Error as error:
        LOGGER.error("Backup verification failed: %s", error)
        return False


def main() -> int:
    """Main backup routine."""
    LOGGER.info("Starting database backup...")
    LOGGER.info("Database: %s", DB_PATH)
    LOGGER.info("Backup directory: %s", BACKUP_DIR)
    LOGGER.info("Retention: %d days", BACKUP_RETENTION_DAYS)
    
    backup_path = create_backup()
    if not backup_path:
        LOGGER.error("Backup failed")
        return 1
    
    if not verify_backup(backup_path):
        LOGGER.error("Backup verification failed")
        return 1
    
    cleanup_old_backups()
    LOGGER.info("Backup completed successfully")
    return 0


if __name__ == "__main__":
    sys.exit(main())
