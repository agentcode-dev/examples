import Project from '#models/project'
import Task from '#models/task'
import Comment from '#models/comment'
import Label from '#models/label'

export interface CrossTenantFK {
  field: string
  model: () => Promise<any>
  orgField?: string
  orgThroughRelation?: string
}

export interface ResourceModelConfig {
  slug: string
  model: any
  primaryKey?: string
  belongsToOrganization: boolean
  softDeletes: boolean
  autoSetUserId?: boolean
  exceptActions?: string[]
  orgScopeThrough?: {
    relation: string
    nestedRelation?: string
  }
  hiddenFields?: Record<string, string[]>
  writableFields?: {
    store?: Record<string, string[]>
    update?: Record<string, string[]>
  }
  crossTenantFKs?: CrossTenantFK[]
}

/**
 * Resource configuration for all tenant-scoped CRUD resources.
 * This is the AdonisJS equivalent of Laravel's agentcode config.
 */
export const resourceConfig: Record<string, ResourceModelConfig> = {
  projects: {
    slug: 'projects',
    model: Project,
    belongsToOrganization: true,
    softDeletes: true,
    hiddenFields: {
      manager: ['internal_notes'],
      member: ['budget', 'internal_notes'],
      viewer: ['budget', 'internal_notes'],
    },
    writableFields: {
      store: {
        owner: ['title', 'description', 'status', 'budget', 'internal_notes', 'starts_at', 'ends_at'],
        admin: ['title', 'description', 'status', 'budget', 'internal_notes', 'starts_at', 'ends_at'],
        manager: ['title', 'description', 'status', 'starts_at', 'ends_at'],
      },
      update: {
        owner: ['title', 'description', 'status', 'budget', 'internal_notes', 'starts_at', 'ends_at'],
        admin: ['title', 'description', 'status', 'budget', 'internal_notes', 'starts_at', 'ends_at'],
        manager: ['title', 'description', 'status', 'starts_at', 'ends_at'],
      },
    },
  },

  tasks: {
    slug: 'tasks',
    model: Task,
    belongsToOrganization: false,
    softDeletes: true,
    orgScopeThrough: {
      relation: 'project',
    },
    hiddenFields: {
      member: ['estimated_hours'],
      viewer: ['estimated_hours'],
    },
    writableFields: {
      store: {
        owner: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        admin: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        manager: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        member: ['title', 'description', 'status', 'due_date', 'project_id'],
      },
      update: {
        owner: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        admin: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        manager: ['title', 'description', 'status', 'priority', 'estimated_hours', 'due_date', 'project_id', 'assignee_id'],
        member: ['status', 'description'],
      },
    },
    crossTenantFKs: [
      {
        field: 'project_id',
        model: () => import('#models/project'),
        orgField: 'organization_id',
      },
    ],
  },

  comments: {
    slug: 'comments',
    model: Comment,
    primaryKey: 'id',
    belongsToOrganization: false,
    softDeletes: true,
    autoSetUserId: true,
    orgScopeThrough: {
      relation: 'task',
      nestedRelation: 'project',
    },
    writableFields: {
      store: {
        owner: ['body', 'task_id'],
        admin: ['body', 'task_id'],
        manager: ['body', 'task_id'],
        member: ['body', 'task_id'],
      },
      update: {
        owner: ['body'],
        admin: ['body'],
        manager: ['body'],
        member: ['body'],
      },
    },
    crossTenantFKs: [
      {
        field: 'task_id',
        model: () => import('#models/task'),
        orgThroughRelation: 'project',
      },
    ],
  },

  labels: {
    slug: 'labels',
    model: Label,
    belongsToOrganization: true,
    softDeletes: true,
    exceptActions: ['forceDelete'],
    writableFields: {
      store: {
        owner: ['name', 'color'],
        admin: ['name', 'color'],
        manager: ['name', 'color'],
      },
      update: {
        owner: ['name', 'color'],
        admin: ['name', 'color'],
        manager: ['name', 'color'],
      },
    },
  },
}
