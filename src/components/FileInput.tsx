'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FileTextIcon, UploadIcon, FileIcon, XIcon } from 'lucide-react';
import { parsePdf } from '@/utils/pdfParser';

interface FileInputProps {
  id: string;
  label: string;
  onContentChange: (content: string) => void;
}

export default function FileInput({ id, label, onContentChange }: FileInputProps) {
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    try {
      let fileContent = '';
      
      if (file.type === 'application/pdf') {
        // For PDF files, use the PDF parser
        fileContent = await parsePdf(file);
      } else {
        // For text and markdown files
        fileContent = await file.text();
      }

      setContent(fileContent);
      onContentChange(fileContent);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearContent = () => {
    setContent('');
    setFileName('');
    onContentChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <FileTextIcon size={18} className="text-primary mr-2" />
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        </div>
        <div className="flex items-center gap-2">
          {fileName && (
            <div className="badge badge-primary">
              <FileIcon size={12} className="mr-1" />
              {fileName}
            </div>
          )}
          <button
            type="button"
            onClick={triggerFileUpload}
            className="btn btn-sm btn-secondary"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <UploadIcon size={14} />
                Upload
              </>
            )}
          </button>
          {content && (
            <button
              type="button"
              onClick={clearContent}
              className="btn btn-sm btn-secondary"
              title="Clear content"
            >
              <XIcon size={14} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id={`${id}-file`}
            accept=".txt,.md,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="card-body p-0">
        <div 
          className={`relative ${isDragging ? 'bg-primary/5 border-primary' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            id={id}
            value={content}
            onChange={handleTextChange}
            placeholder="Paste text here or drop a file..."
            className="w-full h-64 p-4 bg-card font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-0 border-0"
          />
          {!content && !isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
              <FileTextIcon size={24} className="mb-2 text-foreground/40" />
              <p className="text-sm text-foreground/40">Paste text or drop a file here</p>
            </div>
          )}
          {isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded pointer-events-none">
              <UploadIcon size={32} className="mb-2 text-primary animate-pulse-slow" />
              <p className="text-sm font-medium text-primary">Drop file to upload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 