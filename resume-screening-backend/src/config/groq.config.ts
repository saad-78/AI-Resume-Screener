import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error('❌ GROQ_API_KEY not found in .env file');
}

export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Default model configuration
 * Updated to use latest supported model
 */
export const GROQ_CONFIG = {
  model: 'llama-3.3-70b-versatile', // Latest model (Nov 2024)
  temperature: 0.3,
  maxTokens: 1024,
  topP: 0.9,
};
