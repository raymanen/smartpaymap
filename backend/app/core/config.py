from typing import List

# Standard fields for payroll mapping - Canonical export schema
STANDARD_FIELDS: List[str] = [
    "full_name",        # Employee full name
    "employee_id",      # Unique employee identifier
    "salary",           # Base salary amount
    "bonus",            # Bonus amounts
    "currency",         # Currency code (USD, EUR, etc.)
    "tax_rate",         # Tax rate percentage
    "location",         # Employee location/office
    "employment_date"   # Date of employment/hire
]

# CORS settings
CORS_ORIGINS: List[str] = [
    "http://localhost:5173",  # Vite's default port
    "http://localhost:5174",  # Vite backup port
    "http://localhost:5175",  # Vite backup port
    "http://localhost:3000",  # Alternative React port
]

# API settings
API_TITLE = "SmartPayMap API"
API_DESCRIPTION = "AI-powered payroll mapping tool"
API_VERSION = "0.1.0"

# File upload settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_FILE_EXTENSIONS = [".csv"]
SAMPLE_ROWS_LIMIT = 10 