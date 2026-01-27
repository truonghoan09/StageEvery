const router = require('express').Router()
const { getMe } = require('../controllers/me.controller')
const requireAuth = require('../middlewares/requireAuth')

router.get('/', requireAuth, getMe)

module.exports = router
