'use client';

import React, { useState } from 'react';
import { DiffResult } from '@/utils/diffUtils';
import {
  GitBranchIcon,
  ListIcon,
  DiffIcon,
  CopyIcon,
  CheckIcon,
  HelpCircleIcon,
  XIcon,
  ZapIcon,
  EyeIcon,
  HashIcon,
  TypeIcon
} from 'lucide-react';
import * as Diff from 'diff';

interface DiffViewProps {
  diffResult: DiffResult | null;
  viewMode: 'git' | 'list';
  onViewModeChange: (mode: 'git' | 'list') => void;
  ignoreWhitespace: boolean;
  onIgnoreWhitespaceChange: (ignoreWhitespace: boolean) => void;
}

export default function DiffView({ diffResult, viewMode, ignoreWhitespace, onViewModeChange, onIgnoreWhitespaceChange }: DiffViewProps) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showInlineDiffs, setShowInlineDiffs] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
          {/* View Mode Controls */}
          <div className="flex items-center gap-2 p-1.5 bg-background rounded-xl border-2 border-border shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange('git')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                viewMode === 'git'
                  ? 'bg-primary border-primary text-white shadow-lg transform scale-105 ring-2 ring-primary/30'
                  : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-md'
              }`}
              title="Git-style unified diff view"
            >
              <GitBranchIcon size={16} />
              <span>Git Style</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                viewMode === 'list'
                  ? 'bg-primary border-primary text-white shadow-lg transform scale-105 ring-2 ring-primary/30'
                  : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-md'
              }`}
              title="List view showing only changes"
            >
              <ListIcon size={16} />
              <span>List View</span>
            </button>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2 p-1.5 bg-background rounded-xl border-2 border-border shadow-sm">
            <button
              type="button"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                showLineNumbers
                  ? 'bg-success border-success text-white shadow-lg ring-2 ring-success/30'
                  : 'bg-card border-border text-foreground hover:border-success/50 hover:bg-success/5 hover:text-success hover:shadow-md'
              }`}
              title="Toggle line numbers"
            >
              <HashIcon size={16} />
              <span>Lines</span>
            </button>
            <button
              type="button"
              onClick={() => setShowInlineDiffs(!showInlineDiffs)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                showInlineDiffs
                  ? 'bg-warning border-warning text-white shadow-lg ring-2 ring-warning/30'
                  : 'bg-card border-border text-foreground hover:border-warning/50 hover:bg-warning/5 hover:text-warning hover:shadow-md'
              }`}
              title="Show character-level differences within lines"
            >
              <ZapIcon size={16} />
              <span>Inline</span>
            </button>
            <button
              type="button"
              onClick={() => onIgnoreWhitespaceChange(!ignoreWhitespace)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                ignoreWhitespace
                  ? 'bg-info border-info text-white shadow-lg ring-2 ring-info/30'
                  : 'bg-card border-border text-foreground hover:border-info/50 hover:bg-info/5 hover:text-info hover:shadow-md'
              }`}
              title="Ignore whitespace differences"
            >
              <EyeIcon size={16} />
              <span>No WS</span>
            </button>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-1 p-1.5 bg-background rounded-xl border-2 border-border shadow-sm">
            <button
              type="button"
              onClick={() => adjustFontSize(-1)}
              className="flex items-center justify-center w-10 h-10 text-sm font-bold bg-card border-2 border-border text-foreground hover:border-muted hover:bg-muted/10 hover:text-muted-dark rounded-lg transition-all duration-200 hover:shadow-md"
              title="Decrease font size"
              disabled={fontSize <= 10}
            >
              A-
            </button>
            <div className="flex items-center justify-center min-w-[3.5rem] px-3 py-2 text-sm font-bold text-foreground bg-muted/10 rounded-lg border-2 border-muted/30">
              {fontSize}px
            </div>
            <button
              type="button"
              onClick={() => adjustFontSize(1)}
              className="flex items-center justify-center w-10 h-10 text-sm font-bold bg-card border-2 border-border text-foreground hover:border-muted hover:bg-muted/10 hover:text-muted-dark rounded-lg transition-all duration-200 hover:shadow-md"
              title="Increase font size"
              disabled={fontSize >= 20}
            >
              A+
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center justify-center w-12 h-12 bg-card border-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
              title="Help & Instructions"
            >
              <HelpCircleIcon size={20} />
            </button>

            <button
              onClick={() => copyToClipboard(getDiffContent())}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                copied
                  ? 'bg-success text-white border-success ring-2 ring-success/30'
                  : 'bg-card text-foreground border-border hover:bg-primary hover:text-white hover:border-primary hover:ring-2 hover:ring-primary/30'
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
        ) : (
          <ListStyleDiff
            diffResult={diffResult}
            fontSize={fontSize}
            showInlineDiffs={showInlineDiffs}
          />
        )}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-50 duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-strong overflow-hidden animate-in scale-in-95 duration-300">
            {/* Header */}
            <div className="relative bg-gradient-primary p-6 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                    <HelpCircleIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Diffl Help & Guide</h2>
                    <p className="text-white/80 text-sm">Master the art of file comparison</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
                >
                  <XIcon size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Getting Started */}
                <div className="space-y-6">
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <ZapIcon size={20} className="text-primary" />
                      Getting Started
                    </h3>
                    <div className="space-y-3 text-sm text-foreground/80">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">1</span>
                        <p>Upload files or paste content into both input areas (File A and File B)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">2</span>
                        <p>Diffl automatically detects and highlights differences between your files</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">3</span>
                        <p>Use the view options to customize how differences are displayed</p>
                      </div>
                    </div>
                  </div>

                  {/* View Modes */}
                  <div className="bg-success/5 rounded-xl p-6 border border-success/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <EyeIcon size={20} className="text-success" />
                      View Modes
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded-lg text-xs">
                          <GitBranchIcon size={12} />
                          Git Style
                        </div>
                        <p className="text-sm text-foreground/80">Shows a unified diff view similar to Git, with all changes in context</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded-lg text-xs">
                          <ListIcon size={12} />
                          List View
                        </div>
                        <p className="text-sm text-foreground/80">Displays only the changed lines in a clean, organized list format</p>
                      </div>
                    </div>
                  </div>

                  {/* File Support */}
                  <div className="bg-info/5 rounded-xl p-6 border border-info/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TypeIcon size={20} className="text-info" />
                      Supported Files
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                        <span>Text files (.txt)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                        <span>Markdown (.md, .mdx)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                        <span>PDF documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                        <span>Plain text content</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/60 mt-3">Maximum file size: 10MB</p>
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-6">
                  <div className="bg-warning/5 rounded-xl p-6 border border-warning/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <HashIcon size={20} className="text-warning" />
                      Display Options
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-success text-white rounded-lg text-xs">
                          <HashIcon size={12} />
                          Lines
                        </div>
                        <p className="text-sm text-foreground/80">Toggle line numbers on/off for easier navigation</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-warning text-white rounded-lg text-xs">
                          <ZapIcon size={12} />
                          Inline
                        </div>
                        <p className="text-sm text-foreground/80">Show character-level differences within modified lines</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-info text-white rounded-lg text-xs">
                          <EyeIcon size={12} />
                          No WS
                        </div>
                        <p className="text-sm text-foreground/80">Ignore whitespace differences for cleaner comparisons</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Legend */}
                  <div className="bg-muted-subtle rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Color Legend</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-success rounded-full"></div>
                        <span className="text-sm">Added content</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-error rounded-full"></div>
                        <span className="text-sm">Removed content</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-warning rounded-full"></div>
                        <span className="text-sm">Modified content (inline diff)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-muted rounded-full"></div>
                        <span className="text-sm">Unchanged content</span>
                      </div>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-xl p-6 border border-primary/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <ZapIcon size={20} className="text-primary" />
                      Pro Tips
                    </h3>
                    <div className="space-y-2 text-sm text-foreground/80">
                      <p>• Use drag & drop to quickly upload files</p>
                      <p>• Adjust font size for better readability</p>
                      <p>• Copy diff results to share with others</p>
                      <p>• Enable inline diffs for precise change detection</p>
                      <p>• Switch between light and dark themes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 bg-muted-subtle">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">
                  Need more help? Check out our documentation or contact support.
                </p>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="btn btn-sm btn-primary"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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



// Simple Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
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