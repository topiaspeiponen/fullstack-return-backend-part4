const cors = require('cors')
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const logger = require('./utils/logger')
const tokenExtractor = require('./utils/tokenExtractor')
const errorHandler = require('./utils/errorHandler')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

module.exports = app