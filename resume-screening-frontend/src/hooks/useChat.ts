import { useState } from 'react';
import api from '@/lib/api';
import { ChatRequest, ChatResponse, ChatMessage } from '@/types';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    resumeId: string,
    question: string,
    conversationHistory: ChatMessage[]
  ): Promise<ChatResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: ChatRequest = {
        resumeId,
        question,
        conversationHistory,
      };

      const response = await api.post<ChatResponse>('/chat', payload);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Chat failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};
