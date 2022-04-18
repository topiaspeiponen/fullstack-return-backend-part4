const blogsRouter = require("express").Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger')

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
  response.json(blogs)
});

blogsRouter.post("/", async (request, response) => {
  const users = await User.find({})
  const firstUser = users[0]

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: firstUser.id
  }

  if (!blog.likes) {
    const modifiedBlog = new Blog({
      ...blog,
      likes: 0
    });
    const modifiedBlogResult = await modifiedBlog.save()
    firstUser.blogs = firstUser.blogs.concat(modifiedBlogResult._id)
    await firstUser.save()
    response.status(201).json(modifiedBlogResult);
  } else {
    const blogModel = new Blog(blog);
    const result = await blogModel.save()
    firstUser.blogs = firstUser.blogs.concat(result._id)
    await firstUser.save()
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
