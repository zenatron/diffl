'use server';

import pdf from 'pdf-parse/lib/pdf-parse.js';
import { PDFParseResult } from 'pdf-parse';

interface PDFMetadata {
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pages: number;
}

interface EnhancedPDFResult {
  text: string;
  metadata: PDFMetadata;
  wordCount: number;
  pageCount: number;
  extractionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Clean and format extracted PDF text
 */
function cleanPdfText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove page breaks and form feeds
    .replace(/[\f\r]/g, '\n')
    // Normalize line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Assess the quality of text extraction
 */
function assessExtractionQuality(text: string, pageCount: number): 'excellent' | 'good' | 'fair' | 'poor' {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const avgWordsPerPage = wordCount / pageCount;

  // Check for common extraction issues
  const hasGarbledText = /[^\p{L}\p{N}\s\p{P}]/u.test(text);
  const hasRepeatedChars = /(.)\1{10,}/.test(text);
  const hasProperSentences = /[.!?]\s+[A-Z]/.test(text);

  if (avgWordsPerPage > 200 && hasProperSentences && !hasGarbledText && !hasRepeatedChars) {
    return 'excellent';
  } else if (avgWordsPerPage > 100 && hasProperSentences && !hasRepeatedChars) {
    return 'good';
  } else if (avgWordsPerPage > 50 && !hasRepeatedChars) {
    return 'fair';
  } else {
    return 'poor';
  }
}

/**
 * Enhanced PDF parser with better text extraction and metadata
 */
export async function parsePdf(file: File): Promise<string> {
  try {
    const dataBuffer = await Buffer.from(await file.arrayBuffer());
    const data: PDFParseResult = await pdf(dataBuffer);

    // Clean the extracted text
    const cleanedText = cleanPdfText(data.text);

    // Extract metadata
    const metadata: PDFMetadata = {
      title: data.info?.Title || undefined,
      author: data.info?.Author || undefined,
      creator: data.info?.Creator || undefined,
      producer: data.info?.Producer || undefined,
      creationDate: data.info?.CreationDate || undefined,
      modificationDate: data.info?.ModDate || undefined,
      pages: data.numpages || 0,
    };

    // Calculate metrics
    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
    const extractionQuality = assessExtractionQuality(cleanedText, metadata.pages);

    // Create enhanced result
    const result: EnhancedPDFResult = {
      text: cleanedText,
      metadata,
      wordCount,
      pageCount: metadata.pages,
      extractionQuality,
    };

    // Return formatted text with metadata header
    let output = '';

    // Add metadata header if available
    if (metadata.title || metadata.author || metadata.pages > 0) {
      output += '--- PDF METADATA ---\n';
      if (metadata.title) output += `Title: ${metadata.title}\n`;
      if (metadata.author) output += `Author: ${metadata.author}\n`;
      if (metadata.pages > 0) output += `Pages: ${metadata.pages}\n`;
      output += `Words: ${wordCount.toLocaleString()}\n`;
      output += `Extraction Quality: ${extractionQuality}\n`;
      output += '--- CONTENT ---\n\n';
    }

    // Add quality warning if needed
    if (extractionQuality === 'poor') {
      output += '[WARNING: Poor text extraction quality detected. The PDF may contain images, complex layouts, or be scanned. Consider using OCR or manual text extraction for better results.]\n\n';
    } else if (extractionQuality === 'fair') {
      output += '[NOTE: Fair text extraction quality. Some formatting may be lost.]\n\n';
    }

    output += cleanedText;

    return output;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return `[PDF PARSING ERROR]\n\n` +
           `Failed to parse PDF file "${file.name}".\n\n` +
           `Error: ${errorMessage}\n\n` +
           `This could be due to:\n` +
           `- Encrypted or password-protected PDF\n` +
           `- Corrupted PDF file\n` +
           `- Unsupported PDF format\n` +
           `- Large file size (>10MB limit)\n\n` +
           `Please try:\n` +
           `- Using a different PDF file\n` +
           `- Converting the PDF to text manually\n` +
           `- Copying text directly from the PDF viewer`;
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function pdfParserMessage(file: File): Promise<string> {
  return `[PDF PROCESSING]\n\n` +
         `Processing PDF file "${file.name}"...\n\n` +
         `The enhanced PDF parser will attempt to extract text content ` +
         `and provide metadata about the document. For best results with ` +
         `complex PDFs, consider converting to plain text first.`;
}