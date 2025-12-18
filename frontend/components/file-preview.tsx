'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react';
import ErrorBoundary from './error-boundary';

// Lazy load the Molstar viewer
const MolstarViewer = lazy(() => import('./protein-viewer/MolstarViewer'));

interface FilePreviewProps {
  file: File;
  folderName?: string;
  index: number;
  totalFiles: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, folderName, index, totalFiles }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState('unknown');
  const [isPdb, setIsPdb] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Set height based on total files and whether this one is expanded
  const getPreviewHeight = () => {
    if (expanded) return '500px';
    const pdbCount = Math.min(totalFiles, 4);
    if (pdbCount <= 1) return '400px';
    if (pdbCount === 2) return '300px';
    if (pdbCount === 3) return '250px';
    return '220px';
  };

  useEffect(() => {
    if (!file) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileContent(null);
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    setFileType(extension || 'unknown');
    setIsPdb(extension === 'pdb');

    if (extension === 'pdb') {
      try {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const content = event.target?.result;
            if (typeof content === 'string' && content.length > 0) {
              setFileContent(content);
              setIsLoading(false);
            } else {
              setError('File appears to be empty');
              setIsLoading(false);
            }
          } catch (err) {
            console.error('Error processing file content:', err);
            setError('Error processing file content');
            setIsLoading(false);
          }
        };
        
        reader.onerror = (err) => {
          console.error('FileReader error:', err);
          setError('Error reading file');
          setIsLoading(false);
        };
        
        reader.readAsText(file);
      } catch (err) {
        console.error('Error setting up FileReader:', err);
        setError('Error setting up file reader');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [file]);

  // Skip non-PDB files
  if (!file || !file.name.toLowerCase().endsWith('.pdb')) {
    return null;
  }

  const getFormattedSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-white/20 border-t-[#8B7DFF] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70 text-sm">Loading viewer...</p>
      </div>
    </div>
  );

  return (
    <div className="mt-4 border border-white/20 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {folderName && (
            <span className="text-sm font-semibold bg-gradient-to-r from-[#8B7DFF] to-[#a899ff] px-3 py-1 rounded-full text-white shadow-md">
              {folderName}
            </span>
          )}
          <h3 className="font-medium text-white">{file.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-white/80 border border-white/10">
            {getFormattedSize(file.size)}
          </span>
          {isPdb && (
            <button 
              onClick={toggleExpanded} 
              className="text-xs bg-[#8B7DFF]/20 hover:bg-[#8B7DFF]/40 px-3 py-1.5 rounded-full text-[#8B7DFF] transition-all duration-200 border border-[#8B7DFF]/30 hover:border-[#8B7DFF]/50"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
      </div>
      
      {/* Viewer */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px] bg-[#1a1a1a]">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-white/20 border-t-[#8B7DFF] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70 text-sm">Loading structure...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] bg-[#1a1a1a]">
            <div className="text-center text-white/70 p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-400 font-medium">Error loading preview</p>
              <p className="mt-2 text-sm text-white/50">{error}</p>
            </div>
          </div>
        ) : isPdb && fileContent ? (
          <div className="relative" style={{ height: getPreviewHeight() }}>
            <ErrorBoundary 
              fallback={
                <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
                  <div className="text-center text-white/70 p-6">
                    <p className="text-amber-400 mb-2">Viewer unavailable</p>
                    <p className="text-sm text-white/50">The 3D viewer could not be loaded</p>
                  </div>
                </div>
              }
            >
              <Suspense fallback={<LoadingSpinner />}>
                <MolstarViewer 
                  pdbData={fileContent} 
                  width="100%" 
                  height="100%"
                  backgroundColor="#1a1a1a"
                  showControls={false}
                  autoRotate={false}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] bg-[#1a1a1a]">
            <div className="text-center text-white/70">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-medium">Preview not available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
