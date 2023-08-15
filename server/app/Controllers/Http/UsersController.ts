import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query().orderBy('username', 'asc')

      const userGroupedByInitialLetter = {}

      users.forEach((user) => {
        const initialLetter = user.username.charAt(0).toUpperCase()
        if (!userGroupedByInitialLetter[initialLetter]) {
          userGroupedByInitialLetter[initialLetter] = []
        }
        userGroupedByInitialLetter[initialLetter].push(user)
      })

      return response.status(200).json({ users: userGroupedByInitialLetter })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
}
