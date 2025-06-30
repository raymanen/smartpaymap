# Note For Recruiter — Why I Built This Project
I built this project entirely from scratch for one reason:
To apply for the Product Engineering Internship at Global Expat Pay.

When I read the job description, it immediately stood out as the kind of team I've always wanted to be part of where meaningful problems are solved with real code, and where AI is applied not as a trend, but as a practical tool to improve people’s lives and workflows.

I didn’t just want to apply with a CV.
I wanted to show what I could do, and prove that I'm already thinking like a product-minded engineer.

I’m deeply excited by the possibility of joining your team, not just for the internship, but for the long term.
I’m here to learn fast, contribute with care, and grow alongside the mission of Global Expat Pay.

The project below, SmartPayMap, is my way of saying:
"I’m serious about this opportunity, and I’m ready to earn it."



# SmartPayMap

**AI-Powered Payroll Data Mapping Tool**

Transform your CSV payroll data with intelligent field detection and automated mapping suggestions powered by advanced AI.

## ✨ Features

- **🤖 Smart Detection** - AI automatically identifies and maps CSV columns
- **✅ Validation & Feedback** - Instant feedback with clear warnings and suggestions  
- **🔗 Easy Integration** - Simple API integration with existing payroll systems
- **📊 Interactive UI** - Modern React interface for seamless data mapping
- **🎯 High Accuracy** - Powered by GPT and DeepSeek AI models

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Material-UI (MUI)
- Vite for fast development

**Backend**  
- FastAPI (Python)
- AI Integration (HuggingFace + OpenAI)
- Pydantic for data validation

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd smartpaymap
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration
```bash
# Create .env file in backend directory
cp .env.example .env

# Add your API keys
HF_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start Development
```bash
# From project root
npm run start    # Starts both frontend and backend
# OR start individually:
npm run backend  # Start backend only
npm run frontend # Start frontend only
```

## 📖 Usage

1. **Upload CSV** - Upload your payroll CSV file
2. **Review Mappings** - AI suggests field mappings automatically
3. **Validate & Adjust** - Review and modify mappings as needed
4. **Export Results** - Get standardized payroll data

## 🌐 API Endpoints

- `GET /health` - Health check
- `POST /analyze` - Analyze CSV headers and get mapping suggestions
- `POST /upload` - Upload and preview CSV data  
- `POST /finalize` - Finalize field mappings

**API Documentation**: http://localhost:8000/docs

## 🧪 Testing

```bash
# Run backend tests
source backend/venv/bin/activate
python -m pytest test/ -v

# Run frontend tests  
cd frontend
npm test
```

## 📁 Project Structure

```
smartpaymap/
├── backend/                 # FastAPI backend
│   ├── app/                # Modular application code
│   │   ├── api/           # API routes
│   │   ├── core/          # Configuration & exceptions
│   │   ├── models/        # Pydantic models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities & AI integration
│   ├── main.py            # Application entry point
│   └── requirements.txt   # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── theme/         # MUI theme configuration
│   └── package.json       # Node.js dependencies
├── test/                   # Test suite
└── data/                   # Sample data files
```

## 🔧 Development Scripts

```bash
npm run dev          # Start frontend dev server
npm run build        # Build frontend for production
npm run backend      # Start backend server
npm run install-deps # Install all dependencies
npm run clean        # Clean build artifacts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [API Docs](http://localhost:8000/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/smartpaymap/issues)

---

**Made with ❤️ by RAYMAN**

*Simplifying payroll data management with AI*
