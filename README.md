# PharmaMind AI - Eli Lilly Demonstration Platform

A comprehensive pharmaceutical manufacturing intelligence platform built for Eli Lilly, featuring real-time monitoring, quality control, and AI-powered vision inspection.

## 🏥 Project Overview

PharmaMind AI is a demonstration platform showcasing advanced pharmaceutical manufacturing capabilities including:

- **ManuWatch**: Real-time manufacturing monitoring and analytics
- **VisionQC**: AI-powered computer vision quality inspection
- **Bilingual Support**: English and French interface
- **Professional Dashboard**: Modern, responsive UI with pharmaceutical industry styling

## 🚀 Features

### ManuWatch (Manufacturing Intelligence)
- **Real-time Monitoring**: Live production line metrics and KPIs
- **OEE Tracking**: Overall Equipment Effectiveness monitoring
- **Production Analytics**: Advanced analytics and insights
- **Predictive Maintenance**: Equipment health monitoring and alerts
- **Quality Control**: Comprehensive quality metrics and testing

### VisionQC (Computer Vision Quality Control)
- **Image Upload Analysis**: Upload pharmaceutical product images for quality inspection
- **AI-Powered Detection**: Advanced object detection and defect classification
- **Quality Assessment**: Dimensional analysis, surface defects, structural integrity
- **Confidence Scoring**: ML-powered quality classification with confidence scores
- **Bounding Box Visualization**: Real-time detection visualization

### Platform Features
- **Bilingual Interface**: Full English and French language support
- **Responsive Design**: Modern, professional pharmaceutical industry styling
- **Real-time Data**: Live time-series data simulation
- **4 Virtual Production Lines**: Comprehensive multi-line monitoring
- **Professional UI/UX**: Clean, intuitive interface optimized for manufacturing environments

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pandas & NumPy**: Data processing and analytics
- **Google Gemini AI**: Advanced computer vision analysis
- **Uvicorn**: ASGI server for production deployment

### Frontend
- **React 18**: Modern JavaScript framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing

### Data & Analytics
- **Real-time Simulation**: Live time-series data generation
- **Pharmaceutical Data**: Industry-standard manufacturing metrics
- **Quality Metrics**: Comprehensive quality control parameters
- **Predictive Analytics**: Equipment health and maintenance insights

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Navigate to project directory
cd pharmamind-ai

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start the backend server
uvicorn pharma_api:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables
Create a `.env` file based on `env.example`:

```env
# Google Gemini API Key (optional - for VisionQC AI analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend Configuration
FRONTEND_PORT=3001
```

## 🎯 Usage

### Starting the Application
1. **Backend**: Start the FastAPI server on port 8000
2. **Frontend**: Start the React development server on port 3001
3. **Access**: Open `http://localhost:3001` in your browser

### Navigation
- **About**: Project overview and developer information
- **ManuWatch**: Manufacturing intelligence dashboard
  - Real-time Monitoring
  - OEE Tracking
  - Production Analytics
  - Predictive Maintenance
  - Quality Control
- **VisionQC**: Computer vision quality inspection
  - Upload pharmaceutical product images
  - AI-powered quality analysis
  - Defect detection and classification

### Language Support
- Toggle between English and French using the language switcher in the header
- All interface elements and data are fully translated

## 📊 Data Sources

The platform uses simulated pharmaceutical manufacturing data including:
- **Process Parameters**: Tablet compression, speed, force metrics
- **Quality Metrics**: Drug release, impurities, dissolution rates
- **Equipment Health**: Maintenance alerts and equipment status
- **Production Analytics**: OEE, efficiency, and performance metrics

## 🔧 Development

### Project Structure
```
pharmamind-ai/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts (language, etc.)
│   └── services/          # API services
├── public/                # Static assets
├── data/                  # Data files
├── pharma_api.py          # FastAPI backend
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
└── README.md             # This file
```

### Key Components
- **Dashboard**: Real-time manufacturing monitoring
- **VisionQC**: Computer vision quality inspection
- **LanguageContext**: Bilingual support implementation
- **Sidebar**: Navigation and project structure
- **About**: Professional project showcase

## 🚀 Deployment

### Production Deployment
```bash
# Build the frontend
npm run build

# Start production backend
uvicorn pharma_api:app --host 0.0.0.0 --port 8000

# Serve static files from build directory
```

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "pharma_api:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📈 Performance

- **Real-time Updates**: 10-second refresh intervals
- **Sub-second Processing**: Optimized for live demonstrations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Scalable Architecture**: Ready for enterprise deployment

## 🔒 Security

- **API Key Management**: Environment variable configuration
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management

## 📝 License

This project is built for demonstration purposes for Eli Lilly.

## 👨‍💻 Developer

**Karunasagar Mohansundar**
- Senior AI/ML Engineer with pharmaceutical industry expertise
- Specialized in computer vision, healthcare analytics, and big data
- Global experience across multiple healthcare and technology companies

## 🤝 Contributing

This is a demonstration project built specifically for Eli Lilly. For questions or collaboration opportunities, please contact the developer directly.

## 📞 Support

For technical support or questions about the PharmaMind AI platform:
- Review the documentation in the `/docs` directory
- Check the project milestones in `MILESTONE_PLAN.md`
- Contact the developer for enterprise deployment inquiries

---

**Built for demonstration purposes for Eli Lilly**  
**PharmaMind AI v2.2.4**  
**© 2025 Karunasagar Mohansundar**


