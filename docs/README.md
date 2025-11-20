# AI-Powered Resume Screening Tool

An intelligent resume screening application that uses RAG (Retrieval-Augmented Generation) to analyze candidate resumes against job descriptions and provide interactive Q&A capabilities.

![Tech Stack](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

- **AI-Powered Match Analysis**: Generate match scores with detailed strengths and gaps
- **RAG-Based Q&A**: Ask natural language questions about candidates
- **PDF/TXT Support**: Upload resumes and job descriptions in multiple formats
- **Real-Time Chat**: Con-aware conversation with conversation history
- **Premium UI**: Modern black/white theme with neumorphic design
- **100% Free Stack**: Zero API costs for embeddings and vector storage

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **LLM**: Groq API (Llama 3.3 70B)
- **Embeddings**: ChromaDB Default Embeddings
- **Vector Database**: ChromaDB
- **PDF Parser**: pdf-parse
- **File Upload**: Multer

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/UI + Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **File Upload**: react-dropzone
- **Charts**: Recharts

---

## 📋 Prerequisites

- Node.js 18 or higher
- Docker (for ChromaDB) or Python 3.8+
- Groq API Key ([Get it here](https://console.groq.com/keys))

---

## 🛠️ Installation

### 1. Clone Repository

git clone <your-repo-url>
cd resume-screening-tool



### 2. Backend Setup

cd resume-screening-backend

Install dependencies
npm install

Create environment file
cp .env.example .env

Add your Groq API key to .env
GROQ_API_KEY=your_key_here


### 3. Start ChromaDB

**Option A: Docker (Recommended)**
docker run -d -p 8000:8000 --name chromadb chromadb/chroma



**Option B: Python**
pip install chromadb
chroma run --path ./chroma_data --port 8000



### 4. Start Backend

npm run dev



Backend will run on `http://localhost:5000`

### 5. Frontend Setup

cd ../resume-screening-frontend

Install dependencies
npm install

Create environment file
cp .env.example .env

Start dev server
npm run dev



Frontend will run on `http://localhost:5173`

---

## 🎯 Usage

1. **Upload Files**
   - Navigate to `http://localhost:5173`
   - Upload a resume (PDF or TXT)
   - Upload a job description (PDF or TXT)
   - Click "Analyze Match"

2. **View Analysis**
   - See match score percentage
   - Review strengths and gaps
   - Read overall assessment

3. **Ask Questions**
   - Use the chat interface
   - Ask questions like:
     - "Does this candidate have a degree from a state university?"
     - "What is their experience with React?"
     - "Can they lead a backend team?"

---

## 📁 Project Structure

resume-screening-tool/
├── backend/
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── services/ # Business logic
│ │ ├── routes/ # API endpoints
│ │ ├── types/ # TypeScript types
│ │ └── server.ts # Entry point
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── hooks/ # Custom hooks
│ │ ├── store/ # State management
│ │ ├── lib/ # Utilities
│ │ └── types/ # TypeScript types
│ └── package.json
│
├── samples/ # Sample files for testing
├── docs/
│ ├── ARCHITECTURE.md
│ └── DEMO.md
└── README.md



---

## 🔑 Environment Variables

### Backend (.env)
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
CHROMA_HOST=http://localhost:8000
MAX_FILE_SIZE=5242880
ALLOWED_MIMES=application/pdf,/plain



### Frontend (.env)
VITE_API_URL=http://localhost:5000/api



---

## 🧪 API Endpoints

### POST /api/upload
Upload resume and job description for analysis.

**Request:**
curl -X POST http://localhost:5000/api/upload
-F "resume=@resume.pdf"
-F "jobDescription=@job-description.pdf"



**Response:**
{
"resumeId": "uuid",
"jobDescriptionId": "uuid",
"analysis": {
"matchScore": 75,
"strengths": ["..."],
"gaps": ["..."],
"overallAssessment": "..."
}
}



### POST /api/chat
Ask questions about the resume.

**Request:**
{
"resumeId": "uuid",
"question": "Does this candidate have React experience?",
"conversationHistory": []
}



**Response:**
{
"answer": "Yes, the candidate has 5 years of React experience...",
"sources": ["experience"],
"timestamp": "2025-11-20T12:00:00.000Z"
}



---

## 🚢 Deployment

### Frontend (Vercel)
cd frontend
vercel deploy --prod



### Backend (Railway)
1. Connect GitHub repository
2. Add environment variables
3. Deploy from main branch

---

## 🎥 Demo Video

[Link to demo video]

---

## 👥 Contributors

- Saad Momin

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Groq for blazing-fast LLM inference
- ChromaDB for vector storage
- Shadcn/UI for beautiful components