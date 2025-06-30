import os
import json
import httpx
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(verbose=True)

# Get API key
hf_api_key = os.getenv('HF_API_KEY')
if not hf_api_key:
    logger.error("HF_API_KEY not found in environment variables")
    exit(1)

# API endpoint
url = "https://router.huggingface.co/novita/v3/openai/chat/completions"

# Headers
headers = {
    "Authorization": f"Bearer {hf_api_key}",
    "Content-Type": "application/json"
}

# Test data
test_prompt = """You are a payroll data analyst. Given the following CSV column headers:
["employee_name", "base_salary", "usd", "new_york"]

Your task is to map them to the following standard fields:
["full_name", "salary", "currency", "city"]

Return a JSON object with mappings and notes."""

# Request payload
payload = {
    "model": "deepseek/deepseek-v3-0324",
    "messages": [
        {
            "role": "user",
            "content": test_prompt
        }
    ],
    "temperature": 0.3,
    "max_tokens": 500
}

try:
    # Make the request
    with httpx.Client() as client:
        logger.info("Making request to Novita API...")
        logger.info(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = client.post(url, json=payload, headers=headers, timeout=30.0)
        
        logger.info(f"Response status code: {response.status_code}")
        logger.info(f"Response headers: {json.dumps(dict(response.headers), indent=2)}")
        
        response.raise_for_status()
        raw_response = response.json()
        logger.info(f"Raw response: {json.dumps(raw_response, indent=2)}")

except Exception as e:
    logger.error(f"Error: {str(e)}")
    if isinstance(e, httpx.HTTPError):
        logger.error(f"Response text: {e.response.text if hasattr(e, 'response') else 'No response text'}") 