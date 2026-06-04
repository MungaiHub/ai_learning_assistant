import iwt from 'jsonwebtoken'
import User from '../models/User.js'

// generete jwt tokens
const generateToken = (id) => {
    return jwt.sign({ id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET ||'7d' })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        //check if user exists
        const userExists = await User.findOne({ email })
        if(userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
                statusCode: 400
            })
        }

        //create new user  