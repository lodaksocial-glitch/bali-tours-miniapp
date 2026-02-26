#!/usr/bin/env python3
"""
Security check script for Bali Tours application.
Validates configuration and identifies potential security issues.

Usage:
    python3 check_security.py
"""

import os
import sys
from pathlib import Path


class SecurityChecker:
    def __init__(self):
        self.issues = []
        self.warnings = []
        self.passed = []
    
    def check_admin_token(self):
        """Check ADMIN_TOKEN strength."""
        token = os.getenv("ADMIN_TOKEN", "")
        
        if not token:
            self.issues.append("❌ ADMIN_TOKEN is not set")
        elif token == "change-me":
            self.issues.append("❌ ADMIN_TOKEN is using default value 'change-me'")
        elif len(token) < 32:
            self.warnings.append(f"⚠️  ADMIN_TOKEN is weak (length: {len(token)}, recommended: 32+)")
        else:
            self.passed.append(f"✅ ADMIN_TOKEN is strong (length: {len(token)})")
    
    def check_database_config(self):
        """Check database configuration."""
        db_path = os.getenv("DB_PATH", "./leads.db")
        database_url = os.getenv("DATABASE_URL", "")
        
        if database_url:
            if database_url.startswith("postgresql://") or database_url.startswith("postgres://"):
                self.passed.append("✅ PostgreSQL configured")
            else:
                self.warnings.append("⚠️  DATABASE_URL set but not PostgreSQL")
        else:
            if "/tmp/" in db_path:
                self.warnings.append("⚠️  Using ephemeral storage (/tmp) - data will be lost on restart")
            else:
                self.passed.append(f"✅ SQLite database: {db_path}")
    
    def check_telegram_config(self):
        """Check Telegram bot configuration."""
        bot_token = os.getenv("BOT_TOKEN", "")
        admin_chat_id = os.getenv("ADMIN_CHAT_ID", "")
        
        if not bot_token:
            self.warnings.append("⚠️  BOT_TOKEN not set - Telegram notifications disabled")
        else:
            self.passed.append("✅ BOT_TOKEN configured")
        
        if not admin_chat_id:
            self.warnings.append("⚠️  ADMIN_CHAT_ID not set - admin notifications disabled")
        else:
            self.passed.append("✅ ADMIN_CHAT_ID configured")
    
    def check_cors_config(self):
        """Check CORS configuration."""
        allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
        
        if allowed_origins == "*":
            self.warnings.append("⚠️  CORS allows all origins (*) - restrict in production")
        else:
            origins = allowed_origins.split(",")
            self.passed.append(f"✅ CORS restricted to {len(origins)} origin(s)")
    
    def check_files(self):
        """Check for required files."""
        required_files = [
            "server.py",
            "bot.py",
            "requirements.txt",
            ".env.example",
        ]
        
        for filename in required_files:
            if not Path(filename).exists():
                self.issues.append(f"❌ Required file missing: {filename}")
            else:
                self.passed.append(f"✅ File exists: {filename}")
        
        if not Path(".env").exists():
            self.warnings.append("⚠️  .env file not found - using environment variables")
    
    def check_backup_config(self):
        """Check backup configuration."""
        backup_dir = os.getenv("BACKUP_DIR", "./backups")
        retention = os.getenv("BACKUP_RETENTION_DAYS", "30")
        
        if Path("backup_db.py").exists():
            self.passed.append("✅ Backup script available")
            
            if Path(backup_dir).exists():
                backups = list(Path(backup_dir).glob("leads_backup_*.db"))
                if backups:
                    self.passed.append(f"✅ Found {len(backups)} backup(s)")
                else:
                    self.warnings.append("⚠️  No backups found - run backup_db.py")
            else:
                self.warnings.append(f"⚠️  Backup directory doesn't exist: {backup_dir}")
        else:
            self.warnings.append("⚠️  backup_db.py not found")
    
    def check_dependencies(self):
        """Check if critical dependencies are installed."""
        try:
            import flask
            self.passed.append(f"✅ Flask {flask.__version__} installed")
        except ImportError:
            self.issues.append("❌ Flask not installed")
        
        try:
            import telegram
            self.passed.append(f"✅ python-telegram-bot {telegram.__version__} installed")
        except ImportError:
            self.issues.append("❌ python-telegram-bot not installed")
        
        try:
            import flask_limiter
            self.passed.append("✅ Flask-Limiter installed")
        except ImportError:
            self.warnings.append("⚠️  Flask-Limiter not installed - no rate limiting")
        
        try:
            import flask_cors
            self.passed.append("✅ Flask-CORS installed")
        except ImportError:
            self.warnings.append("⚠️  Flask-CORS not installed - CORS not configured")
    
    def run_all_checks(self):
        """Run all security checks."""
        print("🔒 Security Check for Bali Tours Application\n")
        
        self.check_admin_token()
        self.check_database_config()
        self.check_telegram_config()
        self.check_cors_config()
        self.check_files()
        self.check_backup_config()
        self.check_dependencies()
        
        # Print results
        if self.passed:
            print("✅ PASSED CHECKS:")
            for item in self.passed:
                print(f"   {item}")
            print()
        
        if self.warnings:
            print("⚠️  WARNINGS:")
            for item in self.warnings:
                print(f"   {item}")
            print()
        
        if self.issues:
            print("❌ CRITICAL ISSUES:")
            for item in self.issues:
                print(f"   {item}")
            print()
        
        # Summary
        total = len(self.passed) + len(self.warnings) + len(self.issues)
        print(f"📊 SUMMARY: {len(self.passed)} passed, {len(self.warnings)} warnings, {len(self.issues)} issues")
        
        if self.issues:
            print("\n⚠️  Fix critical issues before deploying to production!")
            return 1
        elif self.warnings:
            print("\n⚠️  Review warnings and improve security configuration")
            return 0
        else:
            print("\n✅ All security checks passed!")
            return 0


def main():
    """Main entry point."""
    # Try to load .env file if it exists
    env_file = Path(".env")
    if env_file.exists():
        print(f"Loading environment from {env_file}\n")
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ.setdefault(key.strip(), value.strip())
    
    checker = SecurityChecker()
    return checker.run_all_checks()


if __name__ == "__main__":
    sys.exit(main())
