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
      <div className="card-body">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatItem 
            icon={<ClockIcon size={16} className="text-primary" />}
            label="Reading Time"
            value={`${stats.readingTime} min`}
          />
          <StatItem 
            icon={<HashIcon size={16} className="text-primary" />}
            label="Characters"
            value={stats.totalChars.toLocaleString()}
          />
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
    <div className="flex items-center gap-3 bg-background/30 p-3 rounded border border-border/50">
      <div className="bg-primary/10 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-xs text-foreground/70">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
} 