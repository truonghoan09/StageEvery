const router = require('express').Router()
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken')
const { createUserProfile } = require('../controllers/users.controller')

router.post('/', verifyFirebaseToken, createUserProfile)

module.exports = router
