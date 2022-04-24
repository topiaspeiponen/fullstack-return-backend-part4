const blogsRouter = require("express").Router();
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger')

const getTokenFrom = (request) => {
  const authorizationHeader = request.get('authorization')
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return authorizationHeader.substring(7)
  }
  return null
}


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
  response.json(blogs)
});

blogsRouter.post("/", async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  }

  if (!blog.likes) {
    const modifiedBlog = new Blog({
      ...blog,
      likes: 0
    });
    const modifiedBlogResult = await modifiedBlog.save()
    user.blogs = user.blogs.concat(modifiedBlogResult._id)
    await user.save()
    response.status(201).json(modifiedBlogResult);
  } else {
    const blogModel = new Blog(blog);
    const result = await blogModel.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  console.log('put result ', result)
  response.status(201).json(result);
})

blogsRouter.delete("/:id", async (request, response) => {
  const deleteResponse = await Blog.deleteOne({_id: request.params.id})
  if (deleteResponse.deletedCount === 0) {
    response.status(404).end()
  } else {
    response.status(204).end()
  }
})

module.exports = blogsRouter;
