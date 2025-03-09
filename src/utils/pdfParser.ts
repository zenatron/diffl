'use client';

/**
 * A simple placeholder for PDF parsing that informs users of limitations
 */
export async function parsePdf(file: File): Promise<string> {
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