'use client';

import { useState, useEffect } from 'react';
import FileInput from '@/components/FileInput';
import DiffView from '@/components/DiffView';
import FileStats from '@/components/FileStats';
import { compareFiles, calculateFileStats, DiffResult, FileStats as FileStatsType } from '@/utils/diffUtils';
import { ArrowRightIcon, RefreshCwIcon } from 'lucide-react';

export default function Home() {
  const [leftContent, setLeftContent] = useState<string>('');
  const [rightContent, setRightContent] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [leftStats, setLeftStats] = useState<FileStatsType | null>(null);
  const [rightStats, setRightStats] = useState<FileStatsType | null>(null);
  const [viewMode, setViewMode] = useState<'git' | 'list'>('git');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  // Swap content between left and right
  const swapContent = () => {
    const tempContent = leftContent;
    const tempStats = leftStats;
    setLeftContent(rightContent);
    setRightContent(tempContent);
    setLeftStats(rightStats);
    setRightStats(tempStats);
  };

  // Clear all content
  const clearAll = () => {
    setLeftContent('');
    setRightContent('');
    setLeftStats(null);
    setRightStats(null);
    setDiffResult(null);
  };

  // Update diff when content changes
  useEffect(() => {
    if (leftContent && rightContent) {
      setIsComparing(true);
      // Add a small delay to show loading state
      const timer = setTimeout(() => {
        const result = compareFiles(leftContent, rightContent, { ignoreWhitespace });
        setDiffResult(result);
        setIsComparing(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDiffResult(null);
      setIsComparing(false);
    }
  }, [leftContent, rightContent, ignoreWhitespace]);

  // Update stats when content changes
  useEffect(() => {
    if (leftContent) {
      setLeftStats(calculateFileStats(leftContent));
    } else {
      setLeftStats(null);
    }

    if (rightContent) {
      setRightStats(calculateFileStats(rightContent));
    } else {
      setRightStats(null);
    }
  }, [leftContent, rightContent]);

  const hasContent = leftContent || rightContent;
  const hasComparison = leftContent && rightContent;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 py-6 lg:py-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Compare Files with Precision
          </h1>
          <p className="text-foreground/70 text-sm lg:text-base max-w-2xl mx-auto">
            Upload or paste your files to see detailed differences, statistics, and insights.
            Supports text, markdown, and PDF files with advanced comparison features.
          </p>
        </div>

        {/* File Input Section */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Left File Input */}
            <div className="space-y-4">
              <FileInput
                id="left-input"
                label="File A (Original)"
                onContentChange={setLeftContent}
              />
              {leftStats && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <FileStats stats={leftStats} label="File A" />
                </div>
              )}
            </div>

            {/* Center Controls */}
            <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:z-10 flex lg:flex-col items-center justify-center gap-3">
              {hasContent && (
                <div className="flex lg:flex-col items-center gap-2 p-3 bg-card border border-border rounded-lg shadow-sm">
                  <button
                    onClick={swapContent}
                    className="btn btn-sm btn-secondary"
                    title="Swap files"
                    disabled={!hasComparison}
                  >
                    <RefreshCwIcon size={14} />
                  </button>
                  <button
                    onClick={clearAll}
                    className="btn btn-sm btn-secondary"
                    title="Clear all"
                  >
                    Clear
                  </button>
                </div>
              )}
              {!hasContent && (
                <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-dashed border-primary/30">
                  <ArrowRightIcon size={20} className="text-primary/50" />
                </div>
              )}
            </div>

            {/* Right File Input */}
            <div className="space-y-4">
              <FileInput
                id="right-input"
                label="File B (Modified)"
                onContentChange={setRightContent}
              />
              {rightStats && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <FileStats stats={rightStats} label="File B" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Status */}
        {hasComparison && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${isComparing ? 'bg-warning animate-pulse' : 'bg-success'}`}></div>
              <span className="text-sm font-medium text-foreground">
                {isComparing ? 'Analyzing differences...' : 'Comparison ready'}
              </span>
            </div>
          </div>
        )}

        {/* Diff View Section */}
        <div className="animate-in fade-in-50 duration-500">
          <DiffView
            diffResult={diffResult}
            viewMode={viewMode}
            ignoreWhitespace={ignoreWhitespace}
            onViewModeChange={setViewMode}
            onIgnoreWhitespaceChange={setIgnoreWhitespace}
          />
        </div>
      </main>
    </div>
  );
}
