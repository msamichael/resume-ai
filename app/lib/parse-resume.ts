import pdf from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Parses a PDF file and extracts text content
 * @param file - File object representing the PDF to parse
 * @returns Promise containing the extracted text
 */
export async function parseResume(file: File): Promise<string> {
  try {
    if (!file.name) {
      throw new Error('File has no name');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const lowerName = file.name.toLowerCase();

    // Check if file is a PDF
    if (lowerName.endsWith('.pdf')) {
      const data = await pdf(buffer);
      return data.text;
    }
    if (lowerName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

