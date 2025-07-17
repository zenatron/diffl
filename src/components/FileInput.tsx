'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FileTextIcon, UploadIcon, FileIcon, XIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { parsePdf } from '@/utils/pdfParser';

interface FileInputProps {
  id: string;
  label: string;
  onContentChange: (content: string) => void;
}

interface FileValidation {
  isValid: boolean;
  error?: string;
  fileType?: string;
  fileSize?: number;
}

export default function FileInput({ id, label, onContentChange }: FileInputProps) {
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ type: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_TYPES = {
    'text/plain': 'Text',
    'text/markdown': 'Markdown',
    'application/pdf': 'PDF',
    'text/x-markdown': 'Markdown'
  };
  const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.mdx', '.pdf'];

  const validateFile = (file: File): FileValidation => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 10MB limit.`
      };
    }

    // Check file type by MIME type
    const isValidMimeType = Object.keys(SUPPORTED_TYPES).includes(file.type);

    // Check file extension as fallback
    const fileExtension = file.name.includes('.')
      ? '.' + file.name.split('.').pop()?.toLowerCase()
      : '';
    const isValidExtension = SUPPORTED_EXTENSIONS.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      return {
        isValid: false,
        error: `Unsupported file type. Please use: ${SUPPORTED_EXTENSIONS.join(', ')}`
      };
    }

    return {
      isValid: true,
      fileType: SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES] || 'Unknown',
      fileSize: file.size
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
    setError(''); // Clear any previous errors when user types
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file first
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    setError('');
    setFileInfo({
      type: validation.fileType || 'Unknown',
      size: validation.fileSize || 0
    });

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
    } catch (error: unknown) {
      console.error('Error reading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to read file. Please try again.';
      setError(errorMessage);
      setFileName('');
      setFileInfo(null);
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
    setError('');
    setFileInfo(null);
    onContentChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enhanced drag and drop handlers with better validation
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if dragged item contains files
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Provide visual feedback for valid drop targets
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) {
      setError('No files detected in drop.');
      return;
    }

    if (files.length > 1) {
      setError('Please drop only one file at a time.');
      return;
    }

    const file = files[0];
    await handleFileUpload(file);
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
            <div className="flex items-center gap-2">
              <div className="badge badge-primary">
                <FileIcon size={12} className="mr-1" />
                {fileName}
              </div>
              {fileInfo && (
                <div className="badge badge-success">
                  {fileInfo.type} • {(fileInfo.size / 1024).toFixed(1)}KB
                </div>
              )}
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
            accept=".txt,.md,.mdx,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-error/10 border-l-4 border-error">
          <div className="flex items-center">
            <AlertCircleIcon size={16} className="text-error mr-2" />
            <p className="text-sm text-error">{error}</p>
          </div>
        </div>
      )}
      <div className="card-body p-0">
        <div
          className={`relative transition-all duration-200 ${
            isDragging
              ? 'bg-primary/5 border-2 border-dashed border-primary'
              : 'border-2 border-transparent'
          }`}
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
            className="w-full h-64 p-4 bg-card font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-0 border-0 transition-all duration-200"
            spellCheck={false}
          />
          {!content && !isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
              <FileTextIcon size={32} className="mb-3 text-foreground/30" />
              <p className="text-sm text-foreground/40 mb-1">Paste text or drop a file here</p>
              <p className="text-xs text-foreground/30">
                Supports: {SUPPORTED_EXTENSIONS.join(', ')} (max 10MB)
              </p>
            </div>
          )}
          {isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 pointer-events-none">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-3">
                <UploadIcon size={32} className="text-primary animate-pulse" />
              </div>
              <p className="text-lg font-medium text-primary mb-1">Drop file to upload</p>
              <p className="text-sm text-primary/70">Release to process your file</p>
            </div>
          )}
          {content && !isDragging && (
            <div className="absolute top-2 right-2 pointer-events-none">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/20 rounded-full">
                <CheckCircleIcon size={12} className="text-success" />
                <span className="text-xs text-success font-medium">
                  {content.length.toLocaleString()} chars
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}