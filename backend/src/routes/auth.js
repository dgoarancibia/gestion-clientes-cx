const express = require('express')
const passport = require('passport')
require('../passport')

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}?error=unauthorized` }),
  (req, res) => res.redirect(process.env.FRONTEND_URL)
)

router.post('/logout', (req, res) => {
  req.logout(() => res.json({ ok: true }))
})

module.exports = router
