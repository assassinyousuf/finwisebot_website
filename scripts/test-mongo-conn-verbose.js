// Verbose MongoDB connection tester using Mongoose
// Usage: node scripts/test-mongo-conn-verbose.js

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const dns = require('dns')
const util = require('util')

const resolveSrv = util.promisify(dns.resolveSrv)

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || '(not-set)'

function maskUri(u){
  if (!u) return '(not set)'
  try{
    // mask password if present
    return u.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$3:****@')
  }catch(e){return u}
}

console.log('MONGODB_URI (masked):', maskUri(uri))
console.log('MONGODB_DB:', dbName)

if (!uri) {
  console.error('\nERROR: MONGODB_URI not set in environment (.env.local?)')
  process.exit(2)
}

(async function(){
  try{
    if (uri.startsWith('mongodb+srv://')){
      // extract host for SRV
      const host = uri.replace('mongodb+srv://', '').split('/')[0]
      const hostOnly = host.split('@').pop()
      console.log('Detected SRV URI. Resolving SRV for host:', hostOnly)
      try{
        const records = await resolveSrv('_mongodb._tcp.' + hostOnly)
        console.log('SRV records:', records)
      }catch(e){
        console.warn('SRV DNS lookup failed:', e.message)
      }
    }

    mongoose.set('strictQuery', false)
    // attempt connection
    console.log('\nAttempting mongoose.connect...')
    const conn = await mongoose.connect(uri, { bufferCommands: false, connectTimeoutMS: 10000 })
    console.log('Connected via mongoose. host:', conn.connection.host, 'name:', conn.connection.name)
    await mongoose.disconnect()
    console.log('Disconnected cleanly.')
    process.exit(0)
  }catch(err){
    console.error('\nConnection attempt failed:')
    console.error('name:', err.name)
    console.error('message:', err.message)
    if (err.code) console.error('code:', err.code)
    if (err.reason) console.error('reason:', err.reason)
    if (err.stack) console.error('\nstack:\n', err.stack)
    // also print mongoose connection readyState
    try{ console.error('\nmongoose.connection.readyState=', mongoose.connection.readyState) }catch(e){}
    process.exit(1)
  }
})()
