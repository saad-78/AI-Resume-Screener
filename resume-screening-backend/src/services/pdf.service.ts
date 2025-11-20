import { createRequire } from 'module';
import fs from 'fs/promises';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    
    // pdf-parse can be either default export or direct function
    const parsePdf = pdfParse.default || pdfParse;
    const pdfData = await parsePdf(dataBuffer);
    
    const text = pdfData.text
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')     // Max 2 newlines
      .trim();
    
    console.log(`✅ Extracted ${text.length} characters from PDF`);
    return text;
  } catch (error) {
    console.error('❌ PDF extraction failed:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Extract text from TXT file
 */
export async function extractTextFromTXT(filePath: string): Promise<string> {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    console.log(`✅ Extracted ${text.length} characters from TXT`);
    return text;
  } catch (error) {
    console.error('❌ TXT extraction failed:', error);
    throw new Error('Failed to read TXT file');
  }
}

/**
 * Auto-detect file type and extract text
 */
export async function extractText(filePath: string, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimeType === 'text/plain') {
    return await extractTextFromTXT(filePath);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
