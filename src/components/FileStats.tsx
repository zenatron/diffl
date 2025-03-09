'use client';

import React from 'react';
import { FileStats as FileStatsType } from '@/utils/diffUtils';
import { ClockIcon, HashIcon, BookOpenIcon, FileTextIcon } from 'lucide-react';

interface FileStatsProps {
  stats: FileStatsType | null;
  label: string;
}

export default function FileStats({ stats, label }: FileStatsProps) {
  if (!stats) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <FileTextIcon size={18} className="text-primary mr-2" />
          <h3 className="text-sm font-semibold text-foreground">{label} Statistics</h3>
        </div>
      </div>
      <div className="card-body py-3">
        <div className="flex flex-wrap items-center gap-6">
          <StatItem 
            icon={<ClockIcon size={16} className="text-primary" />}
            label="Reading Time"
            value={`${stats.readingTime} min`}
          />
          <div className="h-4 w-px bg-border/50 hidden sm:block"></div>
          <StatItem 
            icon={<HashIcon size={16} className="text-primary" />}
            label="Characters"
            value={stats.totalChars.toLocaleString()}
          />
          <div className="h-4 w-px bg-border/50 hidden sm:block"></div>
          <StatItem 
            icon={<BookOpenIcon size={16} className="text-primary" />}
            label="Words"
            value={stats.wordCount.toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-primary">
        {icon}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-foreground/70">{label}:</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
} 