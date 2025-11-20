import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { MatchAnalysis as MatchAnalysisType } from '@/types';

interface MatchAnalysisProps {
  analysis: MatchAnalysisType;
}

export const MatchAnalysis: React.FC<MatchAnalysisProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Match Score */}
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-6">
          <CircularProgress percentage={analysis.matchScore} />
          
          <div className="text-center max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Overall Assessment</h3>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.overallAssessment}
            </p>
          </div>
        </div>
      </Card>

      {/* Strengths and Gaps */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              <span>Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-foreground leading-relaxed">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <XCircle className="w-6 h-6 text-muted-foreground" />
              <span>Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.gaps.length > 0 ? (
                analysis.gaps.map((gap, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      {gap}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground italic">
                  No significant gaps identified
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
