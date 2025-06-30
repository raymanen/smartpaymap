"""
SmartPayMap Backend Application

A professional, modular FastAPI application for AI-powered payroll data mapping.
"""

from app import create_app

# Create the FastAPI application
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_new:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 