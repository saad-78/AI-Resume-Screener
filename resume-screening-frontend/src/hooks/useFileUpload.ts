import { useState } from 'react';
import api from '@/lib/api';
import { UploadResponse } from '@/types';

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (
    resumeFile: File,
    jobDescriptionFile: File
  ): Promise<UploadResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescriptionFile);

      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFiles, isLoading, error };
};
