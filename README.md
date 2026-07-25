# NestJS Starter (Variant A)

Production-ready NestJS foundation — standalone REST API with class-validator DTOs, Swagger, Drizzle ORM, and JWT auth.

Derived from the [cross-repo audit](NESTJS-AUDIT.md). This is **Variant A** (standalone REST). For the monorepo + Zod variant, see the audit's Variant B section.

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Language | TypeScript 5 (strict) |
| Package manager | pnpm |
| Database | PostgreSQL via Neon (`drizzle-orm/neon-http`) |
| ORM | Drizzle ORM + drizzle-kit migrations |
| Validation | class-validator + class-transformer (DTOs) |
| Env validation | Zod (custom `@nestjs/config` adapter) |
| API docs | Swagger (OpenAPI) at `/docs` |
| Auth | JWT Bearer + Passport, argon2, admin RBAC |
| Rate limiting | `@nestjs/throttler` (global guard) |
| Security | helmet, CORS, production write lockdown |
| Health | `@nestjs/terminus` + DB `SELECT 1` |
| Testing | Jest |
| Containerization | Docker multi-stage + docker-compose |

## Getting started

```bash
pnpm install
cp .env.example .env
# Fill DATABASE_URL, DIRECT_DATABASE_URL, JWT_SECRET (min 32 chars)

pnpm db:migrate
pnpm db:seed
pnpm start:dev
```

| URL | Description |
|---|---|
| `GET /` | Version-neutral welcome page |
| `GET /api/v1` | Versioned API root |
| `GET /docs` | Swagger UI |
| `GET /api/v1/health` | Health check (includes DB probe) |
| `GET /api/v1/items` | Example public read endpoint |

## Scripts

| Script | Description |
|---|---|
| `pnpm start:dev` | Dev server with watch |
| `pnpm build` | Production build |
| `pnpm start:prod` | Run compiled app |
| `pnpm lint` | ESLint + Prettier |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | Smoke e2e tests (no DB required) |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:seed` | Create admin user from env |

## Environment variables

See [`.env.example`](.env.example).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Neon connection (runtime) |
| `DIRECT_DATABASE_URL` | Direct Neon connection (migrations) |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | Token TTL in seconds (default 86400) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin for `db:seed` |

## Response format

Success:

```json
{ "data": {}, "meta": {} }
```

Error:

```json
{
  "statusCode": 404,
  "message": "Item with id 1 not found",
  "path": "/api/v1/items/1",
  "timestamp": "2026-07-25T12:00:00.000Z"
}
```

## Production behavior

- `GET` endpoints are public (rate-limited).
- `POST` / `PATCH` / `DELETE` require admin JWT Bearer token.
- In `NODE_ENV=production`, write endpoints and login return `403 Forbidden` via `DisabledInProductionGuard`.

## Docker

```bash
docker compose up --build
```

## Conventions

See [`AGENTS.md`](AGENTS.md) for binding architectural decisions and explicit out-of-scope items.

## License

MIT
