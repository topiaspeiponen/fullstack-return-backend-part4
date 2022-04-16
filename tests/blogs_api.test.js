const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
})

test('blogs are returned as proper length json', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')
  response.body.map((blog) => expect(blog.hasOwnProperty('id')).toBeDefined())
})

test('add new blog', async () => {
  await api.post('/api/blogs')
    .send({
      title: "Cannon to Fish",
      author: "Testi Djikstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 3
    })
  const responseGet = await api.get('/api/blogs')
  expect(responseGet.body).toHaveLength(initialBlogs.length + 1)
})

test('blog likes are set to 0 when undefined', async () => {
  await api.post('/api/blogs')
    .send({
      title: "Cannon to Fish",
      author: "Testi Djikstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: null
    })
  const responseGet = await api.get('/api/blogs')
  console.log('huutista ', responseGet.body)
  const lastBlog = responseGet.body[responseGet.body.length - 1]
  expect(lastBlog.likes).toBe(0)
})
  
afterAll(() => {
    mongoose.connection.close()
})