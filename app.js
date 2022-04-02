const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
logger.info('Something happening ', blogsRouter)

module.exports = app