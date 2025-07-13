'use client';

import React, { useState } from 'react';
import { FileStats as FileStatsType } from '@/utils/diffUtils';
import {
  ClockIcon,
  HashIcon,
  BookOpenIcon,
  FileTextIcon,
  AlignLeftIcon,
  AlignJustifyIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  BrainIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';

interface FileStatsProps {
  stats: FileStatsType | null;
  label: string;
}

export default function FileStats({ stats, label }: FileStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!stats) {
    return null;
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-success';
      case 'Moderate': return 'text-warning';
      case 'Complex': return 'text-error';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <FileTextIcon size={18} className="text-primary mr-2" />
            <h3 className="text-sm font-semibold text-foreground">{label} Statistics</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-secondary"
            title={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
          </button>
        </div>
      </div>

      <div className="card-body py-3">
        {/* Primary Stats - Always Visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatItem
            icon={<ClockIcon size={16} className="text-primary" />}
            label="Reading Time"
            value={`${stats.readingTime} min`}
          />
          <StatItem
            icon={<BookOpenIcon size={16} className="text-primary" />}
            label="Words"
            value={stats.wordCount.toLocaleString()}
          />
          <StatItem
            icon={<HashIcon size={16} className="text-primary" />}
            label="Characters"
            value={stats.totalChars.toLocaleString()}
          />
          <StatItem
            icon={<BrainIcon size={16} className={getComplexityColor(stats.complexity)} />}
            label="Complexity"
            value={stats.complexity}
            valueClassName={getComplexityColor(stats.complexity)}
          />
        </div>

        {/* Expanded Stats */}
        {isExpanded && (
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <StatItem
                icon={<AlignLeftIcon size={16} className="text-primary" />}
                label="Lines"
                value={stats.lineCount.toLocaleString()}
              />
              <StatItem
                icon={<AlignJustifyIcon size={16} className="text-primary" />}
                label="Paragraphs"
                value={stats.paragraphCount.toLocaleString()}
              />
              <StatItem
                icon={<MessageSquareIcon size={16} className="text-primary" />}
                label="Sentences"
                value={stats.sentenceCount.toLocaleString()}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatItem
                icon={<TrendingUpIcon size={16} className="text-primary" />}
                label="Avg Words/Sentence"
                value={stats.averageWordsPerSentence.toString()}
              />
              <StatItem
                icon={<TrendingUpIcon size={16} className="text-primary" />}
                label="Avg Chars/Word"
                value={stats.averageCharsPerWord.toString()}
              />
              <StatItem
                icon={<BrainIcon size={16} className="text-primary" />}
                label="Lexical Diversity"
                value={`${(stats.languageMetrics.lexicalDiversity * 100).toFixed(1)}%`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function StatItem({ icon, label, value, valueClassName }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium text-foreground/70">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${valueClassName || 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}