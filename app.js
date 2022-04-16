const cors = require('cors')
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const errorHandler = require('./utils/errorHandler')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

module.exports = app