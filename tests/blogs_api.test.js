const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/list_helper')


beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const usersWithHashedPass = await Promise.all(helper.initialUsers.map(async (user) => {
    
    const saltRounds = 5
    const passwordHash = await bcrypt.hash(user.password, saltRounds)

    return {
      ...user,
      passwordHash: passwordHash
    }
  })
  )
  
  await User.insertMany(usersWithHashedPass)
  const addedUsers = await User.find({})

  const blogsWithUserIDs = helper.initialBlogs.map(blog => {
    const blogWithUserID = {
      ... blog,
      user: addedUsers[0]._id
    }
    return blogWithUserID
  })
  await Blog.insertMany(blogsWithUserIDs)
})


describe('when there is initially some blogs saved', () => {
  let token = ''

  beforeEach(async () => {
    const response = await api.post('/api/login')
      .send({
        username: 'maketonninen',
        password: '1234'
      })
      console.log('token ', response.body)
      token = response.body.token
  })

  test('blogs are returned as proper length json', async () => {
      const response = await api.get('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')
      .set('authorization', `bearer ${token}`)
    response.body.map((blog) => expect(blog.hasOwnProperty('id')).toBeDefined())
  })

  describe('addition of a new blog', () => {

    test('add new blog', async () => {
      await api.post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 3
        })
      const responseGet = await api.get('/api/blogs')
        .set('authorization', `bearer ${token}`)
      expect(responseGet.body).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('add new blog with no token', async () => {
      await api.post('/api/blogs')
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 3
        })
        .expect(401)
    })

    test('new blog likes are set to 0 when undefined', async () => {
      await api.post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send({
          title: "Cannon to Fish",
          author: "Testi Djikstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: null
        })
      const responseGet = await api.get('/api/blogs')
        .set('authorization', `bearer ${token}`)
      const lastBlog = responseGet.body[responseGet.body.length - 1]
      expect(lastBlog.likes).toBe(0)
    })

    test('new blog post fails with no title field', async() => {
      await api.post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send({
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          author: "Testi Djikstra",
          likes: null
        })
        .expect(400)
    })

    test('new blog post fails with no url field', async () => {
      await api.post('/api/blogs')
        .set('authorization', `bearer ${token}`)
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
        .set('authorization', `bearer ${token}`)
      const putResponse = await api.put('/api/blogs/' + blogsResponse.body[0].id)
        .set('authorization', `bearer ${token}`)
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
        .set('authorization', `bearer ${token}`)
      await api.delete('/api/blogs/' + blogsResponse.body[0].id)
        .set('authorization', `bearer ${token}`)
        .expect(204)
    })

    test('deleting blog with invalid id', async () => {
      await api.delete('/api/blogs/3431' )
        .set('authorization', `bearer ${token}`)
        .expect(500)
    })
  })
})

describe('when there is initially users created', () => {


  describe('addition of a new user', () => {
    
    test('add a new user', async () => {
      await api.post('/api/users')
        .send({
          username: "Ruuvimeisseli54",
          name: "Iso keke",
          password: "4533"
      })
      const responseGet = await api.get('/api/users')
      expect(responseGet.body).toHaveLength(helper.initialUsers.length + 1)
    })

    test('adding user with non-unique username', async () => {
      await api.post('/api/users')
        .send({
          username: helper.initialUsers[0].username,
          name: "Iso keke",
          password: "4533"
        })
        .expect(400)
    })

    test('adding user with short username', async () => {
      await api.post('/api/users')
        .send({
          username: "Ke",
          name: "Iso keke",
          password: "4533"
        })
        .expect(400)
    })

    test('adding user with empty username', async () => {
      await api.post('/api/users')
        .send({
          username: "",
          name: "Iso keke",
          password: "4533"
        })
        .expect(400)
    })

    test('adding user with short password', async () => {
      await api.post('/api/users')
        .send({
          username: "Keketon",
          name: "Iso keke",
          password: "32"
        })
        .expect(400)
    })

    test('adding user with empty password', async () => {
      await api.post('/api/users')
        .send({
          username: "Ke",
          name: "Iso keke",
          password: ""
        })
        .expect(400)
    })

  })
})
  
afterAll(() => {
    mongoose.connection.close()
})