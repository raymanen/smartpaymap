# SmartPayMap

An AI-powered payroll mapping tool that simplifies the process of mapping payroll data between different systems.

## Project Structure

```
/smartpaymap
  /frontend          # React + TypeScript frontend
    /components      # Reusable UI components
    /pages           # Page components
    App.tsx          # Root component
  /backend           # Python + FastAPI backend
    main.py          # FastAPI application
    llm_utils.py     # LLM integration utilities
  /test             # Test files
    test_llm.py     # LLM utilities tests
```

## Setup

### Backend

1. Create a virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. Install dependencies:
```bash
pip install fastapi uvicorn python-dotenv
```

3. Copy `.env.example` to `.env` and configure your environment variables.

4. Run the backend:
```bash
uvicorn backend.main:app --reload
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Development

- Backend API runs on: http://localhost:8000
- Frontend dev server runs on: http://localhost:5173

## Testing

Run tests with pytest:
```bash
pytest
```

## License

MIT
