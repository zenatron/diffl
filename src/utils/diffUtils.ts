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
    addedLines: number;
    removedLines: number;
    similarity: number; // 0-100 percentage
    changeType: 'minor' | 'moderate' | 'major';
  };
  summary: {
    totalChanges: number;
    addedContent: number;
    removedContent: number;
    modifiedContent: number;
  };
}

export interface FileStats {
  readingTime: number; // in minutes
  totalChars: number;
  wordCount: number;
  lineCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageCharsPerWord: number;
  complexity: 'Simple' | 'Moderate' | 'Complex';
  languageMetrics: {
    uniqueWords: number;
    lexicalDiversity: number; // unique words / total words
  };
}

/**
 * Calculate comprehensive statistics for a text file
 */
export function calculateFileStats(text: string): FileStats {
  if (!text.trim()) {
    return {
      readingTime: 0,
      totalChars: 0,
      wordCount: 0,
      lineCount: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      averageWordsPerSentence: 0,
      averageCharsPerWord: 0,
      complexity: 'Simple',
      languageMetrics: {
        uniqueWords: 0,
        lexicalDiversity: 0
      }
    };
  }

  const totalChars = text.length;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Line count (including empty lines)
  const lineCount = text.split('\n').length;

  // Paragraph count (separated by double newlines or more)
  const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // Sentence count (rough estimation using punctuation)
  const sentenceCount = Math.max(1, (text.match(/[.!?]+/g) || []).length);

  // Average metrics
  const averageWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;
  const averageCharsPerWord = wordCount > 0 ? Math.round((totalChars / wordCount) * 10) / 10 : 0;

  // Language metrics
  const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, ''))).size;
  const lexicalDiversity = wordCount > 0 ? Math.round((uniqueWords / wordCount) * 100) / 100 : 0;

  // Complexity assessment based on various factors
  let complexityScore = 0;
  if (averageWordsPerSentence > 20) complexityScore += 1;
  if (averageCharsPerWord > 6) complexityScore += 1;
  if (lexicalDiversity > 0.7) complexityScore += 1;
  if (sentenceCount > 50) complexityScore += 1;

  const complexity: 'Simple' | 'Moderate' | 'Complex' =
    complexityScore <= 1 ? 'Simple' :
    complexityScore <= 2 ? 'Moderate' : 'Complex';

  // Average reading speed is about 200-250 words per minute
  // We'll use 225 as a middle ground
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));

  return {
    readingTime,
    totalChars,
    wordCount,
    lineCount,
    paragraphCount,
    sentenceCount,
    averageWordsPerSentence,
    averageCharsPerWord,
    complexity,
    languageMetrics: {
      uniqueWords,
      lexicalDiversity
    }
  };
}

/**
 * Calculate similarity between two texts (0-100%)
 */
function calculateSimilarity(oldText: string, newText: string, ignoreWhitespace: boolean = false): number {
  let text1 = oldText;
  let text2 = newText;

  // If ignoreWhitespace is true, normalize whitespace for comparison
  if (ignoreWhitespace) {
    text1 = oldText.replace(/\s+/g, ' ').trim();
    text2 = newText.replace(/\s+/g, ' ').trim();
  }

  const maxLength = Math.max(text1.length, text2.length);
  if (maxLength === 0) return 100;

  // Use Levenshtein distance for similarity calculation
  const distance = levenshteinDistance(text1, text2);
  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Determine change type based on similarity and change metrics
 */
function determineChangeType(similarity: number, changesRatio: number): 'minor' | 'moderate' | 'major' {
  if (similarity >= 90 && changesRatio <= 0.1) return 'minor';
  if (similarity >= 70 && changesRatio <= 0.3) return 'moderate';
  return 'major';
}



/**
 * Compare two text files and return comprehensive differences
 */
export function compareFiles(oldText: string, newText: string, options: {
  ignoreWhitespace: boolean;
}): DiffResult {
  // Use diff functions with ignoreWhitespace option
  const charDiff = Diff.diffChars(oldText, newText);
  const lineDiff = Diff.diffLines(oldText, newText, {
    ignoreWhitespace: options.ignoreWhitespace
  });

  // Count various metrics
  let linesChanged = 0;
  let charsChanged = 0;
  let addedLines = 0;
  let removedLines = 0;
  let addedContent = 0;
  let removedContent = 0;
  let modifiedContent = 0;

  charDiff.forEach((part) => {
    if (part.added) {
      addedContent += part.value.length;
      charsChanged += part.value.length;
    } else if (part.removed) {
      removedContent += part.value.length;
      charsChanged += part.value.length;
    }
  });

  lineDiff.forEach((part) => {
    const lineCount = part.value.split('\n').length - (part.value.endsWith('\n') ? 1 : 0);
    if (part.added) {
      addedLines += lineCount;
      linesChanged += lineCount;
    } else if (part.removed) {
      removedLines += lineCount;
      linesChanged += lineCount;
    }
  });

  // Calculate similarity and change metrics using original text
  const similarity = calculateSimilarity(oldText, newText, options.ignoreWhitespace);
  const totalLength = Math.max(oldText.length, newText.length);
  const changesRatio = totalLength > 0 ? charsChanged / totalLength : 0;
  const changeType = determineChangeType(similarity, changesRatio);

  // Count modified content (content that appears in both added and removed)
  modifiedContent = Math.min(addedContent, removedContent);

  return {
    lines: lineDiff.map(part => ({
      value: part.value,
      added: part.added,
      removed: part.removed,
    })),
    changes: {
      linesChanged,
      charsChanged,
      addedLines,
      removedLines,
      similarity,
      changeType,
    },
    summary: {
      totalChanges: addedLines + removedLines,
      addedContent,
      removedContent,
      modifiedContent,
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