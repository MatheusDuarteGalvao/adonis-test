'use strict'

const { test, trait, afterEach } = use('Test/Suite')('User registration')

const Mail = use('Mail')
const User = use('App/Models/User')

trait('Test/ApiClient')

afterEach(async () => {
  await User.query().delete()
})

test('criar um usuário', async ({ client, assert }) => {

  Mail.fake()

  const response = await client.post('/users').send({
    username: 'duarte',
    email: 'matheusduartegalvao@gmail.com',
    password: 'mimdepapai'
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    username: 'duarte',
    email: 'matheusduartegalvao@gmail.com',
  })

  const user = await User.find(1)

  assert.equal(user.toJSON().email, 'matheusduartegalvao@gmail.com')

  Mail.restore()
})

test('Não criar um novo usuário', async({ client, assert }) => {
  Mail.fake()

  const response = await client.post('/users').end()

  response.assertStatus(500)
  const user = await User.findBy('email', 'matheusduartegalvao@gmail.com.br')

  assert.isNull(user)

  Mail.restore()
})
