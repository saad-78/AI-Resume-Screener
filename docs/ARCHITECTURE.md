# System Architecture

## Overview

The Resume Screening Tool is a full-stack RAG (Retrieval-Augmented Generation) application that analyzes resumes against job descriptions using vector embeddings and large language models.

---

## Architecture Diagram

┌─────────────────────────────────────────────────────────────┐
│ USER INTERFACE │
│ (React + Shadcn/UI) │
└──────────────────────┬──────────────────────────────────────┘
│
│ HTTP/REST
│
┌──────────────────────▼──────────────────────────────────────┐
│ EXPRESS.JS API │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Upload │ │ Chat │ │ Analysis │ │
│ │ Routes │ │ Routes │ │ Service │ │
│ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────────┘
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ PDF Parser │ │ RAG Service │ │ Groq API │
│ (pdf-parse) │ │ │ │ (Llama 3.3) │
└─────────┬───────┘ └────────┬────────┘ └─────────────────┘
│ │
│ │
▼ ▼
┌─────────────────────────────────────────┐
│ TEXT CHUNKING │
│ (Semantic Segmentation) │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ CHROMADB CLIENT │
│ (Embedding Generation + Vector Search) │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ CHROMADB VECTOR DATABASE │
│ (Stores Document Embeddings) │
└─────────────────────────────────────────┘

text

---

## RAG Implementation Flow

### 1. Document Upload & Processing

User uploads Resume.pdf + JobDescription.pdf
↓
Backend receives files via Multer
↓
Extract text using pdf-parse
↓
Split text into semantic chunks (500 tokens, 50 overlap)
↓
Generate embeddings via ChromaDB Default Embeddings
↓
Store chunks + embeddings in ChromaDB collections
↓
Analyze match using Groq LLM
↓
Return analysis to frontend

text

### 2. Match Analysis

Extract requirements from Job Description (Groq)
↓
Extract qualifications from Resume (Groq)
↓
Compare skills, experience, education
↓
Calculate weighted match score
↓
Generate strengths, gaps, assessment
↓
Return JSON response

text

### 3. RAG-Powered Chat

User asks question: "Does candidate have React experience?"
↓
Generate question embedding (ChromaDB)
↓
Vector search in resume_chunks collection (top 3 results)
↓
Retrieve relevant text chunks
↓
Build context from chunks
↓
Send to Groq: [Context + Question + History]
↓
Receive answer from LLM
↓
Return answer with sources



---

## Data Flow

### Upload Endpoint (`POST /api/upload`)

1. **Input**: Multipart form with 2 files
2. **Processing**:
   - Parse PDFs → Extract text
   - Chunk text → 500 token chunks
   - Generate embeddings → 384-dim vectors
   - Store in ChromaDB → 2 collections
   - Analyze match → Groq API call
3. **Output**: `{ resumeId, analysis }`

### Chat Endpoint (`POST /api/chat`)

1. **Input**: `{ resumeId, question, history }`
2. **Processing**:
   - Embed question → Vector
   - Search ChromaDB → Retrieve chunks
   - Build prompt → Context + Question
   - Call Groq → Get answer
3. **Output**: `{ answer, sources, timestamp }`

---

## Component Architecture

### Backend Services

#### PDF Service
- Extracts text from PDF/TXT files
- Normalizes whitespace
- Returns plain text

#### Vector Service
- Stores document chunks in ChromaDB
- Performs vector similarity search
- Deletes documents by ID

#### RAG Service
- Orchestrates retrieval + generation
- Builds prompts with context
- Manages conversation history

#### Analysis Service
- Extracts structured data from documents
- Calculates match percentage
- Generates strengths/gaps

### Frontend Components

#### FileUploader
- Drag-and-drop interface
- File validation (type, size)
- Visual feedback

#### MatchAnalysis
- Circular progress chart
- Strengths/gaps cards
- Overall assessment

#### ChatInterface
- Message history
- User/AI bubbles
- Typing indicator
- Input with send button

---

## Database Schema

### ChromaDB Collections

#### `resume_chunks`
{
id: string, // UUID
document: string, // Text chunk
embedding: number[], // 384-dim vector
metadata: {
documentId: string, // Resume UUID
documentType: 'resume',
section: string, // 'experience' | 'education' | 'skills'
wordCount: number,
position: number
}
}



#### `job_description_chunks`
{
id: string,
document: string,
embedding: number[],
metadata: {
documentId: string,
documentType: 'job_description',
section: string,
wordCount: number,
position: number
}
}



---

## Tech Stack Decisions

### Why ChromaDB?
- **Self-hosted**: No cloud costs
- **Built-in embeddings**: No separate API needed
- **Fast**: Rust-based, optimized for similarity search
- **Simple**: Easy setup, minimal configuration

### Why Groq?
- **Speed**: 500+ tokens/sec (10x faster than GPT-4)
- **Free tier**: 30 req/min (sufficient for demo)
- **Quality**: Llama 3.3 70B matches GPT-4 performance
- **OpenAI-compatible**: Easy migration

### Why Shadcn/UI?
- **No dependencies**: Copy-paste components
- **Customizable**: Full control over styling
- **Accessible**: ARIA-compliant
- **Modern**: Radix UI primitives

---

## Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| PDF parsing (2 pages) | 50ms | pdf-parse |
| Text chunking | 10ms | Semantic split |
| Embedding generation | 20ms/chunk | ChromaDB |
| Vector search | 5ms | Top 3 results |
| Groq LLM response | 1-2s | 500+ tokens/sec |
| Total upload flow | 3-5s | End to end |
| Chat response | 1-2s | Including retrieval |

---

## Security Considerations

- **File validation**: Size limits, MIME type checks
- **Sanitization**: Text cleaning, XSS prevention
- **Rate limiting**: Prevent API abuse (future)
- **Environment variables**: Secrets in .env
- **CORS**: Restricted to frontend origin

---

## Scalability

### Current Limits
- **Concurrent uploads**: ~10/sec
- **Vector storage**: Millions of chunks
- **Chat requests**: 30/min (Groq free tier)

### Future Improvements
- Add Redis for caching
- Implement request queuing
- Scale ChromaDB horizontally
- Add CDN for frontend
- Implement user authentication

---

## Error Handling

- **File parsing errors**: Graceful fallback
- **API failures**: Retry logic with exponential backoff
- **Vector search misses**: Default responses
- **LLM timeouts**: User-friendly messages

---

## Monitoring

- Console logging for all operations
- Error tracking (timestamps, stack traces)
- Performance metrics (future: Prometheus