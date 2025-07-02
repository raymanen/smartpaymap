import json
import logging
import os
from typing import Any, Dict, List, TypedDict, Union

import httpx
from dotenv import load_dotenv
from openai import OpenAI
from openai.types.chat import ChatCompletion

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(verbose=True)

# Validate environment variables
hf_api_key = os.getenv("HF_API_KEY")
if not hf_api_key:
    logger.warning("HF_API_KEY not found in environment variables")

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables")

# Constants
HUGGING_FACE_API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"


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
            "city": "location",
        },
        "notes": [
            "Mocked: 'country_code' appears to be missing.",
            "Mocked: Consider merging 'first_name' and 'last_name' into 'full_name'.",
            "Note: This is a fallback response. The actual AI service is unavailable.",
        ],
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


def get_mapping_suggestions(
    csv_headers: List[str], target_fields: List[str]
) -> MappingSuggestion:
    """
    Get mapping suggestions for CSV headers to target fields using Hugging Face API.
    Falls back to OpenAI if Hugging Face fails.
    """
    # Construct the prompt
    prompt = f"""You are a payroll data analyst. Given the following CSV column headers:
{json.dumps(csv_headers)}

Your task is to map them to the following standard fields:
{json.dumps(target_fields)}

Mapping rules:
1. Map each source field to the most appropriate target field
2. For salary-related fields:
   - 'base_salary' for basic/base salary
   - 'bonus' for bonus amounts
   - 'total_salary' when combining multiple salary components
3. For name fields:
   - 'full_name' for complete names or when combining first/last names
4. For dates:
   - 'hire_date' for employment/hire dates
5. Use 'other' for fields that don't match any standard category

Return a simple JSON object with:
1. "mappings": A dictionary where keys are source fields and values are target fields they map to
2. "notes": A list of strings with any important notes about the mappings

Example response format:
{{
  "mappings": {{
    "first_name": "full_name",
    "last_name": "full_name",
    "base_pay": "base_salary",
    "annual_bonus": "bonus",
    "start_date": "hire_date",
    "misc_field": "other"
  }},
  "notes": [
    "full_name will be created by combining first_name and last_name",
    "total_salary can be calculated from base_pay and annual_bonus"
  ]
}}

Keep the response format simple and avoid nested structures."""

    try:
        # Try Hugging Face API first
        if hf_api_key:
            logger.info("Attempting to use Hugging Face API...")
            headers = {
                "Authorization": f"Bearer {hf_api_key}",
                "Content-Type": "application/json",
            }

            with httpx.Client() as client:
                logger.info(f"Making request to {HUGGING_FACE_API_URL}")

                # Convert the prompt to chat format
                chat_payload = {
                    "model": "deepseek/deepseek-v3-0324",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 500,
                }

                logger.info(
                    f"Request payload: {json.dumps(chat_payload, indent=2)}"
                )
                hf_response = client.post(
                    HUGGING_FACE_API_URL,
                    json=chat_payload,
                    headers=headers,
                    timeout=30.0,
                )
                logger.info(f"Response status code: {hf_response.status_code}")
                logger.info(f"Response headers: {dict(hf_response.headers)}")
                hf_response.raise_for_status()

                # Parse the response
                raw_response = hf_response.json()
                logger.info(f"Raw response: {json.dumps(raw_response, indent=2)}")

                # Extract content from chat completion response
                if isinstance(raw_response, dict) and "choices" in raw_response:
                    content = raw_response["choices"][0]["message"]["content"]

                    # Try to extract JSON from the response
                    try:
                        # Find JSON-like structure in the response
                        json_str = content.strip()
                        if json_str.startswith("```json"):
                            # Extract JSON from code block
                            json_start = json_str.find("{")
                            json_end = json_str.rfind("}") + 1
                            if json_start >= 0 and json_end > json_start:
                                json_str = json_str[json_start:json_end]
                        elif not json_str.startswith("{"):
                            # If response contains explanation text before JSON,
            # find the JSON part
                            json_start = content.find("{")
                            json_end = content.rfind("}") + 1
                            if json_start >= 0 and json_end > json_start:
                                json_str = content[json_start:json_end]

                        result = json.loads(json_str)

                        # Simplify the response format
                        simplified_mappings = {}
                        simplified_notes = []

                        # Extract simple mappings from the complex response
                        if isinstance(result.get("mappings"), dict):
                            for source, mapping in result["mappings"].items():
                                if (
                                    isinstance(mapping, dict)
                                    and "source_field" in mapping
                                ):
                                    simplified_mappings[source] = mapping[
                                        "source_field"
                                    ]
                                elif (
                                    isinstance(mapping, dict)
                                    and "source_fields" in mapping
                                ):
                                    # For fields that need to be combined
                                    simplified_mappings[source] = mapping[
                                        "source_fields"
                                    ][0]
                                    simplified_notes.append(
                                        f"Note: {source} requires combining fields: "
                                        f"{', '.join(mapping['source_fields'])}"
                                    )
                                elif isinstance(mapping, str):
                                    simplified_mappings[source] = mapping

                        # Extract notes
                        if isinstance(result.get("notes"), list):
                            simplified_notes.extend(result["notes"])
                        elif isinstance(result.get("notes"), dict):
                            for key, note in result["notes"].items():
                                simplified_notes.append(f"{key}: {note}")

                        # Return simplified format
                        return {
                            "mappings": simplified_mappings,
                            "notes": simplified_notes,
                        }

                        # If we couldn't find valid JSON, create a response with the raw text
                        logger.warning(
                            "Could not find valid JSON in response, "
                            "using raw text"
                        )
                        return {
                            "mappings": {},  # Empty mappings as placeholder
                            "notes": [content],  # Store the raw response as a note
                        }

                    except (json.JSONDecodeError, KeyError) as e:
                        logger.warning(
                            f"Failed to parse Hugging Face response: {str(e)}"
                        )
                        # Continue to OpenAI fallback

    except Exception as e:
        logger.error(f"Error with Hugging Face API: {str(e)}")
        # Continue to OpenAI fallback

    # Fallback to OpenAI
    if openai_api_key:
        logger.info("Falling back to OpenAI API...")
        try:
            client = OpenAI(api_key=openai_api_key)
            response: ChatCompletion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500,
            )
            content = response.choices[0].message.content
            try:
                result = json.loads(content or "{}")
                if (
                    isinstance(result, dict)
                    and "mappings" in result
                    and "notes" in result
                    and isinstance(result["mappings"], dict)
                    and isinstance(result["notes"], list)
                ):
                    logger.info(
                        "Successfully got response from OpenAI API"
                    )
                    return result  # type: ignore
            except (json.JSONDecodeError, KeyError) as e:
                logger.error(f"Failed to parse OpenAI response: {str(e)}")
                return {"mappings": {}, "notes": [content or "No response content"]}
        except Exception as e:
            logger.error(f"Error with OpenAI API: {str(e)}")

    # If both APIs fail, return empty result
    logger.error("Both Hugging Face and OpenAI APIs failed")
    return {
        "mappings": {},
        "notes": ["Failed to get mapping suggestions from both APIs"],
    }
