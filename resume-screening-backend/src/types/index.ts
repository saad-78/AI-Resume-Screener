export interface Resume {
  id: string;
  fileName: string;
  text: string;
  uploadedAt: Date;
}

export interface JobDescription {
  id: string;
  fileName: string;
  text: string;
  uploadedAt: Date;
}

export interface Chunk {
  id: string;
  text: string;
  documentId: string;
  documentType: 'resume' | 'job_description';
  section: string;
  metadata: Record<string, any>;
}

export interface MatchAnalysis {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  overallAssessment: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  resumeId: string;
  question: string;
  conversationHistory: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  timestamp: Date;
}

export interface UploadResponse {
  resumeId: string;
  jobDescriptionId: string;
  analysis: MatchAnalysis;
}
