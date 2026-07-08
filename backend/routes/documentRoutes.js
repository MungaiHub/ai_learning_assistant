import express from 'express'
import { uploadDocument, 
    getDocuments,
    getDocument,
    deleteDocument,
} from '../controllers/documentControllers.js'
import { getQuizzes } from '../controllers/quizControllers.js'
import { protect } from '../middleware/auth.js'
import upload from '../config/multer.js'


const router = express.Router()

//All routes are protected
router.use(protect)

router.post('/upload', upload.single('document'), uploadDocument)
router.get('/', getDocuments)
router.get('/:id/quizzes', getQuizzes)
router.get('/:id', getDocument)
router.delete('/:id', deleteDocument)


export default router
