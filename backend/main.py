from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, constr
from typing import List, Dict, Any
import httpx
import pandas as pd
import io
from pandas.errors import EmptyDataError, ParserError

from llm_utils import get_mapping_suggestions, MappingSuggestion

# Standard fields for payroll mapping
STANDARD_FIELDS = [
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

# In-memory storage for mappings (mock database)
stored_mappings: List[Dict[str, str]] = []

class PayrollData(BaseModel):
    """Request model for payroll data analysis."""
    headers: List[str] = Field(..., min_items=1, description="List of CSV column headers")
    rows: List[List[str]] = Field(default=[], description="Sample data rows (optional)")

class AnalysisResponse(BaseModel):
    """Response model for payroll analysis."""
    mappings: Dict[str, Any] = Field(..., description="Suggested field mappings")
    notes: List[str] = Field(..., description="Analysis notes and warnings")

class CSVResponse(BaseModel):
    """Response model for CSV file upload."""
    headers: List[str] = Field(..., description="CSV column headers")
    rows: List[List[str]] = Field(..., description="Sample data rows")

class MappingRequest(BaseModel):
    """
    Request model for field mappings.
    Each key in mappings dict is a CSV field name, value is the standard field it maps to.
    """
    mappings: Dict[str, constr(min_length=1)]  # Ensures all values are non-empty strings

class MappingResponse(BaseModel):
    """Response model for mapping submission"""
    status: str
    mapping_saved: bool

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
        # Get mapping suggestions from LLM
        result = get_mapping_suggestions(data.headers, STANDARD_FIELDS)

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

@app.post("/upload", response_model=CSVResponse)
async def upload_csv(file: UploadFile = File(...)) -> CSVResponse:
    """
    Upload and parse a CSV file.

    Args:
        file (UploadFile): The CSV file to upload and parse

    Returns:
        CSVResponse: Headers and sample rows from the CSV

    Raises:
        HTTPException: If file upload or parsing fails
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=422,
            detail="Only CSV files are allowed"
        )

    try:
        # Read the file content
        content = await file.read()
        if not content:
            raise HTTPException(
                status_code=422,
                detail="Empty file uploaded"
            )

        # Try different encodings if needed
        encodings = ['utf-8', 'latin1', 'iso-8859-1']
        df = None
        last_error = None

        for encoding in encodings:
            try:
                # Create a BytesIO object from the content
                file_obj = io.BytesIO(content)
                df = pd.read_csv(file_obj, encoding=encoding)
                break
            except UnicodeDecodeError:
                last_error = f"Failed to decode with {encoding} encoding"
                continue
            except Exception as e:
                last_error = str(e)
                break

        if df is None:
            raise HTTPException(
                status_code=422,
                detail=f"Failed to parse CSV file: {last_error}"
            )

        # Get headers and sample rows
        headers = df.columns.tolist()
        
        # Convert sample rows to list of lists, handling non-string data
        sample_rows = df.head(10).fillna('').astype(str).values.tolist()

        return CSVResponse(
            headers=headers,
            rows=sample_rows
        )

    except EmptyDataError:
        raise HTTPException(
            status_code=422,
            detail="The CSV file is empty"
        )
    except ParserError:
        raise HTTPException(
            status_code=422,
            detail="Invalid CSV format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error processing CSV file: {str(e)}"
        )
    finally:
        await file.close()

@app.post("/finalize", response_model=MappingResponse)
async def finalize_mappings(mapping_request: MappingRequest) -> MappingResponse:
    """
    Finalize and store the field mappings.
    
    Args:
        mapping_request: MappingRequest object containing field mappings
        
    Returns:
        MappingResponse indicating success status
        
    Raises:
        HTTPException: If validation fails or processing error occurs
    """
    try:
        # Validate that all mapped fields are in our standard fields list
        invalid_fields = [
            field for field in mapping_request.mappings.values()
            if field not in STANDARD_FIELDS
        ]
        
        if invalid_fields:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid standard fields: {', '.join(invalid_fields)}"
            )
            
        # Store the mapping (mock database operation)
        stored_mappings.append(mapping_request.mappings)
        
        # Log the mapping for debugging
        print(f"Stored new mapping: {mapping_request.mappings}")
        
        return MappingResponse(
            status="success",
            mapping_saved=True
        )
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error processing mapping: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process mapping"
        ) 