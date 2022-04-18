const _ = require('lodash');

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    }
  ];

const initialUsers = [
    {
        username: "maketonninen",
        name: "Iso Make",
        password: "1234"
    },
    {
        username: "eioomake",
        name: "Pieni Make",
        password: "4321"
    },
    {
        username: "ankka",
        name: "Keskikokoinen Ankka",
        password: "0000"
    },
]

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
    const mergedBlogsByAuthor = _.merge(_.keyBy(blogAuthors, 'author'))
    console.log('blog authors ', blogAuthors)
    console.log('merged authors ', mergedBlogsByAuthor)
    return blogAuthors
}

module.exports = {
  initialBlogs,
  initialUsers,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
