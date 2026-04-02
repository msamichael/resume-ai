import { extractText } from "unpdf";
import mammoth from 'mammoth';

/**
 * Parses a PDF file and extracts text content
 * @param file - File object representing the PDF to parse
 * @returns Promise containing the extracted text
 */
export async function parseResume(file: File): Promise<string[]|string> {
  try {
    if (!file.name) {
      throw new Error('File has no name');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const lowerName = file.name.toLowerCase();

    // Check if file is a PDF
    if (lowerName.endsWith('.pdf')) {
      const {text} = await extractText(new Uint8Array(buffer)) ;
      return text;
    }
    // Check if file is a DOCX
    if (lowerName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

