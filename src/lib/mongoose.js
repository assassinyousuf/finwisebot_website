import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  // Don't throw here to allow non-mongo usage in some dev flows, but warn
  console.warn('MONGODB_URI not set; MongoDB disabled')
}

/**
 * Next.js hot-reloading can call modules multiple times.
 * Cache the connection on the global object to reuse between calls.
 */
let cached = global.mongoose

if (!cached) cached = global.mongoose = { conn: null, promise: null }

async function dbConnect() {
  if (!MONGODB_URI) return null

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {
      // Recommended options for Mongoose 6+ are handled by mongoose defaults
      bufferCommands: false,
      autoIndex: true,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
