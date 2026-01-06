const express = require('express')
const cors = require('cors')

const healthRoute = require('./routes/health.route')
const artistRoute = require('./routes/artist.route')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoute)
app.use('/artist', artistRoute)

module.exports = app
