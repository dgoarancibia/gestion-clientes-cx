const express = require('express')
const router = express.Router()

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ error: 'No autenticado' })
}

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})

module.exports = router
