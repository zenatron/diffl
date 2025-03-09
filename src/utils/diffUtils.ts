import * as diffLib from 'diff';

export interface DiffLine {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface DiffResult {
  lines: DiffLine[];
  changes: {
    linesChanged: number;
    charsChanged: number;
  };
}

export interface FileStats {
  readingTime: number; // in minutes
  totalChars: number;
  wordCount: number;
}

/**
 * Calculate statistics for a text file
 */
export function calculateFileStats(text: string): FileStats {
  const totalChars = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  // Average reading speed is about 200-250 words per minute
  // We'll use 225 as a middle ground
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));
  
  return {
    readingTime,
    totalChars,
    wordCount,
  };
}

/**
 * Compare two text files and return the differences
 */
export function compareFiles(oldText: string, newText: string): DiffResult {
  // Split the text into lines
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  // Get the diff
  const diffResult = diffLib.diffLines(oldText, newText);
  
  // Count changes
  let linesChanged = 0;
  let charsChanged = 0;
  
  diffResult.forEach(part => {
    if (part.added || part.removed) {
      const lines = part.value.split('\n').length - (part.value.endsWith('\n') ? 1 : 0);
      linesChanged += lines;
      charsChanged += part.value.length;
    }
  });
  
  return {
    lines: diffResult.map(part => ({
      value: part.value,
      added: part.added,
      removed: part.removed,
    })),
    changes: {
      linesChanged,
      charsChanged,
    },
  };
}

/**
 * Get a list of changes from the diff result
 */
export function getChangesList(diffResult: DiffResult): string[] {
  const changes: string[] = [];
  
  diffResult.lines.forEach(line => {
    if (line.added) {
      changes.push(`+ ${line.value.trim()}`);
    } else if (line.removed) {
      changes.push(`- ${line.value.trim()}`);
    }
  });
  
  return changes;
} 