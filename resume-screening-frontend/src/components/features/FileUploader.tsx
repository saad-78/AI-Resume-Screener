import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  label: string;
  accept?: Record<string, string[]>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileSelect,
  label,
  accept = { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        {label}
      </label>
      
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-border bg-card",
            "transition-all duration-300 cursor-pointer",
            "shadow-neumorphic dark:shadow-neumorphic-dark",
            "hover:border-accent hover:shadow-xl",
            "p-12 text-center",
            isDragActive && "border-accent bg-accent/5 scale-[1.02]"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-muted transition-colors duration-300",
              isDragActive && "bg-accent/20"
            )}>
              <Upload className={cn(
                "w-8 h-8 text-muted-foreground",
                isDragActive && "text-accent"
              )} />
            </div>
            
            <div>
              <p className="text-base font-medium text-foreground">
                {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground">
              PDF or TXT • Max 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-border bg-card p-6 shadow-neumorphic dark:shadow-neumorphic-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded bg-accent/10 flex items-center justify-center">
                <File className="w-6 h-6 text-accent" />
              </div>
              
              <div>
                <p className="font-medium text-foreground truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              //@ts-ignore
              size="icon"
              onClick={removeFile}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
