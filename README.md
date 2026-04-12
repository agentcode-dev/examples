# AgentCode Template — TaskFlow

Reference implementation of AgentCode across Laravel, Rails, and AdonisJS.

A multi-tenant task management app (TaskFlow) that exercises all AgentCode features:
automatic CRUD, role-based access, multi-tenancy, audit trails, soft deletes,
nested operations, Blueprint generation, and more.

## Projects

| Directory | Framework | Port | Status |
|-----------|-----------|------|--------|
| `server-laravel/` | Laravel + AgentCode | 8001 | |
| `server-rails/` | Rails + AgentCode | 8003 | |
| `server-adonisjs/` | AdonisJS + AgentCode | 8002 | |
| `client-web/` | React | 3000 | Planned |
| `client-mobile/` | React Native | — | Planned |

## Getting Started

Each server project is built using the same steps:
1. Install the framework
2. Install AgentCode
3. Run `agentcode:install` (or equivalent)
4. Create Blueprint YAML files
5. Run `agentcode:blueprint` to generate models, policies, tests, seeders
6. Customize the generated code as needed
7. Run migrations and seed
8. Start the server

See each project's README for detailed instructions.
