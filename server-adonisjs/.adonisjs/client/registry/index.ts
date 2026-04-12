/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'access_token.store': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_token.store']['types'],
  },
  'access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_token.destroy']['types'],
  },
  'resources.trashed': {
    methods: ["GET","HEAD"],
    pattern: '/api/:org_slug/:resource/trashed',
    tokens: [{"old":"/api/:org_slug/:resource/trashed","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/trashed","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/trashed","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/trashed","type":0,"val":"trashed","end":""}],
    types: placeholder as Registry['resources.trashed']['types'],
  },
  'resources.restore': {
    methods: ["POST"],
    pattern: '/api/:org_slug/:resource/:id/restore',
    tokens: [{"old":"/api/:org_slug/:resource/:id/restore","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/:id/restore","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/:id/restore","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/:id/restore","type":1,"val":"id","end":""},{"old":"/api/:org_slug/:resource/:id/restore","type":0,"val":"restore","end":""}],
    types: placeholder as Registry['resources.restore']['types'],
  },
  'resources.force_delete': {
    methods: ["DELETE"],
    pattern: '/api/:org_slug/:resource/:id/force-delete',
    tokens: [{"old":"/api/:org_slug/:resource/:id/force-delete","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/:id/force-delete","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/:id/force-delete","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/:id/force-delete","type":1,"val":"id","end":""},{"old":"/api/:org_slug/:resource/:id/force-delete","type":0,"val":"force-delete","end":""}],
    types: placeholder as Registry['resources.force_delete']['types'],
  },
  'resources.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/:org_slug/:resource',
    tokens: [{"old":"/api/:org_slug/:resource","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource","type":1,"val":"resource","end":""}],
    types: placeholder as Registry['resources.index']['types'],
  },
  'resources.store': {
    methods: ["POST"],
    pattern: '/api/:org_slug/:resource',
    tokens: [{"old":"/api/:org_slug/:resource","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource","type":1,"val":"resource","end":""}],
    types: placeholder as Registry['resources.store']['types'],
  },
  'resources.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/:org_slug/:resource/:id',
    tokens: [{"old":"/api/:org_slug/:resource/:id","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['resources.show']['types'],
  },
  'resources.update': {
    methods: ["PUT"],
    pattern: '/api/:org_slug/:resource/:id',
    tokens: [{"old":"/api/:org_slug/:resource/:id","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['resources.update']['types'],
  },
  'resources.destroy': {
    methods: ["DELETE"],
    pattern: '/api/:org_slug/:resource/:id',
    tokens: [{"old":"/api/:org_slug/:resource/:id","type":0,"val":"api","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"org_slug","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"resource","end":""},{"old":"/api/:org_slug/:resource/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['resources.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
