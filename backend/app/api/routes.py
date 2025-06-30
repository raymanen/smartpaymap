from fastapi import APIRouter, File, UploadFile
from ..models import PayrollData, AnalysisResponse, CSVResponse, MappingRequest, MappingResponse
from ..services import PayrollService, CSVService

router = APIRouter()

# Initialize services
payroll_service = PayrollService()
csv_service = CSVService()

@router.get("/ping")
async def health_check():
    """Health check endpoint."""
    return {"message": "pong"}

@router.get("/health")
async def detailed_health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "endpoints": {
            "analyze": "operational",
            "upload": "operational",
            "finalize": "operational"
        }
    }

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