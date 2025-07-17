'use client';

import React, { useState } from 'react';
import { DiffResult } from '@/utils/diffUtils';
import {
  GitBranchIcon,
  ListIcon,
  DiffIcon,
  CopyIcon,
  CheckIcon,
  ZapIcon,
  HashIcon,
  SplitIcon
} from 'lucide-react';
import * as Diff from 'diff';
import { levenshteinDistance } from '@/utils/diffUtils';

interface DiffViewProps {
  diffResult: DiffResult | null;
  viewMode: 'git' | 'list' | 'side-by-side';
  onViewModeChange: (mode: 'git' | 'list' | 'side-by-side') => void;
}

export default function DiffView({ diffResult, viewMode, onViewModeChange }: DiffViewProps) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showInlineDiffs, setShowInlineDiffs] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.max(10, Math.min(20, prev + delta)));
  };

  if (!diffResult) {
    return (
      <div className="card min-h-[400px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-foreground/70 p-8">
          <div className="relative mb-6">
            <DiffIcon size={64} className="opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Ready to Compare</h3>
          <p className="text-center text-sm text-foreground/60 max-w-md">
            Upload files or paste content in both inputs above to see a detailed comparison with
            line-by-line differences, statistics, and insights.
          </p>
        </div>
      </div>
    );
  }

  // Prepare content for copying
  const getDiffContent = () => {
    if (viewMode === 'git') {
      return diffResult.lines.map(line => {
        let prefix = '';
        if (line.added) prefix = '+ ';
        if (line.removed) prefix = '- ';
        return prefix + line.value;
      }).join('\n');
    } else {
      const changes: string[] = [];
      diffResult.lines.forEach(line => {
        if (line.added) {
          line.value.split('\n').filter(Boolean).forEach(l => {
            changes.push(`+ ${l}`);
          });
        } else if (line.removed) {
          line.value.split('\n').filter(Boolean).forEach(l => {
            changes.push(`- ${l}`);
          });
        }
      });
      return changes.join('\n');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <DiffIcon size={18} className="text-primary mr-2" />
          <h3 className="text-sm font-semibold text-foreground">Differences</h3>
          <div className="ml-3 flex items-center gap-2">
            <span className="badge badge-primary">
              {diffResult.changes.linesChanged} lines
            </span>
            <span className="badge badge-success">
              {diffResult.changes.charsChanged} chars
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Modern View Mode Controls */}
          <div className="glass-modern flex items-center gap-1 p-2 rounded-2xl border border-border/50 shadow-md">
            <button
              type="button"
              onClick={() => onViewModeChange('git')}
              className={`btn btn-sm magnetic ${
                viewMode === 'git'
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
              title="Git-style unified diff view"
            >
              <GitBranchIcon size={16} />
              <span>Unified</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('side-by-side')}
              className={`btn btn-sm magnetic ${
                viewMode === 'side-by-side'
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
              title="Side-by-side diff view"
            >
              <SplitIcon size={16} />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`btn btn-sm magnetic ${
                viewMode === 'list'
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
              title="List view showing only changes"
            >
              <ListIcon size={16} />
              <span>List</span>
            </button>
          </div>

          {/* Modern Display Options */}
          <div className="glass-modern flex items-center gap-1 p-2 rounded-2xl border border-border/50 shadow-md">
            <button
              type="button"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`btn btn-sm magnetic ${
                showLineNumbers
                  ? 'btn-success'
                  : 'btn-ghost'
              }`}
              title="Toggle line numbers"
            >
              <HashIcon size={16} />
              <span>Lines</span>
            </button>
            <button
              type="button"
              onClick={() => setShowInlineDiffs(!showInlineDiffs)}
              className={`btn btn-sm magnetic ${
                showInlineDiffs
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
              title="Show character-level differences within lines"
            >
              <ZapIcon size={16} />
              <span>Inline</span>
            </button>

          </div>

          {/* Modern Font Size Controls */}
          <div className="glass-modern flex items-center gap-1 p-2 rounded-2xl border border-border/50 shadow-md">
            <button
              type="button"
              onClick={() => adjustFontSize(-1)}
              className="btn btn-sm btn-icon btn-ghost magnetic"
              title="Decrease font size"
              disabled={fontSize <= 10}
            >
              A-
            </button>
            <div className="flex items-center justify-center min-w-[3.5rem] px-3 py-2 text-sm font-bold text-foreground bg-gradient-to-r from-muted/10 to-muted/5 rounded-lg border border-muted/20">
              {fontSize}px
            </div>
            <button
              type="button"
              onClick={() => adjustFontSize(1)}
              className="btn btn-sm btn-icon btn-ghost magnetic"
              title="Increase font size"
              disabled={fontSize >= 20}
            >
              A+
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => copyToClipboard(getDiffContent())}
              className={`btn magnetic ${
                copied
                  ? 'btn-success'
                  : 'btn-secondary'
              }`}
              title="Copy diff to clipboard"
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        {viewMode === 'git' ? (
          <GitStyleDiff
            diffResult={diffResult}
            showLineNumbers={showLineNumbers}
            fontSize={fontSize}
            showInlineDiffs={showInlineDiffs}
          />
        ) : viewMode === 'side-by-side' ? (
          <SideBySideDiff
            diffResult={diffResult}
            showLineNumbers={showLineNumbers}
            fontSize={fontSize}
            showInlineDiffs={showInlineDiffs}
          />
        ) : (
          <ListStyleDiff
            diffResult={diffResult}
            fontSize={fontSize}
            showInlineDiffs={showInlineDiffs}
          />
        )}
      </div>


    </div>
  );
}

interface GitStyleDiffProps {
  diffResult: DiffResult;
  showLineNumbers: boolean;
  fontSize: number;
  showInlineDiffs: boolean;
}

// Helper function to create inline character-level diffs
function createInlineDiff(oldText: string, newText: string): React.ReactNode {
  const charDiff = Diff.diffChars(oldText, newText);

  return charDiff.map((part, index) => {
    if (part.added) {
      return (
        <span key={index} className="inline-diff-added">
          {part.value}
        </span>
      );
    } else if (part.removed) {
      return (
        <span key={index} className="inline-diff-removed">
          {part.value}
        </span>
      );
    } else {
      return <span key={index} className="inline-diff-unchanged">{part.value}</span>;
    }
  });
}

function GitStyleDiff({ diffResult, showLineNumbers, fontSize, showInlineDiffs }: GitStyleDiffProps) {
  // Process the diff result to split multi-line changes into individual lines
  const processedLines: Array<{
    type: 'added' | 'removed' | 'unchanged' | 'modified',
    content: string,
    lineNumber?: number,
    oldContent?: string,
    newContent?: string
  }> = [];
  let lineNumber = 1;

  if (showInlineDiffs) {
    // Process lines in order, looking for adjacent added/removed pairs
    const diffLines = diffResult.lines;
    let i = 0;

    while (i < diffLines.length) {
      const currentLine = diffLines[i];

      if (currentLine.removed && i + 1 < diffLines.length && diffLines[i + 1].added) {
        // Found a removed line followed by an added line - potential inline diff
        const removedContent = currentLine.value.split('\n').filter(l => l !== '');
        const addedContent = diffLines[i + 1].value.split('\n').filter(l => l !== '');

        // Process line by line within this change block
        const maxLines = Math.max(removedContent.length, addedContent.length);

        for (let j = 0; j < maxLines; j++) {
          const removedLine = removedContent[j] || '';
          const addedLine = addedContent[j] || '';

          if (removedLine && addedLine) {
            // Calculate similarity
            const maxLength = Math.max(removedLine.length, addedLine.length);
            if (maxLength > 0) {
              const distance = levenshteinDistance(removedLine, addedLine);
              const similarity = (maxLength - distance) / maxLength;

              if (similarity >= 0.3) { // Lower threshold for better matching
                // Similar enough for inline diff
                processedLines.push({
                  type: 'modified',
                  content: addedLine,
                  oldContent: removedLine,
                  newContent: addedLine,
                  lineNumber: lineNumber++
                });
                continue;
              }
            }
          }

          // Not similar enough or one is empty, treat as separate add/remove
          if (removedLine) {
            processedLines.push({ type: 'removed', content: removedLine, lineNumber: lineNumber++ });
          }
          if (addedLine) {
            processedLines.push({ type: 'added', content: addedLine, lineNumber: lineNumber++ });
          }
        }

        i += 2; // Skip both the removed and added lines
      } else if (currentLine.added) {
        // Just an added line
        const lines = currentLine.value.split('\n');
        lines.forEach((content, idx) => {
          if (idx === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'added', content, lineNumber: lineNumber++ });
        });
        i++;
      } else if (currentLine.removed) {
        // Just a removed line
        const lines = currentLine.value.split('\n');
        lines.forEach((content, idx) => {
          if (idx === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'removed', content, lineNumber: lineNumber++ });
        });
        i++;
      } else {
        // Unchanged line
        const lines = currentLine.value.split('\n');
        lines.forEach((content, idx) => {
          if (idx === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'unchanged', content, lineNumber: lineNumber++ });
        });
        i++;
      }
    }
  } else {
    // Original processing without inline diffs
    diffResult.lines.forEach(line => {
      if (line.added) {
        const lines = line.value.split('\n');
        lines.forEach((content, i) => {
          if (i === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'added', content, lineNumber: lineNumber++ });
        });
      } else if (line.removed) {
        const lines = line.value.split('\n');
        lines.forEach((content, i) => {
          if (i === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'removed', content, lineNumber: lineNumber++ });
        });
      } else {
        const lines = line.value.split('\n');
        lines.forEach((content, i) => {
          if (i === lines.length - 1 && content === '') return;
          processedLines.push({ type: 'unchanged', content, lineNumber: lineNumber++ });
        });
      }
    });
  }

  // Use all processed lines
  const displayLines = processedLines;

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-foreground/50 px-2 py-1 bg-background/50 rounded">
        {displayLines.length} lines • {fontSize}px
      </div>
      <div
        className="p-4 bg-card overflow-x-auto font-mono whitespace-pre-wrap max-h-[600px] overflow-y-auto"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
      >
        {displayLines.map((line, index) => {
          const lineNum = line.lineNumber || index + 1;

          if (line.type === 'added') {
            return (
              <div key={index} className="diff-added py-1 flex items-start hover:bg-success/5 transition-colors">
                {showLineNumbers && (
                  <span className="text-xs text-foreground/40 w-12 flex-shrink-0 text-right mr-3 mt-0.5 select-none">
                    {lineNum}
                  </span>
                )}
                <div className="flex items-center justify-center w-5 h-5 rounded-full mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: '#34d399' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="flex-1 break-all">{line.content || ' '}</span>
              </div>
            );
          } else if (line.type === 'removed') {
            return (
              <div key={index} className="diff-removed py-1 flex items-start hover:bg-error/5 transition-colors">
                {showLineNumbers && (
                  <span className="text-xs text-foreground/40 w-12 flex-shrink-0 text-right mr-3 mt-0.5 select-none">
                    {lineNum}
                  </span>
                )}
                <div className="flex items-center justify-center w-5 h-5 rounded-full mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: '#f87171' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <span className="flex-1 break-all">{line.content || ' '}</span>
              </div>
            );
          } else if (line.type === 'modified') {
            return (
              <div key={index} className="py-1 flex items-start hover:bg-warning/5 transition-colors border-l-4 border-warning/50">
                {showLineNumbers && (
                  <span className="text-xs text-foreground/40 w-12 flex-shrink-0 text-right mr-3 mt-0.5 select-none">
                    {lineNum}
                  </span>
                )}
                <div className="flex items-center justify-center w-5 h-5 rounded-full mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: '#f59e0b' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div className="flex-1 break-all">
                  {line.oldContent && line.newContent ?
                    createInlineDiff(line.oldContent, line.newContent) :
                    (line.content || ' ')
                  }
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="py-1 border-l-4 border-transparent text-foreground/80 flex items-start hover:bg-foreground/5 transition-colors">
                {showLineNumbers && (
                  <span className="text-xs text-foreground/40 w-12 flex-shrink-0 text-right mr-3 mt-0.5 select-none">
                    {lineNum}
                  </span>
                )}
                <span className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"></span>
                <span className="flex-1 break-all">{line.content || ' '}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

interface ListStyleDiffProps {
  diffResult: DiffResult;
  fontSize: number;
  showInlineDiffs: boolean;
}

function ListStyleDiff({ diffResult, fontSize, showInlineDiffs }: ListStyleDiffProps) {
  const changes: { type: 'added' | 'removed' | 'modified'; value: string; index: number; oldValue?: string; newValue?: string }[] = [];

  if (showInlineDiffs) {
    // Process lines in order, looking for adjacent added/removed pairs
    const diffLines = diffResult.lines;
    let i = 0;

    while (i < diffLines.length) {
      const currentLine = diffLines[i];

      if (currentLine.removed && i + 1 < diffLines.length && diffLines[i + 1].added) {
        // Found a removed line followed by an added line - potential inline diff
        const removedContent = currentLine.value.split('\n').filter(Boolean);
        const addedContent = diffLines[i + 1].value.split('\n').filter(Boolean);

        // Process line by line within this change block
        const maxLines = Math.max(removedContent.length, addedContent.length);

        for (let j = 0; j < maxLines; j++) {
          const removedLine = removedContent[j] || '';
          const addedLine = addedContent[j] || '';

          if (removedLine && addedLine) {
            // Calculate similarity
            const maxLength = Math.max(removedLine.length, addedLine.length);
            if (maxLength > 0) {
              const distance = levenshteinDistance(removedLine, addedLine);
              const similarity = (maxLength - distance) / maxLength;

              if (similarity >= 0.3) { // Lower threshold for better matching
                // Similar enough for inline diff
                changes.push({
                  type: 'modified',
                  value: addedLine,
                  oldValue: removedLine,
                  newValue: addedLine,
                  index: changes.length
                });
                continue;
              }
            }
          }

          // Not similar enough or one is empty, treat as separate add/remove
          if (removedLine) {
            changes.push({ type: 'removed', value: removedLine, index: changes.length });
          }
          if (addedLine) {
            changes.push({ type: 'added', value: addedLine, index: changes.length });
          }
        }

        i += 2; // Skip both the removed and added lines
      } else if (currentLine.added) {
        // Just an added line
        currentLine.value.split('\n').filter(Boolean).forEach(l => {
          changes.push({ type: 'added', value: l, index: changes.length });
        });
        i++;
      } else if (currentLine.removed) {
        // Just a removed line
        currentLine.value.split('\n').filter(Boolean).forEach(l => {
          changes.push({ type: 'removed', value: l, index: changes.length });
        });
        i++;
      } else {
        // Skip unchanged lines in list view (we only show changes)
        i++;
      }
    }
  } else {
    // Original processing without inline diffs
    diffResult.lines.forEach(line => {
      if (line.added) {
        line.value.split('\n').filter(Boolean).forEach(l => {
          changes.push({ type: 'added', value: l, index: changes.length });
        });
      } else if (line.removed) {
        line.value.split('\n').filter(Boolean).forEach(l => {
          changes.push({ type: 'removed', value: l, index: changes.length });
        });
      }
    });
  }

  return (
    <div className="p-4 bg-card max-h-[600px] overflow-y-auto">
      {changes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-foreground/70">
          <CheckIcon size={48} className="mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Changes Detected</h3>
          <p className="text-sm text-center">The files appear to be identical</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-foreground/50 mb-4">
            Showing {changes.length} changes • {fontSize}px
          </div>
          {changes.map((change, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                change.type === 'added'
                  ? 'diff-added border-success/30'
                  : change.type === 'removed'
                  ? 'diff-removed border-error/30'
                  : 'border-warning/30 bg-warning/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: change.type === 'added' ? '#34d399' :
                                   change.type === 'removed' ? '#f87171' : '#f59e0b'
                  }}>
                  {change.type === 'added' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  ) : change.type === 'removed' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      change.type === 'added'
                        ? 'bg-success/20 text-success'
                        : change.type === 'removed'
                        ? 'bg-error/20 text-error'
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {change.type === 'added' ? 'ADDED' :
                       change.type === 'removed' ? 'REMOVED' : 'MODIFIED'}
                    </span>
                    <span className="text-xs text-foreground/50">
                      Line {change.index + 1}
                    </span>
                  </div>
                  <pre
                    className="font-mono whitespace-pre-wrap break-all text-foreground"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}
                  >
                    {change.type === 'modified' && change.oldValue && change.newValue ?
                      createInlineDiff(change.oldValue, change.newValue) :
                      change.value
                    }
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Side-by-side diff component with synchronized scrolling
interface SideBySideDiffProps {
  diffResult: DiffResult;
  showLineNumbers: boolean;
  fontSize: number;
  showInlineDiffs: boolean;
}

function SideBySideDiff({ diffResult, showLineNumbers, fontSize, showInlineDiffs }: SideBySideDiffProps) {
  const leftPanelRef = React.useRef<HTMLDivElement>(null);
  const rightPanelRef = React.useRef<HTMLDivElement>(null);

  // Synchronized scrolling
  const handleScroll = (source: 'left' | 'right') => (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const other = source === 'left' ? rightPanelRef.current : leftPanelRef.current;

    if (other && other !== target) {
      other.scrollTop = target.scrollTop;
      other.scrollLeft = target.scrollLeft;
    }
  };

  // Process diff result into side-by-side format
  const processedLines = React.useMemo(() => {
    const leftLines: Array<{content: string, lineNumber?: number, type: 'unchanged' | 'removed' | 'modified', oldContent?: string}> = [];
    const rightLines: Array<{content: string, lineNumber?: number, type: 'unchanged' | 'added' | 'modified', newContent?: string}> = [];

    let leftLineNumber = 1;
    let rightLineNumber = 1;

    if (showInlineDiffs) {
      // Process lines in order, looking for adjacent removed/added pairs for inline diffs
      const diffLines = diffResult.lines;
      let i = 0;

      while (i < diffLines.length) {
        const currentLine = diffLines[i];

        if (currentLine.removed && i + 1 < diffLines.length && diffLines[i + 1].added) {
          // Found adjacent removed and added lines - potential modification
          const removedContent = currentLine.value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l.length > 0);
          const addedContent = diffLines[i + 1].value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l.length > 0);
          const maxLines = Math.max(removedContent.length, addedContent.length);

          for (let j = 0; j < maxLines; j++) {
            const removedLine = removedContent[j] || '';
            const addedLine = addedContent[j] || '';

            if (removedLine && addedLine) {
              // Calculate similarity using Levenshtein distance
              const maxLength = Math.max(removedLine.length, addedLine.length);
              if (maxLength > 0) {
                const distance = levenshteinDistance(removedLine, addedLine);
                const similarity = (maxLength - distance) / maxLength;

                if (similarity >= 0.3) { // Similar enough for inline diff
                  leftLines.push({
                    content: removedLine,
                    lineNumber: leftLineNumber++,
                    type: 'modified',
                    oldContent: removedLine
                  });
                  rightLines.push({
                    content: addedLine,
                    lineNumber: rightLineNumber++,
                    type: 'modified',
                    newContent: addedLine
                  });
                  continue;
                }
              }
            }

            // Not similar enough, treat as separate removed/added lines
            if (removedLine) {
              leftLines.push({
                content: removedLine,
                lineNumber: leftLineNumber++,
                type: 'removed'
              });
              rightLines.push({ content: '', type: 'unchanged' });
            }
            if (addedLine) {
              leftLines.push({ content: '', type: 'unchanged' });
              rightLines.push({
                content: addedLine,
                lineNumber: rightLineNumber++,
                type: 'added'
              });
            }
          }

          i += 2; // Skip both removed and added lines
        } else {
          // Process single line normally
          const lines = currentLine.value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l.length > 0);

          if (currentLine.added) {
            // Add empty lines to left, actual lines to right
            lines.forEach(content => {
              leftLines.push({ content: '', type: 'unchanged' });
              rightLines.push({
                content,
                lineNumber: rightLineNumber++,
                type: 'added'
              });
            });
          } else if (currentLine.removed) {
            // Add actual lines to left, empty lines to right
            lines.forEach(content => {
              leftLines.push({
                content,
                lineNumber: leftLineNumber++,
                type: 'removed'
              });
              rightLines.push({ content: '', type: 'unchanged' });
            });
          } else {
            // Add same lines to both sides
            lines.forEach(content => {
              leftLines.push({
                content,
                lineNumber: leftLineNumber++,
                type: 'unchanged'
              });
              rightLines.push({
                content,
                lineNumber: rightLineNumber++,
                type: 'unchanged'
              });
            });
          }

          i++;
        }
      }
    } else {
      // Original logic when inline diffs are disabled
      diffResult.lines.forEach(line => {
        const lines = line.value.split('\n').filter((l, i, arr) => i < arr.length - 1 || l.length > 0);

        if (line.added) {
          // Add empty lines to left, actual lines to right
          lines.forEach(content => {
            leftLines.push({ content: '', type: 'unchanged' });
            rightLines.push({
              content,
              lineNumber: rightLineNumber++,
              type: 'added'
            });
          });
        } else if (line.removed) {
          // Add actual lines to left, empty lines to right
          lines.forEach(content => {
            leftLines.push({
              content,
              lineNumber: leftLineNumber++,
              type: 'removed'
            });
            rightLines.push({ content: '', type: 'unchanged' });
          });
        } else {
          // Add same lines to both sides
          lines.forEach(content => {
            leftLines.push({
              content,
              lineNumber: leftLineNumber++,
              type: 'unchanged'
            });
            rightLines.push({
              content,
              lineNumber: rightLineNumber++,
              type: 'unchanged'
            });
          });
        }
      });
    }

    return { leftLines, rightLines };
  }, [diffResult, showInlineDiffs]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-foreground/50 px-2 py-1 bg-background/50 rounded z-10">
        {Math.max(processedLines.leftLines.length, processedLines.rightLines.length)} lines • {fontSize}px
      </div>

      <div className="grid grid-cols-2 gap-0 max-h-[600px] border border-border rounded-lg overflow-hidden">
        {/* Left Panel - Original */}
        <div className="border-r border-border">
          <div className="bg-muted/20 px-4 py-2 border-b border-border">
            <h4 className="text-sm font-medium text-foreground">Original</h4>
          </div>
          <div
            ref={leftPanelRef}
            className="overflow-auto font-mono whitespace-pre-wrap bg-card"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.5, maxHeight: '550px' }}
            onScroll={handleScroll('left')}
          >
            {processedLines.leftLines.map((line, index) => (
              <div
                key={index}
                className={`flex ${
                  line.type === 'removed'
                    ? 'diff-removed'
                    : line.type === 'modified'
                    ? 'diff-modified'
                    : ''
                }`}
              >
                {showLineNumbers && (
                  <div className="flex-shrink-0 w-12 px-2 text-right text-foreground/50 bg-muted/10 border-r border-border select-none">
                    {line.lineNumber || ''}
                  </div>
                )}
                <div className="flex-1 px-4 py-1 min-h-[1.5em]">
                  {line.type === 'modified' && line.oldContent && showInlineDiffs ? (
                    <span className="inline-diff-removed">{line.content}</span>
                  ) : (
                    line.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Modified */}
        <div>
          <div className="bg-muted/20 px-4 py-2 border-b border-border">
            <h4 className="text-sm font-medium text-foreground">Modified</h4>
          </div>
          <div
            ref={rightPanelRef}
            className="overflow-auto font-mono whitespace-pre-wrap bg-card"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.5, maxHeight: '550px' }}
            onScroll={handleScroll('right')}
          >
            {processedLines.rightLines.map((line, index) => (
              <div
                key={index}
                className={`flex ${
                  line.type === 'added'
                    ? 'diff-added'
                    : line.type === 'modified'
                    ? 'diff-modified'
                    : ''
                }`}
              >
                {showLineNumbers && (
                  <div className="flex-shrink-0 w-12 px-2 text-right text-foreground/50 bg-muted/10 border-r border-border select-none">
                    {line.lineNumber || ''}
                  </div>
                )}
                <div className="flex-1 px-4 py-1 min-h-[1.5em]">
                  {line.type === 'modified' && line.newContent && showInlineDiffs ? (
                    createInlineDiff(
                      processedLines.leftLines[index]?.oldContent || '',
                      line.newContent
                    )
                  ) : (
                    line.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}