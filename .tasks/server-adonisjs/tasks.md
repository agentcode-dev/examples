# AdonisJS Template — Issues & Notes

## Issues Found

### 1. AgentCode CLI commands do not work when installed from tarball

**Status:** Known, blocking
**Impact:** Cannot use `node ace agentcode:blueprint`, `agentcode:generate`, or `agentcode:install`

The `@agentcode-dev/agentcode-adonisjs` package installed from tarball (`file:../../server-adonisjs/agentcode-dev-agentcode-adonisjs-0.10.0.tgz`) has ESM resolution issues that prevent its ace commands from registering properly. The commands only work when installed from the npm registry.

**Workaround:** All files (models, migrations, controllers, middleware, config) were created manually following AgentCode conventions. Blueprint YAML files are included for documentation purposes.

### 2. Password hashing with withAuthFinder mixin

**Status:** Fixed
**Detail:** The initial project had a User model extending from a generated `UserSchema` base class via `compose(UserSchema, withAuthFinder(hash))`. The `UserSchema` was auto-generated from the database and did not include the password hashing hooks.

**Fix:** Rewrote the User model to extend directly from `compose(BaseModel, AuthFinder)` with explicit column decorators, bypassing the generated schema. The `withAuthFinder` mixin handles password hashing on save and provides `User.verifyCredentials()`.

### 3. Lucid serialization includes `deletedAt: null`

**Status:** Cosmetic, not fixed
**Detail:** When serializing models that have a `deletedAt` column, Lucid includes `"deletedAt": null` in the JSON output even for non-deleted records. The Laravel template excludes this field from API responses. This could be fixed by adding `serializeAs: null` to the `deletedAt` column decorator, but then trashed endpoints would also not show the field.

### 4. AdonisJS shield middleware CSRF rejection on non-browser requests

**Status:** Mitigated
**Detail:** The `@adonisjs/shield` middleware can reject POST/PUT/DELETE requests that don't include CSRF tokens. For API-only usage, this is not needed. Currently the shield config has `enabled: false` for CSRF by default in the starter template, so it works. If enabled, API clients would need to handle CSRF tokens.

### 5. No pagination implemented

**Status:** Not yet implemented
**Detail:** The `index` and `trashed` endpoints return all records without pagination. For production use, these should use Lucid's `paginate()` method. The Laravel template supports pagination via query parameters.

## Architecture Decisions

### Manual CRUD Controller vs AgentCode GlobalController

Because the AgentCode CLI commands don't work from tarball install, the CRUD logic is implemented in a local `ResourcesController` that reads configuration from `config/resources.ts`. This follows the same pattern as AgentCode's `GlobalController` but without the package dependency at runtime.

The resource config maps each model slug to:
- Model class reference
- Organization scoping strategy (direct or indirect via relationship)
- Soft delete support
- Hidden fields per role
- Writable fields per role per action (store/update)
- Cross-tenant foreign key validation rules
- Action exclusions (e.g., labels has no forceDelete)

### Route Structure

Routes use the tenant route group pattern:
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`
- Resources: `GET/POST /api/:org_slug/:resource`, `GET/PUT/DELETE /api/:org_slug/:resource/:id`
- Soft deletes: `GET /api/:org_slug/:resource/trashed`, `POST /api/:org_slug/:resource/:id/restore`, `DELETE /api/:org_slug/:resource/:id/force-delete`

The `:resource` parameter is resolved by the controller from the `resourceConfig` map, and `:org_slug` is resolved by the `ResolveOrganizationMiddleware`.
