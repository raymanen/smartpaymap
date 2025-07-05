"""
SmartPayMap Backend Application

A professional, modular FastAPI application for AI-powered payroll data mapping.
"""
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables at startup
load_dotenv(verbose=True)
logger.info("Environment variables loaded")

# Log environment check
if os.getenv("ENVIRONMENT"):
    logger.info(f"Running in {os.getenv('ENVIRONMENT')} environment")
else:
    logger.warning("ENVIRONMENT variable not set")

from app import create_app

# Create the FastAPI application
app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
