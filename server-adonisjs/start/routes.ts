/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ResourcesController = () => import('#controllers/resources_controller')
const AccessTokenController = () => import('#controllers/access_token_controller')

router.get('/', () => {
  return { hello: 'world' }
})

/*
|--------------------------------------------------------------------------
| Auth Routes — /api/auth/*
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('login', [AccessTokenController, 'store'])
    router.post('logout', [AccessTokenController, 'destroy']).use(middleware.auth())
  })
  .prefix('/api/auth')

/*
|--------------------------------------------------------------------------
| Tenant CRUD Routes — /api/:org_slug/:resource/*
|--------------------------------------------------------------------------
|
| All resource endpoints use the tenant route group pattern.
| The :org_slug parameter is resolved by the resolveOrg middleware,
| and :resource is resolved by the ResourcesController.
|
*/
router
  .group(() => {
    // Soft-delete routes must be registered before :id to avoid capture
    router.get('/:resource/trashed', [ResourcesController, 'trashed'])
    router.post('/:resource/:id/restore', [ResourcesController, 'restore'])
    router.delete('/:resource/:id/force-delete', [ResourcesController, 'forceDelete'])

    // Standard CRUD
    router.get('/:resource', [ResourcesController, 'index'])
    router.post('/:resource', [ResourcesController, 'store'])
    router.get('/:resource/:id', [ResourcesController, 'show'])
    router.put('/:resource/:id', [ResourcesController, 'update'])
    router.delete('/:resource/:id', [ResourcesController, 'destroy'])
  })
  .prefix('/api/:org_slug')
  .use([middleware.auth(), middleware.resolveOrg()])
