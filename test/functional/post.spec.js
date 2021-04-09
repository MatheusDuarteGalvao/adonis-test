'use strict'

const { test, trait, afterEach } = use('Test/Suite')('Post registration')

const Mail = use('Mail')
const User = use('App/Models/User')
const Post = use('App/Models/Post')

trait('Test/ApiClient')
trait('Auth/Client')

afterEach(async () => {
  await Post.query().delete()
  await User.query().delete()
})

test('listar nenhum post', async ({ client }) => {
  const response = await client.get('/posts').end()

  response.assertStatus(200)
  response.assertJSON([])
})

test('listar todos os posts', async ({ client }) => {

  const user = await User.create({
    username: 'matheus',
    email: 'matheusduartegalvao@gmail.com',
    password: '123456'
  })

  const post = await Post.create({
    title: 'Testando',
    content: 'Conteúdo de teste',
    user_id: user.id
  })

  const response = await client.get('/posts').end()

  response.assertStatus(200)
  response.assertJSONSubset({
    title: 'Testando',
    content: 'Conteúdo de teste',
  })
})

test('Criar um post', async ({ client }) => {

  const user = await User.create({
    username: 'matheus',
    email: 'matheusduartegalvao@gmail.com',
    password: '123456'
  })

  const response = await client.post('/posts').loginVia(user).send({
    title: 'Testando',
    content: 'Qualquer coisa',
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    title: 'Testando',
    content: 'Qualquer coisa',
  })
})
