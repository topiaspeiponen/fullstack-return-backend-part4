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
    const blogAuthors = _.map(blogs, 'author')
    const authorWithMostBlogsArray = _(blogAuthors)
    .countBy()
    .entries()
    .maxBy(_.last)
    const writerObject = {
        author: authorWithMostBlogsArray[0],
        blogs: authorWithMostBlogsArray[1]
    }
    return writerObject
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const blogAuthors = _.map(blogs, blog => { 
        return {author: blog.author, likes: blog.likes}
    })
    const mergedBlogsByAuthor = _.keyBy(blogAuthors, 'author')
    console.log('blog authors ', blogAuthors)
    console.log('merged authors ', mergedBlogsByAuthor)
    return blogAuthors
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
