import * as Diff from 'diff';
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
    wordCount
  };
}

/**
 * Compare two text files and return the differences
 */
export function compareFiles(oldText: string, newText: string, options: {
  ignoreWhitespace: boolean;
}): DiffResult {
  
  // Get the diff
  const diff = Diff.diffChars(oldText, newText)
  const fragment = document.createDocumentFragment();

  // Count changes
  let linesChanged = 0;
  let charsChanged = 0;
  
  diff.forEach((part) => {
    const color = part.added ? 'bg-green-500' : part.removed ? 'bg-red-500' : 'bg-gray-500';
    const lines = part.value.split('\n').length - (part.value.endsWith('\n') ? 1 : 0);
    linesChanged += lines;
    charsChanged += part.value.length;
    const span = document.createElement('span');
    span.className = color;
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  });

  return {
    lines: diff.map(part => ({
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
      changes.push(line.value.trim());
    } else if (line.removed) {
      changes.push(line.value.trim());
    }
  });
  
  return changes;
} 