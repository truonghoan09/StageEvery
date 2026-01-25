const express = require('express')
const cors = require('cors')

const healthRoute = require('./routes/health.route')
const artistRoute = require('./routes/artist.route')
const authRoute = require('./routes/auth.route')
const meRoute = require('./routes/me.route')
const usersRoute = require('./routes/users.route')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoute)
app.use('/artist', artistRoute)
app.use('/auth', authRoute)
app.use('/me', meRoute)
app.use('/users', usersRoute)

module.exports = app
