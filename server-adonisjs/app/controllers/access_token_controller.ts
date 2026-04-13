import User from '#models/user'
import UserRole from '#models/user_role'
import Organization from '#models/organization'
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

      // Find the user's first organization slug (matches Laravel/Rails format)
      let organizationSlug: string | null = null
      const userRole = await UserRole.query().where('user_id', user.id).first()
      if (userRole) {
        const org = await Organization.find(userRole.organizationId)
        if (org) {
          organizationSlug = org.slug
        }
      }

      return {
        token: token.value!.release(),
        organization_slug: organizationSlug,
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
