const _ = require('lodash');

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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const blogWriters = _.map(blogs, 'author')
    const writerWithMostBlogsArray = _(blogWriters)
    .countBy()
    .entries()
    .maxBy(_.last)
    const writerObject = {
        author: writerWithMostBlogsArray[0],
        blogs: writerWithMostBlogsArray[1]
    }
    return writerObject
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
