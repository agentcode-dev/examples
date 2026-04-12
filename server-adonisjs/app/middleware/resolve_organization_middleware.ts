import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Organization from '#models/organization'
import UserRole from '#models/user_role'

/**
 * Resolves the organization from the route's :org_slug parameter.
 * Verifies the authenticated user belongs to the organization.
 * Sets ctx.organization and ctx.userRole for downstream use.
 */
export default class ResolveOrganizationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const orgSlug = ctx.params.org_slug

    if (!orgSlug) {
      return ctx.response.notFound({ error: 'Organization not found' })
    }

    const org = await Organization.query()
      .where('slug', orgSlug)
      .whereNull('deleted_at')
      .first()

    if (!org) {
      return ctx.response.notFound({ error: 'Organization not found' })
    }

    const user = ctx.auth.getUserOrFail()

    const userRole = await UserRole.query()
      .where('user_id', user.id)
      .where('organization_id', org.id)
      .preload('role')
      .first()

    if (!userRole) {
      return ctx.response.notFound({ error: 'Organization not found' })
    }

    // Attach to context for downstream use
    ctx.organization = org
    ctx.userRole = userRole

    return next()
  }
}

/**
 * Type augmentation for HttpContext to include organization context.
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    organization: InstanceType<typeof Organization>
    userRole: InstanceType<typeof UserRole>
  }
}
