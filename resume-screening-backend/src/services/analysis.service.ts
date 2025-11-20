import { groqClient, GROQ_CONFIG } from '../config/groq.config.js';
import { MatchAnalysis } from '../types/index.js';

/**
 * Analyze resume against job description
 */
export async function analyzeMatch(
  resumeText: string,
  jobDescriptionText: string
): Promise<MatchAnalysis> {
  const prompt = `You are an expert resume analyst. Compare this resume against the job description and provide a detailed analysis.

JOB DESCRIPTION:
${jobDescriptionText}

RESUME:
${resumeText}

Provide your analysis in the following JSON format:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "overallAssessment": "brief 2-3 sentence summary"
}

Focus on: technical skills, years of experience, education requirements, and specific qualifications mentioned in the JD.`;
  
  const completion = await groqClient.chat.completions.create({
    model: GROQ_CONFIG.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2, // Very low for structured output
    max_tokens: 1024,
  });
  
  const response = completion.choices[0]?.message?.content || '{}';
  
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch?.[0] || '{}');
    
    console.log(`✅ Match analysis complete (${analysis.matchScore}% match)`);
    
    return {
      matchScore: analysis.matchScore || 0,
      strengths: analysis.strengths || [],
      gaps: analysis.gaps || [],
      overallAssessment: analysis.overallAssessment || 'Analysis unavailable',
    };
  } catch (error) {
    console.error('❌ Failed to parse analysis:', error);
    throw new Error('Failed to analyze resume match');
  }
}
