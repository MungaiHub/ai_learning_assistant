import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? 'Email already exists'
            : 'Username already exists',
        statusCode: 400,
      })
    }

    const user = await User.create({ username, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'User registered successfully',
      statusCode: 201,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
        statusCode: 400,
      })
    }
    //check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        statusCode: 401,
      })
    }

    //check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        statusCode: 401,
      })
    }

    //generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      token,
      message: 'Login successful',
      statusCode: 200,
    })

  } catch (error) {
    next(error)
  }
}
