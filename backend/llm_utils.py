from typing import Dict, List, TypedDict, Optional, Union
import os
import json
import logging
from openai import OpenAI
from openai.types.chat import ChatCompletion
import httpx
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class MappingSuggestion(TypedDict):
    """Type definition for the mapping suggestion response."""
    mappings: Dict[str, Union[str, List[str]]]
    notes: List[str]

def get_mock_response() -> MappingSuggestion:
    """
    Generate a mock response for testing or fallback scenarios.
    
    Returns:
        MappingSuggestion: A predefined mapping suggestion
    """
    return {
        "mappings": {
            "full_name": ["first_name", "last_name"],
            "salary": "basic_salary",
            "currency": "currency_code",
            "city": "location"
        },
        "notes": [
            "Mocked: 'country_code' appears to be missing.",
            "Mocked: Consider merging 'first_name' and 'last_name' into 'full_name'.",
            "Note: This is a fallback response. The actual AI service is unavailable."
        ]
    }

def generate_llm_prompt(data: Dict[str, List[str]]) -> str:
    """
    Generate a prompt for the LLM to map CSV headers to standard fields.

    Args:
        data (Dict[str, List[str]]): Dictionary containing:
            - headers: List of CSV column headers from the uploaded file
            - standard_fields: List of required standard field names to map to

    Returns:
        str: A formatted prompt string for the LLM to process

    Example:
        >>> data = {
        ...     "headers": ["first_name", "last_name", "basic_salary"],
        ...     "standard_fields": ["full_name", "currency", "salary"]
        ... }
        >>> print(generate_llm_prompt(data))
        You are a payroll data analyst...
    """
    headers = data.get("headers", [])
    standard_fields = data.get("standard_fields", [])

    prompt = f"""You are a payroll data analyst. Given the following CSV column headers:
{headers}

Your task is to map them to the following standard fields:
{standard_fields}

Analyze the headers and create intelligent mappings based on these rules:
1. Match fields based on semantic meaning, not just exact matches
2. Combine fields if needed (e.g., first_name + last_name -> full_name)
3. Infer missing fields where possible (e.g., currency from salary column names)
4. Handle variations in naming (e.g., 'basic_salary' maps to 'salary')

Return a JSON object with two keys:
1. "mappings": {{
    "standard_field": "source_field",  // Direct mappings
    "combined_field": ["source_field1", "source_field2"]  // Combined fields
}}
2. "notes": [
    "Detailed explanation of each mapping decision",
    "Warnings about missing required fields",
    "Suggestions for handling ambiguous cases"
]

Focus on accuracy and providing clear explanations in the notes.
"""
    return prompt

def get_mapping_suggestion(prompt: str, mock: bool = False) -> MappingSuggestion:
    """
    Get field mapping suggestions from OpenAI's GPT-3.5 Turbo model.

    Args:
        prompt (str): The formatted prompt string asking for field mappings
        mock (bool): If True, return a mock response without calling the API

    Returns:
        MappingSuggestion: A dictionary containing:
            - mappings: Dictionary of field mappings (source to target)
            - notes: List of explanatory notes and warnings

    Example:
        >>> prompt = generate_llm_prompt({
        ...     "headers": ["first_name", "last_name", "basic_salary"],
        ...     "standard_fields": ["full_name", "salary", "currency"]
        ... })
        >>> result = get_mapping_suggestion(prompt)
        >>> print(result["mappings"])
        {"full_name": ["first_name", "last_name"], "salary": "basic_salary"}
    """
    # Return mock response if requested or if no API key is available
    if mock or not os.getenv('OPENAI_API_KEY'):
        logger.info("Using mock/fallback response for mapping suggestion")
        return get_mock_response()

    try:
        # Initialize OpenAI client
        client = OpenAI()

        # Make API call
        response: ChatCompletion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a payroll data mapping expert. Your task is to analyze CSV headers and map them to standard fields. Provide clear explanations for your mapping decisions."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,  # Low temperature for more consistent results
            max_tokens=1000,
            timeout=30  # 30 second timeout
        )

        # Parse the response
        content = response.choices[0].message.content
        if not content:
            logger.warning("Empty response from OpenAI API")
            return get_mock_response()

        # Try to extract JSON from the response
        try:
            # Find JSON-like structure in the response
            json_str = content.strip()
            if not json_str.startswith('{'):
                # If response contains explanation text before JSON, find the JSON part
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                else:
                    logger.warning("Could not find JSON in API response")
                    return get_mock_response()

            result = json.loads(json_str)

            # Validate response structure
            if not isinstance(result, dict) or \
               'mappings' not in result or \
               'notes' not in result or \
               not isinstance(result['mappings'], dict) or \
               not isinstance(result['notes'], list):
                logger.warning("Invalid response structure from API")
                return get_mock_response()

            return result

        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON from API response")
            return get_mock_response()

    except httpx.TimeoutException:
        logger.warning("OpenAI API request timed out")
        return get_mock_response()
    except Exception as e:
        logger.warning(f"Error calling OpenAI API: {str(e)}")
        return get_mock_response() 