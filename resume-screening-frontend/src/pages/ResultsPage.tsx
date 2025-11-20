import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MatchAnalysis } from '@/components/features/MatchAnalysis';
import { ChatInterface } from '@/components/features/ChatInterface';
import { useAppStore } from '@/store/appStore';
import { useChat } from '@/hooks/useChat';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysis, resumeId, messages, addMessage, reset } = useAppStore();
  const { sendMessage, isLoading } = useChat();

  React.useEffect(() => {
    if (!analysis || !resumeId) {
      navigate('/');
    }
  }, [analysis, resumeId, navigate]);

  const handleSendMessage = async (question: string) => {
    if (!resumeId) return;

    // Add user message
    addMessage({
      role: 'user',
      content: question,
      timestamp: new Date(),
    });

    // Get AI response
    const response = await sendMessage(resumeId, question, messages);

    if (response) {
      addMessage({
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(response.timestamp),
      });
    }
  };

  const handleNewAnalysis = () => {
    reset();
    navigate('/');
  };

  if (!analysis) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleNewAnalysis}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Match Analysis */}
          <div>
            <MatchAnalysis analysis={analysis} />
          </div>

          {/* Right: Chat */}
          <div>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
