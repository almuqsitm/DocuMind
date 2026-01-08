"use client";

import React, { useState, useCallback } from 'react';
import { Button } from './ui/Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isUploading }) => {
  const [isDidDragEnter, setIsDidDragEnter] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDidDragEnter(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDidDragEnter(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDidDragEnter(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Only PDF files are allowed");
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       if (file.type === "application/pdf") {
         setSelectedFile(file);
       } else {
         alert("Only PDF files are allowed");
       }
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
        onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDidDragEnter 
            ? 'border-blue-500 bg-blue-500/10 scale-105' 
            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
          }
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
             {selectedFile ? (
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
             )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-200">
              {selectedFile ? selectedFile.name : "Drop PDF here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {selectedFile ? "Ready to upload" : "or click to browse"}
            </p>
          </div>

          {selectedFile && (
            <Button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit();
                }}
                isLoading={isUploading}
                className="w-full mt-2 z-10 relative"
            >
                Upload & Analyze
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
