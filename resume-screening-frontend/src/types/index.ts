export interface MatchAnalysis {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  overallAssessment: string;
}

export interface UploadResponse {
  resumeId: string;
  jobDescriptionId: string;
  analysis: MatchAnalysis;
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
