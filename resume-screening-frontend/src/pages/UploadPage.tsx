import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '@/components/features/FileUploader';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Loader2 } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumeFile,
    jobDescriptionFile,
    setResumeFile,
    setJobDescriptionFile,
    setAnalysis,
  } = useAppStore();

  const { uploadFiles, isLoading, error } = useFileUpload();

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescriptionFile) return;

    const result = await uploadFiles(resumeFile, jobDescriptionFile);
    
    if (result) {
      setAnalysis(result.analysis, result.resumeId);
      navigate('/results');
    }
  };

  const canAnalyze = resumeFile && jobDescriptionFile && !isLoading;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Resume Screening Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload a resume and job description to get instant AI-powered match analysis
          </p>
        </div>

        {/* Upload Forms */}
        <div className="space-y-6">
          <FileUploader
            file={resumeFile}
            onFileSelect={setResumeFile}
            label="Upload Resume"
          />

          <FileUploader
            file={jobDescriptionFile}
            onFileSelect={setJobDescriptionFile}
            label="Upload Job Description"
          />

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="w-full h-14 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Match →'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
