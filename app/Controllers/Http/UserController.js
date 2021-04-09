'use strict'

const User = use('App/Models/User')

const Mail = use('Mail')

class UserController {

  async store({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }
}

module.exports = UserController
