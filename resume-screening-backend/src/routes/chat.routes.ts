import express, { Request, Response } from 'express';
import { answerQuestion } from '../services/rag.service.js';
import { ChatRequest, ChatResponse } from '../types/index.js';

const router = express.Router();

/**
 * POST /api/chat
 * Ask questions about the resume
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId, question, conversationHistory = [] }: ChatRequest = req.body;
    
    if (!resumeId || !question) {
      res.status(400).json({ error: 'resumeId and question required' });
      return;
    }
    
    const response: ChatResponse = await answerQuestion(
      question,
      resumeId,
      conversationHistory
    );
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

export default router;
