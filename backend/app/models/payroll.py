from pydantic import BaseModel, Field, constr
from typing import List, Dict, Any

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