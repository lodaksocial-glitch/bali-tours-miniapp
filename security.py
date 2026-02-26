"""
Security utilities and input validation for Bali Tours application.
"""

import re
from typing import Any


def sanitize_string(value: Any, max_length: int = 500) -> str:
    """Sanitize string input by removing dangerous characters."""
    if not isinstance(value, str):
        value = str(value)
    
    # Remove null bytes and control characters
    value = value.replace("\x00", "")
    value = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", value)
    
    # Trim to max length
    return value.strip()[:max_length]


def validate_phone(phone: str) -> tuple[bool, str]:
    """
    Validate phone number format.
    Accepts: +1234567890, @username, t.me/username, or plain numbers.
    """
    phone = sanitize_string(phone, 100)
    
    if not phone:
        return False, "Phone number is required"
    
    # Allow Telegram usernames
    if phone.startswith("@") or phone.startswith("t.me/"):
        if len(phone) < 3:
            return False, "Invalid Telegram username"
        return True, phone
    
    # Allow phone numbers with optional + and spaces/dashes
    phone_pattern = r"^\+?[\d\s\-\(\)]{7,20}$"
    if re.match(phone_pattern, phone):
        return True, phone
    
    return False, "Invalid phone format. Use: +1234567890, @username, or t.me/username"


def validate_name(name: str) -> tuple[bool, str]:
    """Validate customer name."""
    name = sanitize_string(name, 200)
    
    if not name:
        return False, "Name is required"
    
    if len(name) < 2:
        return False, "Name is too short"
    
    # Allow letters, spaces, hyphens, apostrophes from various languages
    if not re.match(r"^[\w\s\-'\.]+$", name, re.UNICODE):
        return False, "Name contains invalid characters"
    
    return True, name


def validate_date_format(date_str: str) -> tuple[bool, str]:
    """Validate date string is in YYYY-MM-DD format."""
    if not date_str:
        return True, ""  # Optional field
    
    date_pattern = r"^\d{4}-\d{2}-\d{2}$"
    if not re.match(date_pattern, date_str):
        return False, "Date must be in YYYY-MM-DD format"
    
    # Basic range validation
    try:
        year, month, day = map(int, date_str.split("-"))
        if not (2024 <= year <= 2030):
            return False, "Year must be between 2024 and 2030"
        if not (1 <= month <= 12):
            return False, "Invalid month"
        if not (1 <= day <= 31):
            return False, "Invalid day"
    except ValueError:
        return False, "Invalid date format"
    
    return True, date_str


def validate_integer_range(value: Any, min_val: int, max_val: int, field_name: str) -> tuple[bool, int, str]:
    """Validate integer is within range."""
    try:
        int_value = int(value)
    except (TypeError, ValueError):
        return False, 0, f"{field_name} must be an integer"
    
    if not (min_val <= int_value <= max_val):
        return False, 0, f"{field_name} must be between {min_val} and {max_val}"
    
    return True, int_value, ""


def validate_json_size(data: Any, max_items: int = 100) -> tuple[bool, str]:
    """Validate JSON array/object size to prevent DoS."""
    if isinstance(data, list):
        if len(data) > max_items:
            return False, f"Array too large (max {max_items} items)"
    elif isinstance(data, dict):
        if len(data) > max_items:
            return False, f"Object too large (max {max_items} keys)"
    
    return True, ""


def validate_url(url: str) -> tuple[bool, str]:
    """Validate URL format."""
    if not url:
        return True, ""  # Optional field
    
    url = sanitize_string(url, 2000)
    
    # Basic URL validation
    url_pattern = r"^https?://[\w\-\.]+(:\d+)?(/[\w\-\./?%&=]*)?$"
    if not re.match(url_pattern, url, re.IGNORECASE):
        return False, "Invalid URL format"
    
    return True, url


def check_sql_injection_patterns(value: str) -> bool:
    """
    Check for common SQL injection patterns.
    Returns True if suspicious patterns detected.
    """
    if not isinstance(value, str):
        return False
    
    value_lower = value.lower()
    
    # Common SQL injection patterns
    dangerous_patterns = [
        "union select",
        "drop table",
        "delete from",
        "insert into",
        "update set",
        "exec(",
        "execute(",
        "script>",
        "<iframe",
        "javascript:",
        "onerror=",
        "onload=",
    ]
    
    for pattern in dangerous_patterns:
        if pattern in value_lower:
            return True
    
    return False


def validate_lead_payload(data: dict[str, Any]) -> tuple[bool, str, dict[str, Any]]:
    """
    Comprehensive validation of lead creation payload.
    Returns: (is_valid, error_message, sanitized_data)
    """
    if not isinstance(data, dict):
        return False, "Invalid payload format", {}
    
    customer = data.get("customer") or {}
    route = data.get("route") or {}
    
    # Validate customer name
    name = customer.get("name", "")
    is_valid, name_or_error = validate_name(name)
    if not is_valid:
        return False, f"customer.name: {name_or_error}", {}
    customer_name = name_or_error
    
    # Validate customer phone
    phone = customer.get("phone", "")
    is_valid, phone_or_error = validate_phone(phone)
    if not is_valid:
        return False, f"customer.phone: {phone_or_error}", {}
    customer_phone = phone_or_error
    
    # Validate travel date
    travel_date = customer.get("travel_date", "")
    is_valid, date_or_error = validate_date_format(travel_date)
    if not is_valid:
        return False, f"customer.travel_date: {date_or_error}", {}
    
    # Validate route days
    is_valid, days, error = validate_integer_range(
        route.get("days", 1), 1, 14, "route.days"
    )
    if not is_valid:
        return False, error, {}
    
    # Validate places array
    places = route.get("places", [])
    if not isinstance(places, list):
        return False, "route.places must be an array", {}
    
    is_valid, error = validate_json_size(places, max_items=50)
    if not is_valid:
        return False, f"route.places: {error}", {}
    
    # Check for SQL injection attempts
    for field_value in [customer_name, customer_phone, customer.get("note", "")]:
        if check_sql_injection_patterns(str(field_value)):
            return False, "Invalid characters detected", {}
    
    sanitized = {
        "customer": {
            "name": customer_name,
            "phone": customer_phone,
            "travel_date": date_or_error,
            "note": sanitize_string(customer.get("note", ""), 1000),
        },
        "route": {
            "days": days,
            "driver_name": sanitize_string(route.get("driver_name", ""), 200),
            "places": places[:50],  # Limit to 50 places
        },
        "pricing": data.get("pricing", {}),
        "source": sanitize_string(data.get("source", "miniapp"), 50),
        "telegram_user": data.get("telegram_user", {}),
    }
    
    return True, "", sanitized


__all__ = [
    "sanitize_string",
    "validate_phone",
    "validate_name",
    "validate_date_format",
    "validate_integer_range",
    "validate_json_size",
    "validate_url",
    "check_sql_injection_patterns",
    "validate_lead_payload",
]
