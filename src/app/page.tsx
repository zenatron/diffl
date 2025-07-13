'use client';

import { useState, useEffect } from 'react';
import FileInput from '@/components/FileInput';
import DiffView from '@/components/DiffView';
import FileStats from '@/components/FileStats';
import HelpModal from '@/components/HelpModal';
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
  const [showHelpModal, setShowHelpModal] = useState(false);
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
    <div className="min-h-screen bg-background flex flex-col particles">
      <main className="container mx-auto px-4 py-6 lg:py-8 flex-grow">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-8 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-4 animate-in slide-in-from-top-2 duration-700">
              Compare Files with Precision
            </h1>
            <p className="text-foreground/80 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-top-2 duration-700" style={{animationDelay: '0.2s'}}>
              Upload or paste your files to see detailed differences, statistics, and insights.
              Supports text, markdown, and PDF files with advanced comparison features.
            </p>
          </div>
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

            {/* Enhanced Center Controls */}
            <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:z-4 flex lg:flex-col items-center justify-center gap-3">
              {hasContent && (
                <div className="glass-modern flex lg:flex-col items-center gap-3 p-4 rounded-2xl shadow-lg animate-in scale-in-95 duration-500">
                  <button
                    onClick={swapContent}
                    className="btn btn-sm btn-secondary magnetic"
                    title="Swap files"
                    disabled={!hasComparison}
                  >
                    <RefreshCwIcon size={16} />
                  </button>
                  <button
                    onClick={clearAll}
                    className="btn btn-sm btn-ghost magnetic"
                    title="Clear all"
                  >
                    Clear
                  </button>
                </div>
              )}
              {!hasContent && (
                <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-success/10 border-2 border-dashed border-primary/30 animate-pulse-glow">
                  <ArrowRightIcon size={24} className="text-primary animate-float" />
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

        {/* Enhanced Comparison Status */}
        {hasComparison && (
          <div className="mb-8 animate-in fade-in-50 duration-500">
            <div className="glass-modern flex items-center justify-center gap-4 p-6 rounded-2xl border border-primary/20 shadow-lg">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${isComparing ? 'bg-gradient-to-r from-warning to-warning-light animate-pulse-glow' : 'bg-gradient-to-r from-success to-success-light'}`}></div>
                {!isComparing && (
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-success/30 animate-ping"></div>
                )}
              </div>
              <span className="text-base font-semibold text-foreground">
                {isComparing ? 'Analyzing differences...' : 'Comparison ready'}
              </span>
              {!isComparing && (
                <div className="text-success">
                  ✨
                </div>
              )}
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
            onShowHelp={() => setShowHelpModal(true)}
          />
        </div>
      </main>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
