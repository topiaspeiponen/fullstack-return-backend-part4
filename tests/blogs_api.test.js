const mongoose = require('mongoose')
const supertest = require('supertest')
const { put } = require('../app')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/list_helper')


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as proper length json', async () => {
      const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    response.body.map((blog) => expect(blog.hasOwnProperty('id')).toBeDefined())
  })

  describe('addition of a new blog', () => {

    test('add new blog', async () => {
      await api.post('/api/blogs')
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 3
        })
      const responseGet = await api.get('/api/blogs')
      expect(responseGet.body).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('new blog likes are set to 0 when undefined', async () => {
      await api.post('/api/blogs')
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: null
        })
      const responseGet = await api.get('/api/blogs')
      const lastBlog = responseGet.body[responseGet.body.length - 1]
      expect(lastBlog.likes).toBe(0)
    })

    test('new blog post fails with no title field', async() => {
      await api.post('/api/blogs')
        .send({
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          author: "Testi Djikstra",
          likes: null
        })
        .expect(400)
    })

    test('new blog post fails with no url field', async () => {
      await api.post('/api/blogs')
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          likes: null
        })
        .expect(400)
    })
  })

  describe('editing of a blog', () => {
    test('edit a blog', async () => {
      const editedBlog = {
        title: "Cannon to Fish",
        author: "Testi Djikstra",
        url: "www.yle.fi",
        likes: 20
      }

      const blogsResponse = await api.get('/api/blogs')
      const putResponse = await api.put('/api/blogs/' + blogsResponse.body[0].id)
        .send(editedBlog)
      expect(putResponse.body).toMatchObject(editedBlog)
    })
    test('edited blog with invalid id', async () => {
      const editedBlog = {
        title: "Cannon to Fish",
        author: "Testi Djikstra",
        url: "www.yle.fi",
        likes: 20
      }

      await api.put('/api/blogs/invalidID111')
        .send(editedBlog)
      expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('delete a blog', async () => {
      const blogsResponse = await api.get('/api/blogs')
      await api.delete('/api/blogs/' + blogsResponse.body[0].id)
        .expect(204)
    })

    test('deleting blog with invalid id', async () => {
      await api.delete('/api/blogs/3431' )
        .expect(500)
    })
  })
})
  
afterAll(() => {
    mongoose.connection.close()
})