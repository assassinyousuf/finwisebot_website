import dbConnect from '../../lib/mongoose'

export default async function handler(req, res) {
  try {
    console.log('Testing DB connection...')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI?.substring(0, 20) + '...')

    const connection = await dbConnect()

    if (connection) {
      console.log('DB connected successfully')
      res.status(200).json({
        success: true,
        message: 'Database connected',
        dbName: connection.db.databaseName,
        host: connection.host
      })
    } else {
      console.log('DB connection returned null')
      res.status(500).json({
        success: false,
        message: 'Database connection failed - no URI'
      })
    }
  } catch (error) {
    console.error('DB test error:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    })
  }
}