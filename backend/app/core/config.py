from typing import List

# Standard fields for payroll mapping
STANDARD_FIELDS: List[str] = [
    "full_name",      # For employee name fields
    "currency",       # For currency codes/types
    "base_salary",    # For base salary amount
    "bonus",          # For bonus amounts
    "total_salary",   # For combined salary calculations
    "tax_rate",       # For tax percentage/rate
    "location",       # For location/city names
    "country_code",   # For country identifiers
    "employee_id",    # For employee identifiers
    "hire_date",      # For employment/hire dates
    "other"          # For fields that don't match standard categories
]

# CORS settings
CORS_ORIGINS: List[str] = [
    "http://localhost:5173",  # Vite's default port
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