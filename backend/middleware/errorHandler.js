const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors).map(val => val.message).join(', ')
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        statusCode = 400
        message = `${field} already exists `
    }

    //moongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400
        message = 'Resource not found '
    }

   //multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {   
        statusCode = 400
        message = Object.values(err.errors).map(val => val.message).join(', ')      

    }

    //Jwt errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token'
    }
    
    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token expired'
    }

    console.error('Error:',{
        message: err.message,
        stack: process.env.NODE_ENV === 'development'  ? err.stack : undefined
    })
    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode, 
        ...err(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}

export default errorHandler

