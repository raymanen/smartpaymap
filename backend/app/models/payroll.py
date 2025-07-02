from pydantic import BaseModel, Field
from typing import List, Dict, Any, Annotated, Optional

class PayrollData(BaseModel):
    """Request model for payroll data analysis."""
    headers: List[str] = Field(..., min_length=1, description="List of CSV column headers")
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
    mappings: Dict[str, Annotated[str, Field(min_length=1)]]  # Ensures all values are non-empty strings

class MappingResponse(BaseModel):
    """Response model for mapping submission"""
    status: str
    mapping_saved: bool

class PolicyChange(BaseModel):
    """Request model for policy change parameters"""
    target_country: str = Field(..., description="Target country code (e.g., US, UK, DE)")
    new_currency: str = Field(default="", description="New currency code (optional)")
    adjusted_salary: Optional[float] = Field(default=None, description="Adjusted salary amount (optional)")
    notes: str = Field(default="", description="Additional assumptions or notes")

class PolicySimulationRequest(BaseModel):
    """Request model for policy simulation"""
    headers: List[str] = Field(..., description="CSV column headers")
    rows: List[List[str]] = Field(..., description="CSV data rows")
    policy_change: PolicyChange = Field(..., description="Policy change parameters")

class CostAnalysis(BaseModel):
    """Cost analysis model for policy simulation"""
    estimated_change: str = Field(..., description="Estimated cost change")
    currency_impact: str = Field(..., description="Currency conversion impact")
    tax_implications: str = Field(..., description="Tax implications")

class PolicySimulationResponse(BaseModel):
    """Response model for policy simulation"""
    impact_summary: str = Field(..., description="Overall impact summary")
    cost_analysis: CostAnalysis = Field(..., description="Detailed cost analysis")
    compliance_notes: List[str] = Field(..., description="Compliance considerations")
    recommendations: List[str] = Field(..., description="AI recommendations")

class ExportStandardizedRequest(BaseModel):
    """Request model for standardized CSV export"""
    rows: List[Dict[str, str]] = Field(..., description="Parsed CSV data as list of dictionaries")
    mappings: Dict[str, str] = Field(..., description="Field mappings from source to standard fields")