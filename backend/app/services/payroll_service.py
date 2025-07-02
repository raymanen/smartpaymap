from typing import Any, Dict, List, Optional

import httpx

from ..core.config import STANDARD_FIELDS
from ..core.exceptions import (
    ProcessingAPIError,
    ServiceUnavailableError,
    ValidationAPIError,
)

# Import from utils module
from ..utils.llm_utils import MappingSuggestion, get_mapping_suggestions
from ..models.payroll import PolicyChange
from .policy_service import PolicySimulationService


class PayrollService:
    """Service for handling payroll data analysis and mapping."""

    def __init__(self):
        # In-memory storage for mappings (mock database)
        self.stored_mappings: List[Dict[str, str]] = []
        # Policy simulation service
        self.policy_service = PolicySimulationService()

    async def analyze_payroll_data(
        self, headers: List[str], rows: Optional[List[List[str]]] = None
    ) -> MappingSuggestion:
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
            raise ServiceUnavailableError(
                "Analysis service temporarily unavailable (timeout)"
            )
        except Exception as e:
            raise ProcessingAPIError(f"Analysis service error: {str(e)}")

    def finalize_mappings(self, mappings: Dict[str, str]) -> Dict[str, Any]:
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
                field for field in mappings.values() if field not in STANDARD_FIELDS
            ]

            if invalid_fields:
                raise ValidationAPIError(
                    f"Invalid standard fields: {', '.join(invalid_fields)}"
                )

            # Store the mapping (mock database operation)
            self.stored_mappings.append(mappings)

            return {"status": "success", "mapping_saved": True}

        except Exception as e:
            raise ProcessingAPIError(f"Failed to process mapping: {str(e)}")

    def get_stored_mappings(self) -> List[Dict[str, str]]:
        """Get all stored mappings."""
        return self.stored_mappings.copy()
    
    async def simulate_policy_impact(
        self, 
        headers: List[str], 
        rows: List[List[str]], 
        policy_change: PolicyChange
    ) -> Dict[str, Any]:
        """
        Simulate policy impact using the policy simulation service.
        
        Args:
            headers: CSV column headers
            rows: CSV data rows
            policy_change: Policy change parameters
            
        Returns:
            Dictionary with simulation results
        """
        return await self.policy_service.simulate_policy_impact(
            headers, rows, policy_change
        )
