'use client';

import React from 'react';
import Link from 'next/link';
import { GitCompareIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border py-3 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-primary/15 p-2 rounded-full mr-3 shadow-sm">
          <GitCompareIcon size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{"diffl"}</h1>
          <p className="text-xs text-foreground/60 -mt-1">File comparison tool</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link 
            href="https://github.com/zenatron/diffl" 
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <FaGithub size={18} className="text-foreground/80" />
          </Link>
        </div>
      </div>
    </header>
  );
} 