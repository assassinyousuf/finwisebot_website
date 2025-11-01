// scripts/seed-admin.js
// Creates an admin user in MongoDB using MONGODB_URI from .env.local

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI not set in environment (.env.local?)')
  process.exit(2)
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function question(q){ return new Promise(res=> rl.question(q, ans=> res(ans))) }

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String },
  roles: { type: [String], default: [] },
  lastLogin: { type: Date },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

;(async ()=>{
  try{
    await mongoose.connect(uri, { bufferCommands: false })
    console.log('Connected to MongoDB')

    let email = process.env.ADMIN_EMAIL
    let password = process.env.ADMIN_PASSWORD
    if (!email) email = await question('Admin email: ')
    if (!password) password = await question('Admin password: ')
    rl.close()

    if (!email || !password) {
      console.error('Email and password are required')
      process.exit(3)
    }

    const existing = await User.findOne({ email })
    if (existing) {
      console.log('User already exists. Promoting to admin.')
      existing.roles = Array.from(new Set([...(existing.roles||[]), 'admin']))
      await existing.save()
      console.log('Promoted existing user to admin:', email)
      process.exit(0)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const u = new User({ email, passwordHash, roles: ['admin'], verified: true })
    await u.save()
    console.log('Created admin user:', email)
    process.exit(0)
  }catch(err){
    console.error('Error seeding admin:', err)
    process.exit(1)
  }
})()
