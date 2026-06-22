import express from 'express'
import { uploadDocument, 
    getDocuments,
    getDocument,
    deleteDocument,
    updateDocument,
} from '../controllers/documentController.js'
import { protect } from '../middleware/authMiddleware.js'
import upload from '../config/multer.js'


const router = express.Router()

//All routes are protected
router.use(protect)
