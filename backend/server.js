import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import path from 'path'
import { connect } from 'http2'
import { error } from 'console'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'

// ES6 module__dirname alternative
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//initialize express app
const app = express()

//connect to MongoDB
connectDB()

//middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//statiic folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//routes
app.use('/api/auth', authRoutes)


app.use(errorHandler)

//404 handler
app.use((reg, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Route not found' ,
        statusCode: 404
    })
})

//start server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.NODE_ENV} mode on port ${PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    process.exit(1)
    })
