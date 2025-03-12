'use server';

import pdf from 'pdf-parse/lib/pdf-parse.js';
import { PDFParseResult } from 'pdf-parse';

// Placeholder message
export async function pdfParserMessage(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Return a clear message about PDF limitations
    const fileName = file.name;
    resolve(
      `[PDF SUPPORT LIMITED]\n\n` +
      `The file "${fileName}" is a PDF document.\n\n` +
      `PDF comparison is currently limited in this application. ` +
      `For best results, please consider:\n` +
      `- Converting your PDF to text before uploading\n` +
      `- Using plain text or markdown files instead\n` +
      `- Copying text directly from your PDF into the text area\n\n` +
      `If you need to compare PDFs specifically, you may want to use a dedicated PDF comparison tool.`
    );
  });
}

// Parse PDF and return text
export async function parsePdf(file: File): Promise<string> {
  const dataBuffer = await Buffer.from(await file.arrayBuffer());
  return pdf(dataBuffer).then(function(data: PDFParseResult) {
    return data.text;
  })
  .catch(function(error: Error) {
    return error.message;
  })
}