# NestJS Starter Template — Cross-Repo Engineering Audit

**Auditor scope:** All accessible `florixak` GitHub repositories containing `@nestjs/core` in `package.json`, with heavy mining of the two primary reference repos.  
**Audit date:** 2026-07-25  
**Account scanned:** `florixak` (public repos via GitHub code search; private repos not accessible from this environment).

---

## Step 1 — Discovery

### Repositories with `@nestjs/core`

| Repo | Path | Last activity | Maturity | Pattern mining |
|---|---|---|---|---|
| [florixak/brick-match](https://github.com/florixak/brick-match) | `api/` | 2026-07-25 | Production-looking full-stack monorepo (Next.js + NestJS API + `shared-types`) | **Included** (primary) |
| [florixak/spinjitzu-api](https://github.com/florixak/spinjitzu-api) | repo root | 2026-07-12 | Production-quality standalone public REST API (Docker, Swagger, health, RBAC, deployed on Vercel) | **Included** (primary) |
| `nestjs-course/course` | — | — | Listed as tutorial boilerplate | **Not found** — repo does not exist under `florixak` or `nestjs-course` org (or is inaccessible). Cannot verify drift. |
| All other `florixak/*` repos (26 public) | — | — | No `@nestjs/core` dependency | **Excluded** — not NestJS projects |

**Total NestJS repos discovered (public, accessible): 2.**

### Seed repo verification

| Seed | Status | Drift notes |
|---|---|---|
| `florixak/spinjitzu-api` | ✅ Exists, active | `package.json` `"name": "spinjitzu-api"` matches repo name. No alternate owner found. No `ninja-api` clone under `florixak`. |
| `brick-match` → `api/` | ✅ Exists, active | Monorepo: `pnpm-workspace.yaml` lists `api`, `shared-types`, `web`. API package name is `"api"`, workspace dep `@lego-matcher/shared-types`. |
| `nestjs-course/course` | ❌ Not found | Cannot list or exclude from mining — treat as absent until repo is located. |

### Abandoned / boilerplate-only repos

No NestJS repos were found in an abandoned mid-setup state. Both primary repos contain substantial feature modules, committed Drizzle migrations, and real business logic.

### Private repo caveat

GitHub authentication in this environment is limited (`cursor` integration token). **Private NestJS repos, if any, could not be scanned.** Only the two public repos above contribute evidence.

---

## Step 2 — Cross-Repo Pattern Extraction

### Monorepo vs standalone

| Pattern | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Layout | Standalone repo | pnpm workspace member alongside `web/` and `shared-types/` |
| `shared-types` package | No | Yes — `@lego-matcher/shared-types` with Zod schemas for API contracts |
| Workspace scripts | N/A (root `package.json` only) | Root: `pnpm --filter api start:dev`, `pnpm --filter @lego-matcher/web dev`, `pnpm -r test` |

**Settled:** Both use feature-first `src/<feature>/` inside the API package.  
**Varies:** Monorepo + shared Zod types is a deliberate brick-match choice for full-stack type sharing.

Evidence — brick-match root `package.json`:

```json
"dev:api": "pnpm --filter api start:dev",
"build": "pnpm --filter @lego-matcher/shared-types build && pnpm -r --filter=!@lego-matcher/shared-types build"
```

---

### Tooling & package manager

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Package manager | pnpm (`pnpm-lock.yaml`) | pnpm (`packageManager: "pnpm@11.5.1"` at monorepo root) |
| Node pinning | Dockerfile: `node:22-alpine`; no `.nvmrc`, no `engines` in `package.json` | No Dockerfile in `api/`; CI uses Node 20 (web only) |
| Lint | ESLint 9 flat config (`eslint.config.mjs`) + Prettier; script `"lint": "eslint ..."` | Identical pattern |
| `nest lint` | Not used | Not used |

**Settled:** pnpm, ESLint 9 flat config + Prettier, custom `pnpm lint`.  
**Varies:** Node version pinning is implicit (Docker `node:22-alpine` in spinjitzu only). brick-match CI runs Node 20 for the frontend — API has no CI workflow.

**Drift — TypeScript strict mode:** brick-match `api/tsconfig.json` has `"strict": true`. spinjitzu-api `tsconfig.json` has `strictNullChecks: true` but `noImplicitAny: false` — not fully strict. AGENTS.md claims "TypeScript strict" for brick-match only.

---

### Project & module structure

| Item | Evidence |
|---|---|
| Style | Modular monolith, feature-first: `src/auth/`, `src/characters/`, `src/owned-parts/`, etc. |
| File naming | Nest CLI defaults: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `*.dto.ts` (spinjitzu); `*.schema.ts` in Drizzle only |
| Cross-cutting | `src/common/` (filters, interceptors, decorators, guards, pipes, dto/utils) + `src/config/` |
| Barrel files | `src/database/schema/index.ts` re-exports schema; no per-feature `index.ts` barrel files elsewhere |
| Drizzle schema | Split by domain under `src/database/schema/` in both repos |

spinjitzu schema helpers (`src/database/schema/helpers.ts`):

```typescript
export const idColumn = () =>
  integer('id').primaryKey().generatedByDefaultAsIdentity();

export const timestamps = { createdAt: ..., updatedAt: ... };
```

**Settled:** Feature-first modules, `common/` + `config/`, domain-split Drizzle schema.  
**Varies:** spinjitzu has reusable `idColumn()` / `timestamps` helpers; brick-match does not.

---

### Configuration

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| `@nestjs/config` | `ConfigModule.forRoot({ validate, isGlobal: true })` in `app.module.ts` | Wrapped inside `AppConfigModule` |
| Zod env schema | `src/config/env.schema.ts` | Same |
| Validate adapter | `src/config/env.validation.ts` → throws on `safeParse` failure | Identical |
| Typed accessor | `AppConfigService` with `{ infer: true }` getters | Identical pattern + `frontendUrl`, `jwtCookieName` |
| `.env.example` | Present, documents dual DB URLs + admin creds | Present, adds `FRONTEND_URL`, `JWT_COOKIE_NAME` |
| Dual DB URLs | `DATABASE_URL` (pooled) + `DIRECT_DATABASE_URL` (migrations) | Same |

**Settled:** Zod-validated env at bootstrap, `AppConfigService` as sole config accessor, dual Neon URL pattern, `.env.example` present.  
**Varies:** Where `ConfigModule.forRoot` is registered (`app.module.ts` vs `config.module.ts`).

---

### Database & ORM

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| ORM | Drizzle (`drizzle-orm/neon-http`) | Same |
| Driver | `@neondatabase/serverless` + `neon()` | Same |
| Connection factory | `createDatabaseConnection(url)` in `database-connection.ts` | Same |
| DI pattern | `@Inject(DATABASE_CONNECTION)` string token | `DatabaseService` wrapper with `.db` property |
| Migrations | `drizzle-kit generate` + committed SQL in `drizzle/`; `drizzle.config.ts` uses `DIRECT_DATABASE_URL` | Same |
| `push` / `synchronize` | Documented as forbidden in AGENTS.md; not used in code | Same |
| Repository layer | Services call Drizzle directly | Same |
| Postgres error utils | `postgres-unique-violation.util.ts`, `postgres-foreign-key-violation.util.ts` | `pg-error.ts` (`isUniqueViolation`, `isFkViolation`) |

spinjitzu injection (`src/database/database.module.ts`):

```typescript
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
// ...
provide: DATABASE_CONNECTION,
useFactory: (config) => createDatabaseConnection(config.databaseUrl),
```

brick-match injection (`src/database/database.service.ts`):

```typescript
@Injectable()
export class DatabaseService {
  readonly db: Database;
  constructor(config: AppConfigService) {
    this.db = createDatabaseConnection(config.databaseUrl);
  }
}
```

**Settled:** Drizzle + Neon HTTP, committed migrations, services → Drizzle directly, no repository layer by default.  
**Varies:** DI token vs `DatabaseService` wrapper; postgres error util file organization.  
**Drift:** brick-match `AGENTS.md` documents `postgres` (postgres.js) driver, but actual code uses `neon-http` — documentation is stale.

---

### Validation & DTOs

This is the primary architectural fork between the two repos.

| Track | spinjitzu-api (Variant A) | brick-match (Variant B) |
|---|---|---|
| Request validation | `class-validator` + `class-transformer` on DTO classes | `ZodValidationPipe` + schemas from `@lego-matcher/shared-types` |
| Swagger integration | Full `@ApiProperty` / `@ApiBody` on DTOs | Partial `@ApiOperation` / `@ApiQuery`; no Zod→OpenAPI |
| Global `ValidationPipe` | Yes, in `main.ts` | Yes, in `main.ts` — **redundant** for Zod-routed endpoints |
| Response validation | Manual mapping to Response DTOs; interceptor wraps `{ data, meta }` | Controllers call `SomeApiResponseSchema.parse({ data, meta })` at boundary |
| Pagination | `PaginationQueryDto` (class-validator) extended per module | `PaginationQuerySchema` / per-route Zod query schemas in shared-types |

**Global `ValidationPipe` redundancy in brick-match:** `main.ts` registers `ValidationPipe` globally, but every controller route uses `new ZodValidationPipe(Schema)` on `@Body()` / `@Query()`. The global pipe only applies to parameters without an explicit pipe — currently no such routes exist. **Recommendation:** Remove global `ValidationPipe` in the Zod variant, or document it as a safety net for any future class-validator DTOs.

spinjitzu global pipe (`src/main.ts`):

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, forbidNonWhitelisted: true, transform: true,
}));
```

brick-match Zod usage (`api/src/owned-parts/owned-parts.controller.ts`):

```typescript
@Body(new ZodValidationPipe(AddOwnedPartRequestSchema)) request: AddOwnedPartRequest
// ...
return AddOwnedPartApiResponseSchema.parse({ data, meta: {} });
```

**Settled:** Response envelope `{ data, meta }`; error shape `{ statusCode, message, path, timestamp }` (brick-match adds optional `errors` map for Zod).  
**Varies:** Entire validation strategy — template must ship as two variants, not a merged default.

---

### Auth & security

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Strategy | `@nestjs/passport` + `passport-jwt` | Same |
| Token delivery | Bearer header only (`ExtractJwt.fromAuthHeaderAsBearerToken()`) | HttpOnly cookie + Bearer fallback (`auth-cookie.ts`, custom extractor) |
| Password hashing | `argon2` | `argon2` |
| RBAC | `RolesGuard` + `@Roles(Role.ADMIN)` via `AdminWrite` decorator | No roles — per-user ownership via `CurrentUser('sub')` |
| Production write lockdown | `DisabledInProductionGuard` on login + `AdminWrite` routes | No equivalent |
| Refresh tokens | Not implemented (documented out-of-scope) | Not implemented |
| Global throttler | `APP_GUARD` → `ThrottlerGuard` | Same |
| Named throttlers | `read` (200/min), `write` (20/min), `auth` (5/min) inline in `app.module.ts` | `default`, `auth`, `matching` via `rate-limit.config.ts` |
| Composed decorators | `PublicRead`, `AdminWrite`, `AuthThrottle` | `AuthThrottle`, `MatchingThrottle`, `CurrentUser` |
| `helmet` | Yes, with CSP `scriptSrc` override for Swagger CDN | Yes, default config |
| CORS | `origin: '*'` | `origin: configService.frontendUrl`, `credentials: true` |
| `trust proxy` | `app.set('trust proxy', 1)` (Vercel/reverse proxy) | Not set |

spinjitzu `AdminWrite` (`src/common/decorators/admin-write.decorator.ts`):

```typescript
export const AdminWrite = () => applyDecorators(
  ApiBearerAuth(),
  UseGuards(DisabledInProductionGuard, JwtAuthGuard, RolesGuard),
  Roles(Role.ADMIN),
  SkipThrottle({ read: true, auth: true }),
);
```

brick-match cookie auth (`api/src/auth/strategies/jwt.strategy.ts`):

```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (req) => extractJwtFromCookie(req, config.jwtCookieName),
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]),
```

**Settled:** JWT + Passport, argon2, access-token-only (no refresh rotation), global `ThrottlerGuard`, helmet.  
**Varies:** Bearer vs cookie transport; RBAC vs user-scoped auth; CORS policy; production write lockdown; throttler naming.

---

### Error handling & logging

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Global filter | Custom `HttpExceptionFilter` | Custom `HttpExceptionFilter` (enhanced) |
| Field-level errors | Message string only (joins array messages) | Optional `errors: Record<string, string[]>` from Zod `BadRequestException` |
| Logging | None beyond Nest defaults | `Logger` in filter for unhandled exceptions |
| Correlation/request IDs | Not implemented | Not implemented |
| Structured logging (pino/winston) | Not used | Not used (explicitly excluded in AGENTS.md) |

**Settled:** Custom global `HttpExceptionFilter`, not default Nest behavior.  
**Varies:** Zod-aware `errors` map (brick-match only).  
**Absent across repos:** Request ID middleware, structured logging.

---

### API documentation

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Swagger setup | Full: `DocumentBuilder`, `/docs` route, CDN assets, Bearer auth (non-prod) | No `SwaggerModule.setup()` in `main.ts` |
| Decorators | Comprehensive per-controller | `@ApiTags`, `@ApiOperation`, `@ApiQuery` only |
| Version-neutral root | `RootController` with `@Version(VERSION_NEUTRAL)` at `GET /` | No root welcome controller |
| `nestjs-zod` | Not used | Documented as possible future addition |

**Settled:** `@nestjs/swagger` dependency present in both.  
**Varies:** Full Swagger (spinjitzu) vs partial decorators without UI (brick-match).

---

### Testing

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Unit tests | 9 `.spec.ts` files (services + `roles.guard` + `app.controller`) | 9 `.spec.ts` files (services, controllers, import) |
| E2E | `test/app.e2e-spec.ts` — **stale** (`GET /` expects `'Hello World!'`) | Identical stale boilerplate |
| Test DB | Mock DB via `test/common/mock-db.type.ts` + `chainable-mock.ts` (spinjitzu) | Service tests mock `DatabaseService` |
| CI test run | No API CI workflow | Monorepo CI runs `pnpm test:run` for web (Vitest), not API Jest |

**Settled:** Jest + ts-jest, `.spec.ts` co-located with source.  
**Absent / stale:** Maintained E2E suite, test database strategy (testcontainers / `.env.test`), API CI pipeline.

---

### Background jobs & messaging

**No evidence** in either repo of `@nestjs/bull`, BullMQ, `@nestjs/schedule`, RabbitMQ, Kafka, or Redis pub/sub. Both `AGENTS.md` files explicitly exclude these.

---

### Deployment & CI

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| Dockerfile | Multi-stage `node:22-alpine`, corepack, `pnpm install --frozen-lockfile` | None in `api/` |
| docker-compose | Yes (`docker-compose.yml` with `.env`) | None |
| CI | No `.github/workflows/` in repo | `web/.github/workflows/ci.yml` — Biome + typecheck + Vitest for **web only** |
| Health endpoint | `@nestjs/terminus` — `GET /api/v1/health` with `SELECT 1` | `@nestjs/terminus` in `package.json` but **no health module implemented** |
| Vercel | `vercel.json` with `installCommand: pnpm install` | Not configured for API |

spinjitzu health check (`src/health/health.service.ts`):

```typescript
await this.db.execute(sql`SELECT 1`);
return this.getStatus(key, true);
```

**Settled (spinjitzu only):** Multi-stage Docker, docker-compose, Terminus health with DB probe, `trust proxy` for serverless.  
**Absent in brick-match:** Docker, health implementation, API CI.

---

### Documentation habits

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| README | Comprehensive: response format, rate limits, env table, legal disclaimer, resource table | Minimal `api/README.md` |
| `AGENTS.md` | Binding architectural decisions, out-of-scope list, V2 roadmap | Dependency rationale section (excellent model), matching algorithm docs |
| Excluded deps documented | Yes (Redis, CQRS, GraphQL, etc.) | Yes (axios, winston, class-validator, uuid) |

**Settled:** `AGENTS.md` as the documentation standard for AI agents and binding decisions.  
**Recommendation:** spinjitzu README structure (API surface table, response format, env vars) is the repeatable public-docs template; brick-match `AGENTS.md` dependency section is the repeatable internal rationale template.

---

### CLI / seed / import scripts

| Item | spinjitzu-api | brick-match `api/` |
|---|---|---|
| DB seed | `pnpm db:seed` → `ts-node src/database/seed.ts` (admin bootstrap) | None |
| Import CLI | None | `pnpm import:catalog` → `ts-node src/import/import.command.ts` (Rebrickable — project-specific) |
| Migration scripts | `db:generate`, `db:migrate` | Same + `db:studio` |

**Settled:** Drizzle CLI scripts via `package.json`. Nest-invokable `ts-node` commands for one-off tasks.  
**Varies:** Seed pattern (spinjitzu) vs import CLI (brick-match, domain-specific).

---

## 1. Sources Analyzed

| Repo | Role |
|---|---|
| [florixak/spinjitzu-api](https://github.com/florixak/spinjitzu-api) | Primary reference — standalone public REST API with Docker, Swagger, health, RBAC |
| [florixak/brick-match](https://github.com/florixak/brick-match) (`api/`) | Primary reference — full-stack monorepo variant with Zod shared-types and cookie auth |
| `nestjs-course/course` | Listed seed — **not found**, no patterns extracted |
| [florixak/project-templates](https://github.com/florixak/project-templates) | Template host repo (this audit branch); `nextjs` branch used as structural reference only |

---

## 2. Recurring Patterns

### Monorepo vs standalone
- **Feature-first API package** under `src/<feature>/` — both repos (spinjitzu, brick-match).
- Monorepo workspace wiring is brick-match-only.

### Tooling & package manager
- **pnpm** + **ESLint 9 flat config** + **Prettier** + custom `pnpm lint` — both repos.
- **NestJS 11.x** + **TypeScript 5.x** — both repos.

### Project & module structure
- **Modular monolith**, `src/common/` + `src/config/` + `src/database/schema/` — both repos.
- **Nest CLI file naming conventions** — both repos.

### Configuration
- **Zod env schema** → **validate adapter** → **`AppConfigService`** — both repos.
- **Dual DB URL pattern** (`DATABASE_URL` + `DIRECT_DATABASE_URL`) — both repos.

### Database & ORM
- **Drizzle ORM + Neon HTTP** (`drizzle-orm/neon-http`, `@neondatabase/serverless`) — both repos.
- **Committed migrations** in `drizzle/`, `drizzle-kit generate` + `migrate` — both repos.
- **Services call Drizzle directly**, no repository layer — both repos.

### Validation & DTOs
- **Global `{ data, meta }` response envelope** via `ResponseInterceptor` — both repos.
- **Global error shape** via `HttpExceptionFilter` — both repos.
- Validation strategy **intentionally diverges** (see Section 3).

### Auth & security
- **JWT + Passport** (`passport-jwt`), **argon2**, **access token only** — both repos.
- **helmet** + **`@nestjs/throttler`** as global `APP_GUARD` — both repos.
- **URI versioning** (`/api/v1/...`, `defaultVersion: '1'`) — both repos.

### Error handling & logging
- **Custom global `HttpExceptionFilter`** — both repos.

### API documentation
- **`@nestjs/swagger` dependency** — both repos (usage depth varies).

### Testing
- **Jest unit tests** (`.spec.ts` on services) — both repos.

### Deployment & CI
- No settled cross-repo CI or Docker convention — spinjitzu only.

### Documentation habits
- **`AGENTS.md` with binding decisions** — both repos.

### CLI / seed / import scripts
- **`ts-node` Nest-invokable scripts** pattern — both repos (seed vs import).

---

## 3. Missing Standards

| Area | Current State | Recommended Standard |
|---|---|---|
| Validation strategy | spinjitzu: class-validator + Swagger DTOs; brick-match: Zod + `ZodValidationPipe` + shared-types | **Two template variants** (see Section 4). Do not merge into one default. |
| Global `ValidationPipe` | Registered in both; redundant in brick-match where all routes use `ZodValidationPipe` | Remove in Zod variant; keep in class-validator variant. |
| DB injection | `DATABASE_CONNECTION` token (spinjitzu) vs `DatabaseService.db` (brick-match) | Default to **`DATABASE_CONNECTION` token** (spinjitzu/AGENTS.md); document `DatabaseService` as optional ergonomic wrapper. |
| Auth transport | Bearer only vs HttpOnly cookie + Bearer fallback | Default **Bearer** (standalone REST); **cookie variant** for monorepo/full-stack scaffold. |
| CORS | `origin: '*'` vs `FRONTEND_URL` + `credentials: true` | Default permissive for public API variant; strict origin + credentials for monorepo variant. |
| Swagger | Full `/docs` (spinjitzu) vs decorators without UI (brick-match) | **Recommended** in standalone variant; optional scaffold in monorepo variant. |
| Health checks | Implemented (spinjitzu) vs dep listed but no module (brick-match) | **Recommended** in both variants — Terminus + `SELECT 1`. |
| Docker | spinjitzu has multi-stage Dockerfile + compose; brick-match has none | **Recommended** in base template (spinjitzu model). |
| TypeScript strict | brick-match `strict: true`; spinjitzu partial strict | **`"strict": true`** in template `tsconfig.json`. |
| Node version pinning | Implicit via Docker only | Add `.nvmrc` (`22`) + `engines` field in `package.json`. |
| CI for API | No workflow in spinjitzu; brick-match CI is web-only | GitHub Actions: `pnpm lint`, `pnpm test`, `pnpm build` on API package. |
| E2E tests | Stale `Hello World!` boilerplate in both | Replace with smoke test against `/api/v1/health` or remove `test:e2e` script until maintained. |
| Postgres error utils | Two file layouts (`common/utils/` vs `database/pg-error.ts`) | Consolidate to `src/common/utils/postgres-error.util.ts` with `isUniqueViolation`, `isFkViolation`, `rethrowIf*`. |
| Rate limit config | Inline in `app.module.ts` (spinjitzu) vs `rate-limit.config.ts` (brick-match) | Extract to `src/config/rate-limit.config.ts` in template. |
| `trust proxy` | spinjitzu only | Include in base `main.ts` with comment (required for Vercel/reverse proxies). |
| RBAC decorators | spinjitzu only (`PublicRead`, `AdminWrite`, `RolesGuard`) | **Recommended** in standalone public-API variant; omit in user-scoped monorepo variant. |
| Response `errors` map | brick-match only | Include in Zod variant's `HttpExceptionFilter`; optional in class-validator variant. |
| Structured logging | Absent in both | **Optional** — document pino/nestjs-pino, do not pre-install. |
| `nestjs-course/course` | Not found | Remove from seed list or re-locate repo before referencing. |
| brick-match AGENTS.md driver note | Documents `postgres.js`, code uses `neon-http` | Update AGENTS.md when syncing docs to template. |

---

## 4. Template Contents

### Required (always present, zero config)

Based on spinjitzu-api bootstrap — the stronger baseline:

- `src/main.ts` — helmet, global prefix `api`, URI versioning, global `ResponseInterceptor`, global `HttpExceptionFilter`, `trust proxy`
- `src/app.module.ts` — `ThrottlerModule.forRoot` + `APP_GUARD` → `ThrottlerGuard`
- `src/config/env.schema.ts` — Zod env validation
- `src/config/env.validation.ts` — `@nestjs/config` validate adapter
- `src/config/config.service.ts` — typed `AppConfigService`
- `src/config/config.module.ts` — `@Global()` module
- `src/common/filters/http-exception.filter.ts`
- `src/common/interceptors/response.interceptor.ts`
- `src/database/database-connection.ts` — `createDatabaseConnection` + `drizzle({ client, schema })`
- `src/database/database.module.ts` — `DATABASE_CONNECTION` injection token
- `src/database/schema/` — Drizzle tables (minimal `users` example)
- `drizzle.config.ts` — uses `DIRECT_DATABASE_URL`
- `drizzle/` — initial migration committed
- `.env.example` — dual DB URLs, JWT, PORT, NODE_ENV
- `AGENTS.md` — skeleton with binding decisions and out-of-scope list
- `pnpm lint` script (ESLint 9 flat + Prettier)
- `package.json` scripts: `db:generate`, `db:migrate`, `build`, `start:dev`

### Recommended (scaffolded, feature-flagged or empty module)

- `src/health/` — Terminus module with DB `SELECT 1` check
- Swagger `/docs` setup in `main.ts` (standalone variant)
- `Dockerfile` (multi-stage `node:22-alpine`) + `docker-compose.yml`
- `src/auth/` — JWT strategy, `JwtAuthGuard`, argon2 password hashing
- `src/common/decorators/` — `AuthThrottle`, `CurrentUser`
- `src/common/dto/pagination-query.dto.ts` **or** shared Zod pagination schema (per variant)
- `src/common/utils/postgres-*-violation.util.ts`
- `src/config/rate-limit.config.ts`
- `src/root.controller.ts` — `VERSION_NEUTRAL` welcome endpoint
- `.nvmrc` + `engines` in `package.json`
- `.github/workflows/ci.yml` — lint, test, build
- `src/database/seed.ts` + `db:seed` script

### Optional (documented, not installed)

- **Variant B only:** `shared-types/` workspace package + `ZodValidationPipe`
- **Variant B only:** `src/auth/auth-cookie.ts` + cookie JWT extractor
- **Variant A only:** `class-validator` + `class-transformer` + Swagger DTO decorators
- **Standalone public API only:** `RolesGuard`, `PublicRead`, `AdminWrite`, `DisabledInProductionGuard`
- Import/seed CLI beyond admin bootstrap (`import.command.ts` pattern)
- Refresh token rotation
- `nestjs-zod` for Zod→OpenAPI
- Structured logging (`nestjs-pino`)
- `db:studio` script

### Template variant split

| Concern | Default (`nestjs-starter`) | Monorepo (`nestjs-starter-monorepo-zod`) |
|---|---|---|
| Validation | class-validator DTOs + global `ValidationPipe` + Swagger decorators | Zod schemas in `shared-types/` + `ZodValidationPipe` per route; **no** global `ValidationPipe` |
| Auth transport | Bearer JWT only | HttpOnly cookie + Bearer fallback |
| CORS | `origin: '*'` (public API) | `FRONTEND_URL` + `credentials: true` |
| Swagger | Full `/docs` setup | Partial decorators; `nestjs-zod` documented for later |
| RBAC | `RolesGuard` + composed decorators | User-scoped via `@CurrentUser('sub')` |
| Workspace | Standalone repo | pnpm workspace with `api/` + `shared-types/` + optional `web/` |

---

## 5. Suggested Folder Structure

```
nestjs-starter/                          # Variant A: standalone REST
├── AGENTS.md
├── Dockerfile
├── docker-compose.yml
├── drizzle.config.ts
├── drizzle/
│   └── 0000_*.sql
├── .env.example
├── .nvmrc
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.build.json
├── .github/workflows/ci.yml
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── root.controller.ts                 # VERSION_NEUTRAL welcome
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   ├── env.schema.ts
│   │   ├── env.validation.ts
│   │   └── rate-limit.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── public-read.decorator.ts
│   │   │   ├── admin-write.decorator.ts
│   │   │   ├── auth-throttle.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── dto/
│   │   │   └── pagination-query.dto.ts    # Variant A only
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── disabled-in-production.guard.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts
│   │   ├── interfaces/
│   │   │   ├── api-response.interface.ts
│   │   │   └── pagination-meta.interface.ts
│   │   └── utils/
│   │       ├── postgres-unique-violation.util.ts
│   │       └── postgres-foreign-key-violation.util.ts
│   ├── database/
│   │   ├── database-connection.ts
│   │   ├── database.module.ts             # DATABASE_CONNECTION token
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── helpers.ts
│   │   │   └── users.schema.ts
│   │   └── seed.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/                           # Variant A: class-validator DTOs
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts            # Bearer only
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   ├── health/
│   │   ├── health.module.ts
│   │   ├── health.controller.ts
│   │   └── health.service.ts
│   └── <feature>/                         # example CRUD module
│       ├── <feature>.module.ts
│       ├── <feature>.controller.ts
│       ├── <feature>.service.ts
│       └── dto/
└── test/
    ├── jest-e2e.json
    └── app.e2e-spec.ts

# Variant B additions / divergences (monorepo):
nestjs-starter-monorepo-zod/
├── pnpm-workspace.yaml
├── api/                                   # same tree as above with these diffs:
│   └── src/
│       ├── common/
│       │   └── pipes/
│       │       └── zod-validation.pipe.ts   # Variant B: replaces dto/ for requests
│       ├── auth/
│       │   ├── auth-cookie.ts             # Variant B: cookie transport
│       │   └── strategies/jwt.strategy.ts # cookie + bearer extractor
│       └── database/
│           └── database.service.ts        # optional alternative to token
└── shared-types/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── api-response.ts
        ├── pagination.ts
        └── auth.ts                        # Zod request/response schemas
```

---

## 6. Suggested Dependencies

### Core (both variants)

```json
{
  "@neondatabase/serverless": "^1.1.0",
  "@nestjs/common": "^11.0.1",
  "@nestjs/config": "^4.0.4",
  "@nestjs/core": "^11.0.1",
  "@nestjs/jwt": "^11.0.2",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/throttler": "^6.5.0",
  "argon2": "^0.44.0",
  "drizzle-orm": "^0.45.2",
  "helmet": "^8.2.0",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1",
  "zod": "^4.4.3"
}
```

### Dev (both variants)

```json
{
  "@nestjs/cli": "^11.0.0",
  "@nestjs/schematics": "^11.0.0",
  "@nestjs/testing": "^11.0.1",
  "@eslint/js": "^9.18.0",
  "drizzle-kit": "^0.31.10",
  "eslint": "^9.18.0",
  "eslint-config-prettier": "^10.0.1",
  "eslint-plugin-prettier": "^5.2.2",
  "globals": "^17.0.0",
  "jest": "^30.0.0",
  "prettier": "^3.4.2",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.5",
  "ts-node": "^10.9.2",
  "tsconfig-paths": "^4.2.0",
  "typescript": "^5.7.3",
  "typescript-eslint": "^8.20.0"
}
```

### Recommended (standalone variant)

```json
{
  "@nestjs/swagger": "^11.4.4",
  "@nestjs/terminus": "^11.1.1",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.15.1"
}
```

### Recommended (monorepo Zod variant)

```json
{
  "@nestjs/swagger": "^11.4.4",
  "@nestjs/terminus": "^11.1.1"
}
```

### Optional (document only — do not pre-install)

| Package | When to add |
|---|---|
| `nestjs-zod` | Zod → OpenAPI generation in monorepo variant |
| `nestjs-pino` / `pino` | Structured logging at scale |
| `@nestjs/bull` / `bullmq` | Background job processing |
| `@nestjs/schedule` | Cron tasks |
| `axios` | Only if native `fetch` is insufficient |
| `class-validator` / `class-transformer` | Never in Zod variant |
| `uuid` | Use `crypto.randomUUID()` instead |

---

## 7. Suggested Configuration Files

| File | Purpose | Notes |
|---|---|---|
| `src/main.ts` | Bootstrap: helmet, CORS, prefix, versioning, global pipes/filters/interceptors | Variant-specific CORS and Swagger blocks |
| `src/app.module.ts` | Root module, throttler `APP_GUARD` | Import `ConfigModule`, `DatabaseModule`, `HealthModule` |
| `src/config/env.schema.ts` | Zod schema for all env vars | Fail-fast at startup |
| `src/config/env.validation.ts` | `@nestjs/config` `validate` function | Identical in both repos |
| `src/config/config.service.ts` | Typed `AppConfigService` | Never scatter `ConfigService.get()` |
| `src/config/config.module.ts` | `@Global()` config module | brick-match pattern: wrap `ConfigModule.forRoot` here |
| `src/config/rate-limit.config.ts` | Named throttler TTL/limit constants | brick-match pattern |
| `src/common/filters/http-exception.filter.ts` | Global error shape | Zod variant adds `errors` map |
| `src/common/interceptors/response.interceptor.ts` | `{ data, meta }` envelope | |
| `src/common/pipes/zod-validation.pipe.ts` | Zod variant only | Per-route validation |
| `src/common/dto/pagination-query.dto.ts` | class-validator variant only | Extended per feature module |
| `src/database/database-connection.ts` | `createDatabaseConnection()` factory | `drizzle({ client, schema })` syntax |
| `src/database/database.module.ts` | `DATABASE_CONNECTION` provider | Default injection pattern |
| `drizzle.config.ts` | drizzle-kit config | Uses `DIRECT_DATABASE_URL` |
| `nest-cli.json` | Nest CLI project config | |
| `eslint.config.mjs` | ESLint 9 flat config | `recommendedTypeChecked` + Prettier |
| `tsconfig.json` | TypeScript config | `"strict": true` |
| `.env.example` | Documented env vars | Dual DB URLs required |
| `Dockerfile` | Multi-stage production build | `node:22-alpine`, corepack, pnpm |
| `docker-compose.yml` | Local dev container | `env_file: .env` |
| `AGENTS.md` | Binding architectural decisions | spinjitzu structure + brick-match dependency rationale |
| `.nvmrc` | Node version pin | `22` |
| `.github/workflows/ci.yml` | Lint + test + build | API-focused (not web-only) |
| `vercel.json` | Serverless deploy (optional) | `installCommand: pnpm install` |

---

## 8. Things NOT to Include

### Project-specific code (never ship in generic template)

- spinjitzu domain entities: characters, seasons, elements, weapons, locations, realms, junction tables
- brick-match domain: catalog tables, matching algorithm, Rebrickable CSV import (`import.command.ts`, `csv-parse`)
- Rebrickable/minifig expansion logic
- Ninjago-specific enums, seed data, legal disclaimer text (document as README section template instead)
- `shared-types` domain schemas (`catalog.ts`, `matches.ts`, `owned-parts.ts`) — only the **pattern** (api-response, pagination, auth schemas)

### Explicitly excluded dependencies (from AGENTS.md files)

| Exclusion | Source |
|---|---|
| Redis | spinjitzu `AGENTS.md` — out of scope V1 |
| CQRS / Event Bus | spinjitzu `AGENTS.md` |
| GraphQL | spinjitzu `AGENTS.md` |
| Kafka / RabbitMQ / WebSockets | spinjitzu `AGENTS.md` |
| Elasticsearch | spinjitzu `AGENTS.md` |
| Microservices split | spinjitzu `AGENTS.md` |
| OAuth providers / BetterAuth | spinjitzu `AGENTS.md` |
| Native Postgres ENUM types | spinjitzu `AGENTS.md` — use `varchar` + app-layer validation |
| GIN/trigram indexes | spinjitzu `AGENTS.md` — deferred optimization |
| Generic filter engine | spinjitzu `AGENTS.md` |
| Repository layer (by default) | spinjitzu `AGENTS.md` — only when complexity demands |
| Refresh token rotation | Both repos — access token only |
| `axios` | brick-match `AGENTS.md` — use native `fetch` |
| `winston` / `pino` | brick-match `AGENTS.md` — Nest `Logger` sufficient at template scale |
| `uuid` package | brick-match `AGENTS.md` — use `crypto.randomUUID()` |
| `class-validator` / `class-transformer` | brick-match `AGENTS.md` — in Zod variant only |
| `drizzle-orm` RC tags | spinjitzu `AGENTS.md` — stable versions only |
| `drizzle-kit push` in production | spinjitzu `AGENTS.md` — generate + migrate only |

### NestJS official docs conflicts to flag

| Topic | Repo pattern | Official NestJS note |
|---|---|---|
| `ConfigModule.validate` with Zod | Custom `validate` function throwing `Error` | Supported pattern; Nest also documents `Joi` — Zod is a deliberate choice over Joi |
| Global `ValidationPipe` + per-route Zod pipe | brick-match runs both | Not harmful but redundant; Nest docs assume one validation strategy per app |
| `drizzle-orm/neon-http` | Both repos | Valid for serverless; for long-lived connections, Nest docs ecosystem often shows `pg` pool — document Neon HTTP as intentional for Vercel/Neon |
| `DisabledInProductionGuard` reading `process.env.NODE_ENV` directly | spinjitzu guard bypasses `AppConfigService` | Minor inconsistency with "never access process.env directly" rule — template should use `AppConfigService.isProduction` |

---

## Practical Template Recommendation

Structure the `project-templates` `nestjs` branch as:

1. **Base** — spinjitzu-api bootstrap (`main.ts`, `app.module`, config, common, `DATABASE_CONNECTION` token, health, Docker, `AGENTS.md` skeleton, `trust proxy`).
2. **Variant A: Standalone REST** (`nestjs-starter`) — class-validator DTOs + full Swagger + RBAC decorators + `PublicRead`/`AdminWrite`.
3. **Variant B: Full-stack monorepo** (`nestjs-starter-monorepo-zod`) — `shared-types/` + `ZodValidationPipe` + cookie auth + strict CORS; no global `ValidationPipe`, no `class-validator`.

The two variants share ~80% of files (config, database, common interceptors/filters, throttler, auth core). The fork point is validation transport, auth delivery, and CORS — not the entire project structure.
