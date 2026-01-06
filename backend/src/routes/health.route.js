const router = require('express').Router()

router.get('/', (_, res) => {
  res.send('StageEvery Backend OK')
})

module.exports = router
