from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import StreamingResponse
from datetime import datetime
import logging
import pandas as pd
import io
import json
from ..models import (
    PayrollData, 
    AnalysisResponse, 
    CSVResponse, 
    MappingRequest, 
    MappingResponse,
    PolicySimulationRequest,
    PolicySimulationResponse,
    ExportStandardizedRequest
)
from ..services import PayrollService, CSVService, ComplianceAnalysisService
from ..core.config import STANDARD_FIELDS
from ..utils.mapping_utils import construct_standardized_row

router = APIRouter()

# Initialize services
payroll_service = PayrollService()
csv_service = CSVService()
compliance_service = ComplianceAnalysisService()

logger = logging.getLogger(__name__)

@router.get("/ping")
async def ping_check():
    """Simple ping check endpoint."""
    return {"message": "pong"}

@router.get("/health", status_code=200)
async def health_check():
    """Health check endpoint for Docker."""
    return {"status": "ok", "message": "API is running"}

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_payroll_data(data: PayrollData) -> AnalysisResponse:
    """
    Analyze payroll data headers and suggest field mappings.

    Args:
        data (PayrollData): The payroll data containing headers and optional sample rows

    Returns:
        AnalysisResponse: Suggested mappings and analysis notes
    """
    result = await payroll_service.analyze_payroll_data(data.headers, data.rows)
    
    return AnalysisResponse(
        mappings=result["mappings"],
        notes=result["notes"]
    )

@router.post("/upload", response_model=CSVResponse)
async def upload_csv(file: UploadFile = File(...)) -> CSVResponse:
    """
    Upload and parse a CSV file.

    Args:
        file (UploadFile): The CSV file to upload and parse

    Returns:
        CSVResponse: Headers and sample rows from the CSV
    """
    headers, sample_rows = await csv_service.parse_csv(file)
    
    return CSVResponse(
        headers=headers,
        rows=sample_rows
    )

@router.post("/finalize", response_model=MappingResponse)
async def finalize_mappings(mapping_request: MappingRequest) -> MappingResponse:
    """
    Finalize and store the field mappings.
    
    Args:
        mapping_request: MappingRequest object containing field mappings
        
    Returns:
        MappingResponse indicating success status
    """
    result = payroll_service.finalize_mappings(mapping_request.mappings)
    
    return MappingResponse(
        status=result["status"],
        mapping_saved=result["mapping_saved"]
    )

@router.post("/simulate_policy_impact", response_model=PolicySimulationResponse)
async def simulate_policy_impact(request: PolicySimulationRequest) -> PolicySimulationResponse:
    """
    Simulate the impact of policy changes on payroll data.
    
    Args:
        request: PolicySimulationRequest containing headers, rows, and policy changes
        
    Returns:
        PolicySimulationResponse with AI-generated impact analysis
    """
    result = await payroll_service.simulate_policy_impact(
        headers=request.headers,
        rows=request.rows,
        policy_change=request.policy_change
    )
    
    return PolicySimulationResponse(
        impact_summary=result["impact_summary"],
        cost_analysis=result["cost_analysis"],
        compliance_notes=result["compliance_notes"],
        recommendations=result["recommendations"]
    )


@router.get("/compliance_heatmap")
async def get_compliance_heatmap():
    """
    Get global compliance risk heatmap
    
    Returns a heatmap showing compliance risk levels for different countries
    based on regulatory complexity, data protection requirements, and other factors.
    """
    logger.info("Received request for compliance heatmap")
    
    try:
        # Generate compliance risk analysis
        # Note: In a real implementation, this might use actual mapping data
        # from recent uploads or policy simulations to improve accuracy
        compliance_heatmap = compliance_service.analyze_compliance_risks()
        
        logger.info(f"Generated compliance heatmap for {len(compliance_heatmap)} countries")
        
        return {
            "compliance_heatmap": compliance_heatmap,
            "last_updated": datetime.utcnow().isoformat(),
            "total_countries": len(compliance_heatmap)
        }
        
    except Exception as e:
        logger.error(f"Error generating compliance heatmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating compliance heatmap: {str(e)}")


@router.post("/export_standardized")
async def export_standardized(request: ExportStandardizedRequest):
    """
    Export standardized CSV with unified field mapping.
    
    Accepts parsed CSV rows and field mappings, converts data to the unified 
    STANDARD_FIELDS format, and returns a downloadable CSV file.
    
    Args:
        request: ExportStandardizedRequest containing rows (list of dicts) and mappings
        
    Returns:
        StreamingResponse with CSV file download
        
    Example:
        POST /export_standardized
        {
            "rows": [
                {"first_name": "John", "basic_salary": "50000", "dept": "Engineering"},
                {"first_name": "Jane", "basic_salary": "60000", "dept": "Sales"}
            ],
            "mappings": {
                "first_name": "full_name",
                "basic_salary": "salary",
                "dept": "location"
            }
        }
    """
    logger.info(f"Received export request with {len(request.rows)} rows and {len(request.mappings)} mappings")
    
    try:
        # Convert input data to the format expected by construct_standardized_row
        # The function expects headers (list) and rows (list of lists), but we have list of dicts
        
        if not request.rows:
            logger.warning("No rows provided for export")
            raise HTTPException(status_code=400, detail="No data rows provided for export")
        
        if not request.mappings:
            logger.warning("No mappings provided for export")
            raise HTTPException(status_code=400, detail="No field mappings provided for export")
        
        # Extract headers from the first row (all rows should have same keys)
        headers = list(request.rows[0].keys())
        logger.info(f"Detected headers: {headers}")
        
        # Convert list of dicts to list of lists (rows format)
        data_rows = []
        for row_dict in request.rows:
            # Ensure consistent ordering based on headers
            row_list = [row_dict.get(header, "") for header in headers]
            data_rows.append(row_list)
        
        # Process each row to create standardized data
        standardized_data = []
        for row in data_rows:
            standardized_row = construct_standardized_row(row, headers, request.mappings)
            standardized_data.append(standardized_row)
        
        logger.info(f"Successfully processed {len(standardized_data)} rows")
        
        # Create pandas DataFrame with standardized data
        df = pd.DataFrame(standardized_data)
        
        # Ensure all STANDARD_FIELDS are present as columns (add missing ones as empty)
        for field in STANDARD_FIELDS:
            if field not in df.columns:
                df[field] = ""
        
        # Reorder columns to match STANDARD_FIELDS order
        df = df[STANDARD_FIELDS]
        
        # Fill NaN values with empty strings for cleaner export
        df = df.fillna("")
        
        # Convert DataFrame to CSV
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8')
        csv_content = csv_buffer.getvalue()
        
        # Create filename with timestamp
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"standardized_export_{timestamp}.csv"
        
        logger.info(f"Generated CSV export with {len(df)} rows and {len(df.columns)} columns: {filename}")
        
        # Return CSV as downloadable file
        return StreamingResponse(
            io.BytesIO(csv_content.encode('utf-8')),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Type": "text/csv; charset=utf-8"
            }
        )
        
    except Exception as e:
        logger.error(f"Error in export_standardized: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating standardized export: {str(e)}")