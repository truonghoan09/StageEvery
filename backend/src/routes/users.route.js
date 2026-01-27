const router = require('express').Router()
const { createUserProfile } = require('../controllers/users.controller')
const requireAuth = require('../middlewares/requireAuth')

router.post('/', requireAuth, createUserProfile)

module.exports = router
