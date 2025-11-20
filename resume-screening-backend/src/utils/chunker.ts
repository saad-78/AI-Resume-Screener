import { Chunk } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Split text into semantic chunks
 */
export function chunkText(
  text: string,
  documentId: string,
  documentType: 'resume' | 'job_description',
  chunkSize: number = 500,
  overlap: number = 50
): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Split by double newlines (paragraphs/sections)
  const sections = text.split(/\n\n+/);
  
  for (const section of sections) {
    if (section.trim().length < 50) continue; // Skip tiny sections
    
    const words = section.trim().split(/\s+/);
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkText = chunkWords.join(' ');
      
      chunks.push({
        id: uuidv4(),
        text: chunkText,
        documentId,
        documentType,
        section: detectSection(chunkText),
        metadata: {
          wordCount: chunkWords.length,
          position: i,
        },
      });
    }
  }
  
  console.log(`✅ Created ${chunks.length} chunks from ${documentType}`);
  return chunks;
}

/**
 * Detect section type from text content
 */
function detectSection(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('experience') || lowerText.includes('worked at')) {
    return 'experience';
  } else if (lowerText.includes('education') || lowerText.includes('university') || lowerText.includes('degree')) {
    return 'education';
  } else if (lowerText.includes('skill') || lowerText.includes('technologies')) {
    return 'skills';
  } else if (lowerText.includes('summary') || lowerText.includes('objective')) {
    return 'summary';
  } else {
    return 'general';
  }
}
