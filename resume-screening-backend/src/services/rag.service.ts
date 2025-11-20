import { groqClient, GROQ_CONFIG } from '../config/groq.config.js';
import { searchChunks } from './vector.service.js';
import { ChatMessage, ChatResponse } from '../types/index.js';

/**
 * Answer a question about the resume using RAG
 */
export async function answerQuestion(
  question: string,
  resumeId: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  // 1. Retrieve relevant resume chunks
  const { texts, sections } = await searchChunks(
    question,
    resumeId,
    'resume_chunks',
    3
  );
  
  if (texts.length === 0) {
    return {
      answer: "I couldn't find relevant information in the resume to answer this question.",
      sources: [],
      timestamp: new Date(),
    };
  }
  
  // 2. Build context from retrieved chunks
  const context = texts.join('\n\n---\n\n');
  
  // 3. Build conversation history
  const historyMessages = conversationHistory.slice(-4).map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
  
  // 4. Build prompt with context
  const systemPrompt = `You are a professional resume analyst. Answer questions about the candidate based ONLY on the provided resume excerpts. Be concise and factual.

Resume Context:
${context}`;
  
  // 5. Call Groq LLM
  const completion = await groqClient.chat.completions.create({
    model: GROQ_CONFIG.model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: question },
    ],
    temperature: GROQ_CONFIG.temperature,
    max_tokens: GROQ_CONFIG.maxTokens,
  });
  
  const answer = completion.choices[0]?.message?.content || 'No response generated.';
  
  console.log(`✅ Generated answer (${answer.length} chars)`);
  
  return {
    answer,
    sources: sections,
    timestamp: new Date(),
  };
}
