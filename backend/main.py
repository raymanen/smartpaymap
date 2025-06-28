from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import httpx

from llm_utils import generate_llm_prompt, get_mapping_suggestion, MappingSuggestion

# Standard fields for payroll mapping
STANDARD_FIELDS = ["full_name", "currency", "salary", "country_code", "city"]

class PayrollData(BaseModel):
    """Request model for payroll data analysis."""
    headers: List[str] = Field(..., min_items=1, description="List of CSV column headers")
    rows: List[List[str]] = Field(default=[], description="Sample data rows (optional)")

class AnalysisResponse(BaseModel):
    """Response model for payroll analysis."""
    mappings: Dict[str, Any] = Field(..., description="Suggested field mappings")
    notes: List[str] = Field(..., description="Analysis notes and warnings")

app = FastAPI(
    title="SmartPayMap API",
    description="AI-powered payroll mapping tool",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def health_check():
    """Health check endpoint."""
    return {"message": "pong"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_payroll_data(data: PayrollData) -> AnalysisResponse:
    """
    Analyze payroll data headers and suggest field mappings.

    Args:
        data (PayrollData): The payroll data containing headers and optional sample rows

    Returns:
        AnalysisResponse: Suggested mappings and analysis notes

    Raises:
        HTTPException: If the analysis fails or required data is missing
    """
    try:
        # Generate prompt for the LLM
        prompt_data = {
            "headers": data.headers,
            "standard_fields": STANDARD_FIELDS
        }
        prompt = generate_llm_prompt(prompt_data)

        # Get mapping suggestions from LLM
        result = get_mapping_suggestion(prompt)

        return AnalysisResponse(
            mappings=result["mappings"],
            notes=result["notes"]
        )

    except ValueError as e:
        # Configuration or validation errors
        raise HTTPException(
            status_code=422,
            detail=f"Invalid request or configuration: {str(e)}"
        )
    except httpx.TimeoutException:
        # OpenAI API timeout
        raise HTTPException(
            status_code=503,
            detail="Analysis service temporarily unavailable (timeout)"
        )
    except Exception as e:
        # Other unexpected errors
        raise HTTPException(
            status_code=503,
            detail=f"Analysis service error: {str(e)}"
        ) 