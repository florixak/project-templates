# AGENTS.md — NestJS Starter (Variant A)

Binding architectural decisions for AI agents working in this codebase.
When in doubt, follow this document over generic online advice if they conflict.

## Variant

**Variant A — Standalone REST API**

- class-validator + class-transformer DTOs
- Swagger decorators on DTOs and controllers
- JWT Bearer auth (no cookies)
- CORS `origin: '*'`
- `DATABASE_CONNECTION` injection token (not a `DatabaseService` wrapper)

For the monorepo + Zod + cookie-auth variant, see `NESTJS-AUDIT.md` Variant B.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Runtime | Node.js 22+ |
| Package manager | pnpm |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM (`drizzle-orm/neon-http`) — stable only, never `@rc` |
| Migrations | drizzle-kit `generate` + `migrate` — never `push` in production |
| Input validation | class-validator + class-transformer (DTO) |
| Env validation | Zod via custom `@nestjs/config` validate adapter |
| API documentation | `@nestjs/swagger` at `/docs` |
| Auth | JWT + Passport, admin RBAC |
| Rate limiting | `@nestjs/throttler` global guard |
| Security headers | helmet |
| Health check | `@nestjs/terminus` (DB `SELECT 1`) |

## Architecture

Feature-first layout:

```
src/
  auth/
  items/          # example CRUD module — replace with your domain
  health/
  common/
  config/
  database/
```

Data flow: **Controller → Service → Drizzle → PostgreSQL**

No repository layer by default. Add one only when DB access becomes genuinely complex.

## Key decisions (binding)

### Primary keys

- Integer identity columns: `integer('id').primaryKey().generatedByDefaultAsIdentity()`
- Use `BY DEFAULT` (not `ALWAYS`) to support seed scripts with explicit IDs.

### Audit columns

- `created_at`, `updated_at` on main entities via `src/database/schema/helpers.ts`.
- Not on junction tables unless the relation carries business meaning.

### Auth

- Public `GET` endpoints: no authentication.
- `POST` / `PATCH` / `DELETE`: `AdminWrite` decorator (JWT + `RolesGuard` + production lockdown).
- Bearer token in `Authorization` header only.
- Access token only — no refresh token rotation.

### DB models vs API

- Never return Drizzle rows directly. Map to Response DTOs manually.

### Filtering, sorting, pagination

- Each module extends shared `PaginationQueryDto`.
- No generic filter engine.

### API response format

Success: `{ "data": {}, "meta": {} }` — collections put pagination in `meta`.

Error: `{ "statusCode", "message", "path", "timestamp" }` — ISO 8601 UTC.

Implemented via global `ResponseInterceptor` + `HttpExceptionFilter`.

### Enum-like columns

- DB: plain `varchar`, no native Postgres ENUM.
- Validation: `@IsIn()` or `@IsEnum()` on DTOs only.

### Config

- All env access through `AppConfigService` — never scattered `ConfigService.get()` or `process.env` in app code.
- Exception: `ExcludeInProduction` Swagger decorator reads `process.env.NODE_ENV` at decorator evaluation time.

### Migrations

1. Edit schema in `src/database/schema/`
2. `pnpm db:generate`
3. Review SQL in `drizzle/`
4. Commit
5. `pnpm db:migrate`

`drizzle.config.ts` uses `DIRECT_DATABASE_URL`.

### Drizzle connection

```typescript
drizzle({ client: sql, schema })  // object syntax, not positional
```

Inject via `@Inject(DATABASE_CONNECTION)`.

### Rate limits

Named throttlers in `src/config/rate-limit.config.ts`:

- `read` — 200/min
- `write` — 20/min
- `auth` — 5/min

Use composed decorators: `PublicRead`, `AdminWrite`, `AuthThrottle`.

## Explicitly out of scope

Redis, GraphQL, CQRS, Event Bus, Kafka/RabbitMQ, WebSockets, Elasticsearch,
microservices, OAuth providers, refresh tokens, native DB enums, repository layer
(by default), axios, winston/pino (unless opted in), `class-validator` in Zod
variant (N/A here).

## API versioning

```typescript
app.setGlobalPrefix('api');
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
```

Routes are `/api/v1/...`. Add `@Controller({ path: 'x', version: '2' })` for breaking changes.

## Conventions for agents

- Use `nest generate` for new modules when appropriate.
- New module = `src/<feature>/` directory.
- Always wrap responses in `{ data, meta }`.
- Verify Drizzle/Nest syntax against current docs before writing.
- Do not install `@rc` / `@beta` packages without explicit approval.
