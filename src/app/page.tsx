'use client';

import { useState, useEffect } from 'react';
import FileInput from '@/components/FileInput';
import DiffView from '@/components/DiffView';
import FileStats from '@/components/FileStats';
import { compareFiles, calculateFileStats, DiffResult, FileStats as FileStatsType } from '@/utils/diffUtils';

export default function Home() {
  const [leftContent, setLeftContent] = useState<string>('');
  const [rightContent, setRightContent] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [leftStats, setLeftStats] = useState<FileStatsType | null>(null);
  const [rightStats, setRightStats] = useState<FileStatsType | null>(null);
  const [viewMode, setViewMode] = useState<'git' | 'list'>('git');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  // Update diff when content changes
  useEffect(() => {
    if (leftContent && rightContent) {
      const result = compareFiles(leftContent, rightContent, { ignoreWhitespace });
      setDiffResult(result);
    } else {
      setDiffResult(null);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <FileInput
              id="left-input"
              label="File A"
              onContentChange={setLeftContent}
            />
            {leftStats && <div className="mt-4"><FileStats stats={leftStats} label="File A" /></div>}
          </div>
          <div>
            <FileInput
              id="right-input"
              label="File B"
              onContentChange={setRightContent}
            />
            {rightStats && <div className="mt-4"><FileStats stats={rightStats} label="File B" /></div>}
          </div>
        </div>

        <div>
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
