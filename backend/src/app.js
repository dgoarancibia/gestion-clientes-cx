require('dotenv').config()

const requiredEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'ALLOWED_EMAIL', 'SESSION_SECRET', 'FRONTEND_URL']
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Variable de entorno faltante: ${key}`)
    process.exit(1)
  }
}

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')

const app = express()

app.set('trust proxy', 1)

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  },
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`))
