import json
import logging
from llm_utils import get_mapping_suggestions

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test data
csv_headers = ["employee_name", "base_salary", "usd", "new_york"]
target_fields = ["full_name", "salary", "currency", "city"]

try:
    # Get mapping suggestions
    result = get_mapping_suggestions(csv_headers, target_fields)
    
    # Print the result
    logger.info("Mapping suggestions:")
    logger.info(json.dumps(result, indent=2))
    
    # Validate the result structure
    assert isinstance(result, dict), "Result should be a dictionary"
    assert "mappings" in result, "Result should have 'mappings' key"
    assert "notes" in result, "Result should have 'notes' key"
    assert isinstance(result["mappings"], dict), "Mappings should be a dictionary"
    assert isinstance(result["notes"], list), "Notes should be a list"
    
    logger.info("Test passed successfully!")

except Exception as e:
    logger.error(f"Test failed: {str(e)}")
    raise 