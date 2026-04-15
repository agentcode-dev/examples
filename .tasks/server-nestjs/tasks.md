# AgentCode Tasks — server-nestjs

Bugs and missing features in `@agentcode-dev/agentcode-nestjs@0.1.0` surfaced while implementing the TaskFlow reference in `agentcode-template/server-nestjs`. Each task has a detailed `.md` file in this directory with root-cause analysis, repro, and step-by-step resolution.

| ID | Type | Status | Title |
|----|------|--------|-------|
| [BP-001](BP-001.md) | bug | open | Route-group `prefix: ':organization'` never registers tenant routes |
| [BP-002](BP-002.md) | bug | open | `PrismaSchemaGenerator` appends duplicate models with broken field shape |
| [BP-003](BP-003.md) | bug | open | Array-form `create_fields` emits everything as `.optional()` — required fields ignored |
| [BP-004](BP-004.md) | missing | open | Blueprint YAML has no way to declare `fkConstraints` / indirect tenancy (`owner:`) |
| [BP-005](BP-005.md) | missing | open | Blueprint YAML ignores `has_uuid: true` option |
| [BP-006](BP-006.md) | bug | open | `RouteGroupMiddleware` reads `req.url` (mount-relative) instead of `req.originalUrl` |
| [BP-007](BP-007.md) | bug | open | `SerializerService` calls policy attribute methods without `org` context |
| [BP-008](BP-008.md) | missing | open | No JSON-array column hydration for dbs without native arrays (SQLite/MySQL) |
| [BP-009](BP-009.md) | bug | open | `_*.yaml` shared-roles files treated as invalid blueprints |
| [BP-010](BP-010.md) | missing | open | `AGENTCODE_PRISMA_CLIENT` token not exported from public module surface |
| [BP-011](BP-011.md) | parity | open | Cross-tenant access returns 403 instead of 404 |
