'use client';

import React, { useState } from 'react';
import { DiffResult } from '@/utils/diffUtils';
import { GitBranchIcon, ListIcon, DiffIcon, CopyIcon, CheckIcon } from 'lucide-react';

interface DiffViewProps {
  diffResult: DiffResult | null;
  viewMode: 'git' | 'list';
  onViewModeChange: (mode: 'git' | 'list') => void;
}

export default function DiffView({ diffResult, viewMode, onViewModeChange }: DiffViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!diffResult) {
    return (
      <div className="card min-h-[300px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-foreground/70 p-6">
          <DiffIcon size={48} className="mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Differences Yet</h3>
          <p className="text-center text-sm">Enter text in both inputs to see the differences</p>
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
          <div className="ml-3 flex items-center">
            <span className="badge badge-primary mr-2">
              {diffResult.changes.linesChanged} lines
            </span>
            <span className="badge badge-primary">
              {diffResult.changes.charsChanged} characters
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              type="button"
              onClick={() => onViewModeChange('git')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                viewMode === 'git'
                  ? 'bg-primary text-white'
                  : 'bg-card text-foreground/70 hover:bg-border'
              }`}
            >
              <GitBranchIcon size={14} />
              Git Style
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-card text-foreground/70 hover:bg-border'
              }`}
            >
              <ListIcon size={14} />
              List View
            </button>
          </div>
          <button
            onClick={() => copyToClipboard(getDiffContent())}
            className="btn btn-sm btn-secondary"
            title="Copy diff to clipboard"
          >
            {copied ? <CheckIcon size={14} className="text-success" /> : <CopyIcon size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        {viewMode === 'git' ? (
          <GitStyleDiff diffResult={diffResult} />
        ) : (
          <ListStyleDiff diffResult={diffResult} />
        )}
      </div>
    </div>
  );
}

function GitStyleDiff({ diffResult }: { diffResult: DiffResult }) {
  // Process the diff result to split multi-line changes into individual lines
  const processedLines: Array<{ type: 'added' | 'removed' | 'unchanged', content: string }> = [];
  
  diffResult.lines.forEach(line => {
    if (line.added) {
      // Split added lines and mark each as added
      const lines = line.value.split('\n');
      lines.forEach((content, i) => {
        // Skip empty lines at the end
        if (i === lines.length - 1 && content === '') return;
        processedLines.push({ type: 'added', content });
      });
    } else if (line.removed) {
      // Split removed lines and mark each as removed
      const lines = line.value.split('\n');
      lines.forEach((content, i) => {
        // Skip empty lines at the end
        if (i === lines.length - 1 && content === '') return;
        processedLines.push({ type: 'removed', content });
      });
    } else {
      // Split unchanged lines and mark each as unchanged
      const lines = line.value.split('\n');
      lines.forEach((content, i) => {
        // Skip empty lines at the end
        if (i === lines.length - 1 && content === '') return;
        processedLines.push({ type: 'unchanged', content });
      });
    }
  });

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-foreground/50 px-2 py-1 bg-background/50 rounded">
        Line diff
      </div>
      <div className="p-4 bg-card overflow-x-auto text-sm font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto">
        {processedLines.map((line, index) => {
          if (line.type === 'added') {
            return (
              <div key={index} className="diff-added py-1 pl-2 flex items-center">
                <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2" style={{ backgroundColor: '#34d399' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span>{line.content}</span>
              </div>
            );
          } else if (line.type === 'removed') {
            return (
              <div key={index} className="diff-removed py-1 pl-2 flex items-center">
                <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2" style={{ backgroundColor: '#f87171' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <span>{line.content}</span>
              </div>
            );
          } else {
            return (
              <div key={index} className="py-1 pl-2 border-l-4 border-transparent text-foreground flex items-center">
                <span className="w-6 h-6 mr-2"></span>
                <span>{line.content}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

function ListStyleDiff({ diffResult }: { diffResult: DiffResult }) {
  const changes: { type: 'added' | 'removed'; value: string }[] = [];

  diffResult.lines.forEach(line => {
    if (line.added) {
      line.value.split('\n').filter(Boolean).forEach(l => {
        changes.push({ type: 'added', value: l });
      });
    } else if (line.removed) {
      line.value.split('\n').filter(Boolean).forEach(l => {
        changes.push({ type: 'removed', value: l });
      });
    }
  });

  return (
    <div className="p-4 bg-card max-h-[500px] overflow-y-auto">
      {changes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-foreground/70">
          <CheckIcon size={36} className="mb-3 opacity-50" />
          <p>No differences found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {changes.map((change, index) => (
            <li
              key={index}
              className={`p-3 rounded shadow-soft ${
                change.type === 'added'
                  ? 'diff-added'
                  : 'diff-removed'
              }`}
            >
              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2" 
                  style={{ backgroundColor: change.type === 'added' ? '#34d399' : '#f87171' }}>
                  {change.type === 'added' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </div>
                <span className="font-mono text-sm overflow-x-auto max-w-full">
                  {change.value}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 