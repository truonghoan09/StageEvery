const router = require('express').Router()
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken')
const { getMe } = require('../controllers/me.controller')

router.get('/', verifyFirebaseToken, getMe)

module.exports = router
