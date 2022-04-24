const tokenExtractor = (request, response, next) => {
    const authorizationHeader = request.get('authorization')
    if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
        console.log(authorizationHeader)
        request.token = authorizationHeader.substring(7)
    }
    next()
}

module.exports = tokenExtractor