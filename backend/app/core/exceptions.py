class PayrollAPIError(Exception):
    """Base exception for PayrollAPI errors."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ValidationAPIError(PayrollAPIError):
    """Raised when input validation fails."""
    def __init__(self, message: str):
        super().__init__(message, status_code=422)

class ProcessingAPIError(PayrollAPIError):
    """Raised when data processing fails."""
    def __init__(self, message: str):
        super().__init__(message, status_code=500)

class ServiceUnavailableError(PayrollAPIError):
    """Raised when external services are unavailable."""
    def __init__(self, message: str):
        super().__init__(message, status_code=503) 