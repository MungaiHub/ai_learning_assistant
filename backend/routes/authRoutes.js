import express from 'express'
import { register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

//validation mildware
const registervaliidation = [
    body('username')
    .trim()
    .isLegth({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
]

//public routes
router.post('/register', registervaliidation, register)
router.post('/login', loginValidation, login)

//protected routes
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/change-password', protect, changePassword)

export default router
