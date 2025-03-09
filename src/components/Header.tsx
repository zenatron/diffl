'use client';

import React from 'react';
import Link from 'next/link';
import { GitCompareIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-card border-b border-border py-4 shadow-soft sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          <GitCompareIcon size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{"diffl"}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="https://github.com/zenatron/diffl">
            <FaGithub size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
} 