import express from 'express'
import {
    generateFlashcards,
    generateQuiz,
    chat,
    generateSummary,
    explainConcept,
    getChatHistory
} from '../controllers/aiControllers.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/generate-flashcards', generateFlashcards)
router.post('/generate-quiz', generateQuiz)
router.post('/chat', chat)
router.post('/generate-summary', generateSummary)
router.post('/explain-concept', explainConcept)
router.get('/chat-history/:documentId', getChatHistory)

export default router