import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

// pdf-parse uses pdfjs-dist under the hood and may spawn a worker.
// In some Node environments, the default worker configuration can trigger:
// "Unable to deserialize cloned data." Explicitly pointing to the local worker fixes that.
try {
    const workerSrc = import.meta.resolve
        ? import.meta.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs')
        : null;
    if (workerSrc) {
        PDFParse.setWorker(workerSrc);
    }
} catch (e) {
    // If we can't resolve the worker (older Node), we fall back to pdf-parse defaults.
}

/**
 * Extracts text content from a PDF file.
 * @param {string} filePath - The path to the PDF file.
 * @returns {Promise<{text: string, numPages: number}>} - A promise that resolves to the extracted text content.
 */
export const extractTextFromPDF = async (filePath) => {
    const parser = new PDFParse({ data: await fs.readFile(filePath) });

    try {
        // For document processing we mainly need plain text.
        // Skipping getInfo avoids additional worker calls that can fail in some environments.
        const textResult = await parser.getText();

        return {
            text: textResult.text,
            numPages: textResult.total,
            info: null,
        };
    } catch (error) {
        console.error('PDF Parsing Error:', error);
        throw new Error('Failed to extract text from PDF');
    } finally {
        await parser.destroy();
    }
};
