const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : 'http://localhost:3001/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0]?.value
  if (email !== process.env.ALLOWED_EMAIL) {
    return done(null, false, { message: 'Acceso no autorizado' })
  }
  return done(null, {
    id: profile.id,
    name: profile.displayName,
    email,
    photo: profile.photos?.[0]?.value,
  })
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
