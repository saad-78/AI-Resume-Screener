import { create } from 'zustand';
import { MatchAnalysis, ChatMessage } from '../types';

interface AppState {
  // Files
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  setResumeFile: (file: File | null) => void;
  setJobDescriptionFile: (file: File | null) => void;
  
  // Analysis
  analysis: MatchAnalysis | null;
  resumeId: string | null;
  setAnalysis: (analysis: MatchAnalysis, resumeId: string) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  resumeFile: null,
  jobDescriptionFile: null,
  setResumeFile: (file) => set({ resumeFile: file }),
  setJobDescriptionFile: (file) => set({ jobDescriptionFile: file }),
  
  analysis: null,
  resumeId: null,
  setAnalysis: (analysis, resumeId) => set({ analysis, resumeId }),
  
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  reset: () => set({
    resumeFile: null,
    jobDescriptionFile: null,
    analysis: null,
    resumeId: null,
    messages: [],
    isLoading: false,
  }),
}));
