from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from .api import router
from .core.config import API_TITLE, API_DESCRIPTION, API_VERSION, CORS_ORIGINS
from .core.exceptions import PayrollAPIError

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title=API_TITLE,
        description=API_DESCRIPTION,
        version=API_VERSION
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add exception handlers
    @app.exception_handler(PayrollAPIError)
    async def payroll_api_error_handler(request, exc: PayrollAPIError):
        return {
            "status_code": exc.status_code,
            "detail": exc.message,
            "type": exc.__class__.__name__
        }

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request, exc: ValidationError):
        return {
            "status_code": 422,
            "detail": str(exc),
            "type": "ValidationError"
        }

    # Include routers
    app.include_router(router)

    return app 