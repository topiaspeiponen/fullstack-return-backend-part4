const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const likes = blogs.reduce(
        (prev, curr) => prev + curr.likes, 0
    )
    console.log('TotalLikes ', likes)
    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const mostLikedBlog = blogs.reduce(
        (prev, curr) => (prev.likes > curr.likes) ? prev : curr
    )
    return mostLikedBlog

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
