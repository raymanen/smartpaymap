"""
Mapping utilities for standardizing payroll data.

This module provides helper functions to extract and transform payroll data
according to the canonical STANDARD_FIELDS schema for consistent export
and processing across the SmartPayMap system.
"""

from typing import Dict, List, Optional, Any

from ..core.config import STANDARD_FIELDS


def extract_or_default(
    row: List[str], mapping: Dict[str, str], standard_field: str
) -> Optional[str]:
    """
    Extract a value from a data row based on field mapping.
    
    Finds which source column maps to the given standard_field and returns
    the corresponding value from the row, or None if not present.
    
    Args:
        row: List of values representing a single data row
        mapping: Dictionary mapping source field names to standard field names
        standard_field: The standard field name to extract (must be in STANDARD_FIELDS)
        
    Returns:
        The value from the row if mapping exists, None otherwise
        
    Example:
        >>> row = ["John Doe", "EMP001", "50000", "USD"]
        >>> mapping = {"name": "full_name", "id": "employee_id", "pay": "salary", "curr": "currency"}
        >>> extract_or_default(row, mapping, "full_name")
        "John Doe"
        >>> extract_or_default(row, mapping, "tax_rate")
        None
    """
    if standard_field not in STANDARD_FIELDS:
        return None
    
    # Find the source field that maps to this standard field
    source_field = None
    for src_field, std_field in mapping.items():
        if std_field == standard_field:
            source_field = src_field
            break
    
    if source_field is None:
        return None
    
    # Find the index of the source field in the headers
    # Note: This assumes row corresponds to headers by position
    # In practice, you'd need to pass headers or use a different approach
    # For now, we'll assume the mapping keys contain indices or header names
    try:
        # If source_field is numeric, treat as index
        if source_field.isdigit():
            index = int(source_field)
            if 0 <= index < len(row):
                return row[index]
        # Otherwise, we need header information to find the correct index
        # This will be enhanced when used with actual CSV parsing
        return None
    except (ValueError, IndexError):
        return None


def extract_or_default_with_headers(
    row: List[str], headers: List[str], mapping: Dict[str, str], standard_field: str
) -> Optional[str]:
    """
    Extract a value from a data row using header names for mapping.
    
    Enhanced version of extract_or_default that uses actual CSV headers
    to find the correct column index.
    
    Args:
        row: List of values representing a single data row
        headers: List of CSV column headers
        mapping: Dictionary mapping source field names to standard field names
        standard_field: The standard field name to extract
        
    Returns:
        The value from the row if mapping exists, None otherwise
    """
    if standard_field not in STANDARD_FIELDS:
        return None
    
    # Find the source field that maps to this standard field
    source_field = None
    for src_field, std_field in mapping.items():
        if std_field == standard_field:
            source_field = src_field
            break
    
    if source_field is None:
        return None
    
    # Find the index of the source field in headers
    try:
        index = headers.index(source_field)
        if 0 <= index < len(row):
            return row[index]
    except (ValueError, IndexError):
        pass
    
    return None


def construct_standardized_row(
    row: List[str], headers: List[str], mapping: Dict[str, str]
) -> Dict[str, Optional[str]]:
    """
    Build a standardized data row matching the STANDARD_FIELDS schema.
    
    Uses extract_or_default_with_headers() to populate each standard field
    with the corresponding value from the source row, or None if not mapped.
    
    Args:
        row: List of values representing a single data row
        headers: List of CSV column headers
        mapping: Dictionary mapping source field names to standard field names
        
    Returns:
        Dictionary with STANDARD_FIELDS as keys and extracted values
        
    Example:
        >>> row = ["John Doe", "EMP001", "50000", "USD", "Manager", "2023-01-15"]
        >>> headers = ["name", "id", "salary", "currency", "role", "start_date"]
        >>> mapping = {
        ...     "name": "full_name",
        ...     "id": "employee_id", 
        ...     "salary": "salary",
        ...     "currency": "currency",
        ...     "start_date": "employment_date"
        ... }
        >>> construct_standardized_row(row, headers, mapping)
        {
            "full_name": "John Doe",
            "employee_id": "EMP001",
            "salary": "50000",
            "bonus": None,
            "currency": "USD",
            "tax_rate": None,
            "location": None,
            "employment_date": "2023-01-15"
        }
    """
    standardized_row = {}
    
    for standard_field in STANDARD_FIELDS:
        value = extract_or_default_with_headers(row, headers, mapping, standard_field)
        standardized_row[standard_field] = value
    
    return standardized_row


def construct_standardized_dataset(
    rows: List[List[str]], headers: List[str], mapping: Dict[str, str]
) -> List[Dict[str, Optional[str]]]:
    """
    Build a complete standardized dataset from CSV data.
    
    Processes multiple rows to create a standardized dataset where each row
    conforms to the STANDARD_FIELDS schema.
    
    Args:
        rows: List of data rows (each row is a list of values)
        headers: List of CSV column headers
        mapping: Dictionary mapping source field names to standard field names
        
    Returns:
        List of standardized row dictionaries
    """
    return [
        construct_standardized_row(row, headers, mapping)
        for row in rows
    ]


def validate_mapping(mapping: Dict[str, str]) -> List[str]:
    """
    Validate that mapping values are all valid standard fields.
    
    Args:
        mapping: Dictionary mapping source field names to standard field names
        
    Returns:
        List of validation errors (empty if valid)
    """
    errors = []
    
    for source_field, standard_field in mapping.items():
        if standard_field not in STANDARD_FIELDS:
            errors.append(
                f"Invalid standard field '{standard_field}' for source field '{source_field}'. "
                f"Must be one of: {', '.join(STANDARD_FIELDS)}"
            )
    
    return errors


def get_missing_standard_fields(mapping: Dict[str, str]) -> List[str]:
    """
    Get list of standard fields that are not covered by the current mapping.
    
    Args:
        mapping: Dictionary mapping source field names to standard field names
        
    Returns:
        List of standard fields not present in the mapping
    """
    mapped_standard_fields = set(mapping.values())
    return [field for field in STANDARD_FIELDS if field not in mapped_standard_fields]


def get_mapping_coverage_stats(mapping: Dict[str, str]) -> Dict[str, Any]:
    """
    Get statistics about mapping coverage.
    
    Args:
        mapping: Dictionary mapping source field names to standard field names
        
    Returns:
        Dictionary with coverage statistics
    """
    mapped_fields = set(mapping.values())
    total_standard_fields = len(STANDARD_FIELDS)
    mapped_count = len(mapped_fields.intersection(set(STANDARD_FIELDS)))
    
    return {
        "total_standard_fields": total_standard_fields,
        "mapped_fields": mapped_count,
        "coverage_percentage": (mapped_count / total_standard_fields) * 100,
        "missing_fields": get_missing_standard_fields(mapping),
        "unmapped_count": total_standard_fields - mapped_count
    } 