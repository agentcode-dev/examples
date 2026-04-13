import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { resourceConfig, type ResourceModelConfig } from '#config/resources'

/**
 * Generic CRUD controller for all tenant-scoped resources.
 * Reads model configuration from config/resources.ts and resolves
 * models lazily to handle CRUD operations.
 */
export default class ResourcesController {
  /**
   * LIST — GET /:org_slug/:resource
   */
  async index(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'index')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const query = config.model.query()
    this.applyOrgScope(ctx, config, query)
    this.applySoftDeleteScope(query)
    this.applyMemberScope(ctx, config, query)

    const records = await query.orderBy('created_at', 'desc')
    const serialized = records.map((r) => this.hideFields(ctx, config, r.serialize()))

    return { data: serialized }
  }

  /**
   * SHOW — GET /:org_slug/:resource/:id
   */
  async show(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'show')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const record = await this.findRecord(ctx, config)
    if (!record) return ctx.response.notFound({ error: 'Not found' })

    return { data: this.hideFields(ctx, config, record.serialize()) }
  }

  /**
   * STORE — POST /:org_slug/:resource
   */
  async store(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'store')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const body = ctx.request.body()
    const filtered = this.filterWritableFields(ctx, config, body, 'store')

    // Auto-set organization_id for direct tenant models
    if (config.belongsToOrganization) {
      filtered.organizationId = ctx.organization.id
    }

    // Auto-set user_id for comments
    if (config.autoSetUserId) {
      filtered.userId = ctx.auth.getUserOrFail().id
    }

    // Cross-tenant FK validation
    const fkError = await this.validateCrossTenantFKs(ctx, config, filtered)
    if (fkError) return ctx.response.unprocessableEntity({ error: fkError })

    const record = await config.model.create(filtered)

    ctx.response.status(201)
    return { data: this.hideFields(ctx, config, record.serialize()) }
  }

  /**
   * UPDATE — PUT /:org_slug/:resource/:id
   */
  async update(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'update')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const record = await this.findRecord(ctx, config)
    if (!record) return ctx.response.notFound({ error: 'Not found' })

    // Member can only update own tasks/comments
    if (this.getRoleName(ctx) === 'member') {
      if (config.slug === 'tasks' && record.assigneeId !== ctx.auth.getUserOrFail().id) {
        return ctx.response.forbidden({ error: 'Forbidden' })
      }
      if (config.slug === 'comments' && record.userId !== ctx.auth.getUserOrFail().id) {
        return ctx.response.forbidden({ error: 'Forbidden' })
      }
    }

    const body = ctx.request.body()
    const filtered = this.filterWritableFields(ctx, config, body, 'update')

    // Cross-tenant FK validation
    const fkError = await this.validateCrossTenantFKs(ctx, config, filtered)
    if (fkError) return ctx.response.unprocessableEntity({ error: fkError })

    record.merge(filtered)
    await record.save()

    return { data: this.hideFields(ctx, config, record.serialize()) }
  }

  /**
   * DESTROY — DELETE /:org_slug/:resource/:id (soft delete)
   */
  async destroy(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'destroy')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const record = await this.findRecord(ctx, config)
    if (!record) return ctx.response.notFound({ error: 'Not found' })

    // Member can only delete own comments
    if (this.getRoleName(ctx) === 'member') {
      if (config.slug === 'comments' && record.userId !== ctx.auth.getUserOrFail().id) {
        return ctx.response.forbidden({ error: 'Forbidden' })
      }
    }

    if (config.softDeletes) {
      record.deletedAt = DateTime.now()
      await record.save()
    } else {
      await record.delete()
    }

    return ctx.response.noContent()
  }

  /**
   * TRASHED — GET /:org_slug/:resource/trashed
   */
  async trashed(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'trashed')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const query = config.model.query()
    this.applyOrgScope(ctx, config, query)
    query.whereNotNull('deleted_at')

    const records = await query.orderBy('created_at', 'desc')
    const serialized = records.map((r) => this.hideFields(ctx, config, r.serialize()))

    return { data: serialized }
  }

  /**
   * RESTORE — POST /:org_slug/:resource/:id/restore
   */
  async restore(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    if (!this.checkPermission(ctx, config.slug, 'restore')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const query = config.model.query()
    this.applyOrgScope(ctx, config, query)
    query.whereNotNull('deleted_at')
    query.where(config.primaryKey || 'id', ctx.params.id)
    const record = await query.first()

    if (!record) return ctx.response.notFound({ error: 'Not found' })

    record.deletedAt = null
    await record.save()

    return { data: this.hideFields(ctx, config, record.serialize()) }
  }

  /**
   * FORCE DELETE — DELETE /:org_slug/:resource/:id/force-delete
   */
  async forceDelete(ctx: HttpContext) {
    const config = this.resolveConfig(ctx)
    if (!config) return ctx.response.notFound({ error: 'Resource not found' })

    // Check if forceDelete is excluded
    if (config.exceptActions?.includes('forceDelete')) {
      return ctx.response.notFound({ error: 'Not found' })
    }

    if (!this.checkPermission(ctx, config.slug, 'forceDelete')) {
      return ctx.response.forbidden({ error: 'Forbidden' })
    }

    const query = config.model.query()
    this.applyOrgScope(ctx, config, query)
    query.where(config.primaryKey || 'id', ctx.params.id)
    const record = await query.first()

    if (!record) return ctx.response.notFound({ error: 'Not found' })

    await record.delete()

    return ctx.response.noContent()
  }

  // ---------------------------------------------------------------
  // Helper methods
  // ---------------------------------------------------------------

  private resolveConfig(ctx: HttpContext): ResourceModelConfig | undefined {
    const resourceSlug = ctx.params.resource
    return resourceConfig[resourceSlug]
  }

  private getRoleName(ctx: HttpContext): string {
    return ctx.userRole?.role?.slug ?? 'viewer'
  }

  private checkPermission(ctx: HttpContext, resource: string, action: string): boolean {
    const userRole = ctx.userRole
    if (!userRole) return false

    const permissions: string[] = userRole.permissions || []

    // Wildcard
    if (permissions.includes('*')) return true

    // Resource wildcard
    if (permissions.includes(`${resource}.*`)) return true

    // Specific permission
    if (permissions.includes(`${resource}.${action}`)) return true

    return false
  }

  private applyOrgScope(ctx: HttpContext, config: ResourceModelConfig, query: any) {
    if (config.belongsToOrganization) {
      query.where('organization_id', ctx.organization.id)
    } else if (config.orgScopeThrough) {
      // Indirect tenant via join
      const through = config.orgScopeThrough
      query.whereHas(through.relation, (q: any) => {
        if (through.nestedRelation) {
          q.whereHas(through.nestedRelation, (q2: any) => {
            q2.where('organization_id', ctx.organization.id)
          })
        } else {
          q.where('organization_id', ctx.organization.id)
        }
      })
    }
  }

  private applySoftDeleteScope(query: any) {
    query.whereNull('deleted_at')
  }

  private applyMemberScope(ctx: HttpContext, config: ResourceModelConfig, query: any) {
    if (config.slug === 'tasks' && this.getRoleName(ctx) === 'member') {
      query.where('assignee_id', ctx.auth.getUserOrFail().id)
    }
  }

  /**
   * Convert all keys in an object from camelCase to snake_case.
   * Also removes timestamps (created_at, updated_at, deleted_at) to match
   * Laravel/Rails response format which excludes them by default.
   */
  private toSnakeCase(data: any): any {
    const result: any = {}
    const excludeKeys = new Set(['createdAt', 'updatedAt', 'deletedAt', 'created_at', 'updated_at', 'deleted_at'])

    for (const [key, value] of Object.entries(data)) {
      if (excludeKeys.has(key)) continue
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      result[snakeKey] = value instanceof DateTime ? value.toISO() : value
    }
    return result
  }

  private hideFields(ctx: HttpContext, config: ResourceModelConfig, data: any): any {
    // First convert to snake_case (matching Laravel/Rails format)
    const snaked = this.toSnakeCase(data)

    const roleName = this.getRoleName(ctx)
    const hiddenFields = config.hiddenFields?.[roleName]
    if (!hiddenFields || hiddenFields.length === 0) return snaked

    const result = { ...snaked }
    for (const field of hiddenFields) {
      delete result[field]
    }
    return result
  }

  private filterWritableFields(
    ctx: HttpContext,
    config: ResourceModelConfig,
    body: any,
    action: 'store' | 'update'
  ): any {
    const roleName = this.getRoleName(ctx)
    const writableFields =
      action === 'store'
        ? config.writableFields?.store?.[roleName]
        : config.writableFields?.update?.[roleName]

    if (!writableFields) return {}

    const filtered: any = {}
    for (const field of writableFields) {
      // Accept both snake_case and camelCase from the request body
      const camel = field.replace(/_([a-z])/g, (_: any, c: string) => c.toUpperCase())
      if (field in body) {
        filtered[camel] = body[field]
      } else if (camel in body) {
        filtered[camel] = body[camel]
      }
    }

    return filtered
  }

  private async validateCrossTenantFKs(
    ctx: HttpContext,
    config: ResourceModelConfig,
    data: any
  ): Promise<string | null> {
    if (!config.crossTenantFKs) return null

    for (const fk of config.crossTenantFKs) {
      const camelKey = fk.field.replace(/_([a-z])/g, (_: any, c: string) => c.toUpperCase())
      const value = data[camelKey] || data[fk.field]
      if (!value) continue

      const mod = await fk.model()
      const Model = mod.default || mod
      const query = Model.query().where('id', value)

      if (fk.orgField) {
        query.where(fk.orgField, ctx.organization.id)
      } else if (fk.orgThroughRelation) {
        // For indirect validation (e.g., task -> project -> org)
        query.whereHas(fk.orgThroughRelation, (q: any) => {
          q.where('organization_id', ctx.organization.id)
            .whereNull('deleted_at')
        })
      }

      query.whereNull('deleted_at')
      const record = await query.first()

      if (!record) {
        return `The ${fk.field} does not belong to this organization.`
      }
    }

    return null
  }

  private async findRecord(ctx: HttpContext, config: ResourceModelConfig) {
    const query = config.model.query()
    this.applyOrgScope(ctx, config, query)
    this.applySoftDeleteScope(query)
    query.where(config.primaryKey || 'id', ctx.params.id)
    return query.first()
  }
}
