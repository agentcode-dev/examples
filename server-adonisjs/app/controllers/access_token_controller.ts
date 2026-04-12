import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccessTokenController {
  async store({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.badRequest({ error: 'Email and password are required' })
    }

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return {
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
          },
          token: token.value!.release(),
        },
      }
    } catch {
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return response.ok({ message: 'Logged out successfully' })
  }
}
