import mongoose from 'mongoose'

let memoryServer

const connectWithUri = async (uri) => {
  const conn = await mongoose.connect(uri)
  console.log(`MongoDB Connected: ${conn.connection.host}`)
}

const startMemoryMongo = async () => {
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: 'ai_learning_assistant' },
  })
  return memoryServer.getUri()
}

const isRecoverableDevFailure = (message) =>
  /ENOTFOUND|querySrv|ECONNREFUSED|ETIMEOUT|ENETUNREACH/.test(message)

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim()

  if (!uri) {
    console.error('Error connecting to MongoDB: MONGODB_URI is not defined in .env')
    process.exit(1)
  }

  try {
    await connectWithUri(uri)
    return
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && isRecoverableDevFailure(error.message)) {
      console.warn(`MongoDB connection failed: ${error.message}`)
      console.warn(
        'Atlas hostname could not be resolved. Starting in-memory MongoDB for local development.'
      )
      console.warn(
        'To use Atlas again, copy a current connection string from MongoDB Atlas into MONGODB_URI.'
      )

      try {
        await connectWithUri(await startMemoryMongo())
        return
      } catch (memoryError) {
        console.error(`Failed to start in-memory MongoDB: ${memoryError.message}`)
      }
    }

    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
