import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, user not found',     //Token is genuinely valid, but no matching user in the database
          statusCode: 401,
        })
      }

      next()
    } catch (error) {
      const expired = error.name === 'TokenExpiredError'
      return res.status(401).json({
        success: false,
        error: expired
          ? 'Session expired. Please log in again.'
          : 'Not authorized, token invalid',
        statusCode: 401,
      })
    }
  } else {
    return res.status(401).json({
      success: false,                          //No Authorization header, or it doesn't start with Bearer
      error: 'Not authorized, no token',
      statusCode: 401,
    })
  }
}
