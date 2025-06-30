from typing import Dict, List
import httpx
from ..core.exceptions import ValidationAPIError, ProcessingAPIError, ServiceUnavailableError
from ..core.config import STANDARD_FIELDS

# Import from utils module
from ..utils.llm_utils import get_mapping_suggestions

class PayrollService:
    """Service for handling payroll data analysis and mapping."""
    
    def __init__(self):
        # In-memory storage for mappings (mock database)
        self.stored_mappings: List[Dict[str, str]] = []
    
    async def analyze_payroll_data(self, headers: List[str], rows: List[List[str]] = None) -> Dict:
        """
        Analyze payroll data headers and suggest field mappings.
        
        Args:
            headers: List of CSV column headers
            rows: Optional sample data rows
            
        Returns:
            Dictionary with mappings and notes
            
        Raises:
            ValidationAPIError: If headers are invalid
            ProcessingAPIError: If analysis fails
            ServiceUnavailableError: If external services are unavailable
        """
        if not headers:
            raise ValidationAPIError("No headers provided")

        try:
            # Get mapping suggestions from LLM
            result = get_mapping_suggestions(headers, STANDARD_FIELDS)
            
            if not result["mappings"]:
                raise ProcessingAPIError("Failed to generate mapping suggestions")

            return result

        except httpx.TimeoutException:
            raise ServiceUnavailableError("Analysis service temporarily unavailable (timeout)")
        except Exception as e:
            raise ProcessingAPIError(f"Analysis service error: {str(e)}")
    
    def finalize_mappings(self, mappings: Dict[str, str]) -> Dict[str, any]:
        """
        Finalize and store the field mappings.
        
        Args:
            mappings: Dictionary of field mappings
            
        Returns:
            Dictionary with status and success flag
            
        Raises:
            ValidationAPIError: If mappings are invalid
            ProcessingAPIError: If storing fails
        """
        try:
            # Validate that all mapped fields are in our standard fields list
            invalid_fields = [
                field for field in mappings.values()
                if field not in STANDARD_FIELDS
            ]
            
            if invalid_fields:
                raise ValidationAPIError(f"Invalid standard fields: {', '.join(invalid_fields)}")
                
            # Store the mapping (mock database operation)
            self.stored_mappings.append(mappings)
            
            return {
                "status": "success",
                "mapping_saved": True
            }
            
        except Exception as e:
            raise ProcessingAPIError(f"Failed to process mapping: {str(e)}")
    
    def get_stored_mappings(self) -> List[Dict[str, str]]:
        """Get all stored mappings."""
        return self.stored_mappings.copy() 