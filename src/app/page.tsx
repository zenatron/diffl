'use client';

import { useState, useEffect } from 'react';
import FileInput from '@/components/FileInput';
import DiffView from '@/components/DiffView';
import FileStats from '@/components/FileStats';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { compareFiles, calculateFileStats, DiffResult, FileStats as FileStatsType } from '@/utils/diffUtils';

export default function Home() {
  const [leftContent, setLeftContent] = useState<string>('');
  const [rightContent, setRightContent] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [leftStats, setLeftStats] = useState<FileStatsType | null>(null);
  const [rightStats, setRightStats] = useState<FileStatsType | null>(null);
  const [viewMode, setViewMode] = useState<'git' | 'list'>('git');

  // Update diff when content changes
  useEffect(() => {
    if (leftContent && rightContent) {
      const result = compareFiles(leftContent, rightContent);
      setDiffResult(result);
    } else {
      setDiffResult(null);
    }
  }, [leftContent, rightContent]);

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
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <FileInput
              id="left-input"
              label="Original File"
              onContentChange={setLeftContent}
            />
            {leftStats && <div className="mt-4"><FileStats stats={leftStats} label="Original File" /></div>}
          </div>
          <div>
            <FileInput
              id="right-input"
              label="Modified File"
              onContentChange={setRightContent}
            />
            {rightStats && <div className="mt-4"><FileStats stats={rightStats} label="Modified File" /></div>}
          </div>
        </div>

        <div>
          <DiffView
            diffResult={diffResult}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
