const blogsRouter = require("express").Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger')

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.likes) {
    const modifiedBlog = new Blog({
      ...request.body,
      likes: 0
    });
    const modifiedBlogResult = await modifiedBlog.save()
    response.status(201).json(modifiedBlogResult);
  } else {
    const blog = new Blog(request.body);
    const result = await blog.save()
    response.status(201).json(result);
  }
});

module.exports = blogsRouter;
