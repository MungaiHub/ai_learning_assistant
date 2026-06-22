import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utilis/pdfParser.js'
import { chunkText } from '../utilis/textChunker.js'
import fs from 'fs/promises';
import mongoose from 'mongoose';

//@des  upload PDF document
//@route POST /api/documents/upload
//access Private
export const uploadDocument = async (req, res, next) => {
    try {

    }catch (error) {
        // clean up file on error
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
}
