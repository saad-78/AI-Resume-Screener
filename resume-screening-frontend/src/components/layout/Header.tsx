import React from 'react';

export const Header: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">Resume Analyzer</h1>
        </div>
      </div>
    </header>
  );
};
