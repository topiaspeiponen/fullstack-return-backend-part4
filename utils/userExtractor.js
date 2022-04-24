const User = require('../models/user');
const jwt = require('jsonwebtoken')

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response
        .status(401)
        .json({ error: 'token missing or invalid' })
        .end()
    }
    const user = await User.findById(decodedToken.id)
    console.log('user extractor ', user)
    request.user = user
    next()
}

module.exports = userExtractor