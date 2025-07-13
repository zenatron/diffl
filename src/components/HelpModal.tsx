'use client';

import React from 'react';
import { XIcon, GitBranchIcon, ListIcon, HashIcon, ZapIcon, EyeIcon } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-50 duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-xl overflow-hidden animate-in scale-in-95 duration-300">
        {/* Simple Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-success/5">
          <div>
            <h2 className="text-xl font-bold text-foreground">How to Use Diffl</h2>
            <p className="text-foreground/70 text-sm mt-1">Quick guide to file comparison</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-icon"
            aria-label="Close help"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Simple Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Quick Start */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Quick Start</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold mt-0.5">1</span>
                  <p className="text-foreground/80">Upload files or paste content into both input areas</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold mt-0.5">2</span>
                  <p className="text-foreground/80">Diffl automatically detects and highlights differences</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold mt-0.5">3</span>
                  <p className="text-foreground/80">Use the controls to customize the view and copy results</p>
                </div>
              </div>
            </div>

            {/* View Options */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">View Options</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-xs">
                    <GitBranchIcon size={12} />
                    Git Style
                  </div>
                  <p className="text-sm text-foreground/80">Unified diff view like Git</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-xs">
                    <ListIcon size={12} />
                    List View
                  </div>
                  <p className="text-sm text-foreground/80">Clean list of changes only</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="flex items-center gap-1 px-2 py-1 bg-success text-white rounded text-xs">
                    <HashIcon size={12} />
                    Lines
                  </div>
                  <p className="text-sm text-foreground/80">Toggle line numbers</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-xs">
                    <ZapIcon size={12} />
                    Inline
                  </div>
                  <p className="text-sm text-foreground/80">Show character-level changes</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="flex items-center gap-1 px-2 py-1 bg-secondary text-white rounded text-xs">
                    <EyeIcon size={12} />
                    No WS
                  </div>
                  <p className="text-sm text-foreground/80">Ignore whitespace differences</p>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Color Legend</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-foreground/80">Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-sm text-foreground/80">Removed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-sm text-foreground/80">Modified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span className="text-sm text-foreground/80">Unchanged</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• Drag & drop files for quick upload</li>
                <li>• Adjust font size with A+/A- buttons</li>
                <li>• Copy results to share with others</li>
                <li>• Switch themes with the toggle in header</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="border-t border-border p-4 bg-muted/5">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-primary"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
