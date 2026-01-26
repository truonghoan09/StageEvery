const router = require('express').Router()
const { sendMagicLink, markLoginSuccess,} = require('../controllers/auth.controller')

router.post('/send-magic-link', sendMagicLink)
router.post('/login-success', markLoginSuccess)

module.exports = router
