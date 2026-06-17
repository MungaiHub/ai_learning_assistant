import express from 'express'
import { body, validationResult } from 'express-validator'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authControllers.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array().map((e) => e.msg).join(', '),
      statusCode: 400,
    })
  }
  next()
}

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]
