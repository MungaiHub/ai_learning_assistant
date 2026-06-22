import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
 * Extracts text content from a PDF file.
 * @param {string} filePath - The path to the PDF file.
 * @returns {Promise<{text: string, numPages: number}>} - A promise that resolves to the extracted text content.
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        //pdf-parse expects a uint8array, not a Buffer
        const parser = new PDFParser(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        };
    } catch (error) {
        console.error('PDF Parsing Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
