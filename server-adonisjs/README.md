# TaskFlow — AdonisJS Template

AgentCode reference implementation using AdonisJS v7 with Lucid ORM and SQLite.

## Quick Start

```bash
# Install dependencies
npm install

# Run migrations and seed
node ace migration:fresh --seed

# Start server on port 8002
node ace serve
```

## Test Login

```bash
curl -X POST http://localhost:8002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@acme.com","password":"password"}'
```

## API Endpoints

### Auth
- `POST /api/auth/login` — Returns `{ data: { user, token } }`
- `POST /api/auth/logout` — Requires Bearer token

### Resources (tenant-scoped)

All resource routes use the pattern `/api/:org_slug/:resource`.

| Resource   | Endpoint Prefix              |
|-----------|------------------------------|
| Projects  | `/api/acme-corp/projects`    |
| Tasks     | `/api/acme-corp/tasks`       |
| Comments  | `/api/acme-corp/comments`    |
| Labels    | `/api/acme-corp/labels`      |

Standard CRUD:
- `GET    /api/:org_slug/:resource`        — List (returns `{ data: [...] }`)
- `POST   /api/:org_slug/:resource`        — Create (returns 201)
- `GET    /api/:org_slug/:resource/:id`    — Show
- `PUT    /api/:org_slug/:resource/:id`    — Update
- `DELETE /api/:org_slug/:resource/:id`    — Soft delete (returns 204)

Soft-delete operations:
- `GET    /api/:org_slug/:resource/trashed`          — List trashed
- `POST   /api/:org_slug/:resource/:id/restore`      — Restore
- `DELETE /api/:org_slug/:resource/:id/force-delete`  — Permanent delete

## Seed Data

### Organizations
| Name       | Slug       |
|-----------|-----------|
| Acme Corp  | acme-corp  |
| Globex Inc | globex-inc |

### Users (all passwords: `password`)
| Name            | Email            | Role @ Org     |
|----------------|-----------------|---------------|
| Alice Johnson   | alice@acme.com   | admin @ Acme   |
| Bob Smith       | bob@acme.com     | manager @ Acme |
| Carol Williams  | carol@acme.com   | member @ Acme  |
| Dave Brown      | dave@acme.com    | viewer @ Acme  |
| Eve Davis       | eve@globex.com   | admin @ Globex |

## Key Features

- Multi-tenant isolation via organization slug in URL
- Role-based access control (owner/admin/manager/member/viewer)
- Hidden columns per role (budget, internal_notes, estimated_hours)
- Role-keyed writable fields (fields silently stripped if not allowed)
- TaskScope: members see only tasks assigned to them
- Soft deletes with trashed/restore/force-delete
- UUID primary keys on comments
- Cross-tenant foreign key validation
- Auto-set user_id on comment creation
