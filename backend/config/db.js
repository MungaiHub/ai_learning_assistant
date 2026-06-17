import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim()

  if (!uri) {
    console.error('Error connecting to MongoDB: MONGODB_URI is not defined in .env')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
