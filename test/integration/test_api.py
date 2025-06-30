import os
import httpx
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv(verbose=True)

# Get API key
hf_api_key = os.getenv('HF_API_KEY')
if not hf_api_key:
    print("Error: HF_API_KEY not found in environment variables")
    exit(1)

# Test data
test_prompt = """You are a payroll data analyst. Given the following CSV column headers:
["employee_name", "base_salary", "usd", "new_york"]

Your task is to map them to the following standard fields:
["full_name", "salary", "currency", "city"]

Return a JSON object with mappings and notes."""

# API endpoint
url = "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-v3-0324"

# Headers
headers = {
    "Authorization": f"Bearer {hf_api_key}",
    "Content-Type": "application/json"
}

# Request payload
payload = {
    "inputs": test_prompt,
    "parameters": {
        "temperature": 0.3,
        "max_new_tokens": 500
    }
}

try:
    # Make the request
    with httpx.Client() as client:
        print("Making request to Hugging Face API...")
        response = client.post(url, json=payload, headers=headers, timeout=30.0)
        response.raise_for_status()
        
        print("\nResponse status code:", response.status_code)
        print("\nResponse headers:", json.dumps(dict(response.headers), indent=2))
        print("\nResponse body:", json.dumps(response.json(), indent=2))

except Exception as e:
    print(f"\nError: {str(e)}")
    if isinstance(e, httpx.HTTPError):
        print(f"Response text: {e.response.text if hasattr(e, 'response') else 'No response text'}") 