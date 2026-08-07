# TanStack Start Template

Production-ready TanStack Start starter with file-based routing, Query SSR, typed server functions, Zod validation, and Nitro deployment.

## Stack

| Area          | Choice                                        |
| ------------- | --------------------------------------------- |
| Framework     | TanStack Start (React 19)                     |
| Routing       | TanStack Router (file-based)                  |
| Data          | TanStack Query + route loaders                |
| Forms         | TanStack Form + Zod                           |
| Styling       | Tailwind CSS v4 + shadcn/ui                   |
| Runtime       | Nitro (Node-compatible)                       |
| Lint / format | ESLint (`@tanstack/eslint-config`) + Prettier |
| Tests         | Vitest + Testing Library                      |
| Git hooks     | Husky + lint-staged + commitlint              |

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](.env.example). Access values through [`src/env.ts`](src/env.ts) only.

| Variable         | Required | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| `VITE_APP_TITLE` | No       | Document / brand title (defaults in schema)      |
| `SERVER_URL`     | No       | Absolute server URL for server-side integrations |

## Scripts

| Script       | Description                    |
| ------------ | ------------------------------ |
| `pnpm dev`   | Vite dev server on port 3000   |
| `pnpm build` | Production Nitro build         |
| `pnpm start` | Run `.output/server/index.mjs` |

| `pnpm preview` | Vite preview |
| `pnpm check` | Prettier check + ESLint |
| `pnpm format` | Prettier write |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` / `pnpm test:run` | Vitest watch / CI |
| `pnpm generate-routes` | Regenerate `routeTree.gen.ts` |

## Project Structure

```text
src/
  components/          # layout, state, demo UI, shadcn primitives
  constants/           # query keys and shared constants
  functions/           # createServerFn wrappers (safe to import anywhere)
  hooks/               # queryOptions factories
  integrations/        # TanStack Query provider + devtools
  lib/                 # api-response, config, utils
  routes/              # file-based routes + demos
  server/              # server-only helpers (*.server.ts)
  env.ts               # typed env (t3-env)
  router.tsx           # router + Query SSR integration
  start.ts             # createStart (CSRF + defaultSsr)
```

## Demo Routes

| Route             | Shows                                            |
| ----------------- | ------------------------------------------------ |
| `/demo/search`    | Zod `validateSearch`, loader + `ensureQueryData` |
| `/demo/server-fn` | Typed server function + form + `ApiResponse`     |
| `/demo/stream`    | Streaming shell with deferred Suspense content   |
| `/demo/ssr`       | Selective SSR: `true` / `data-only` / `false`    |

## Conventions

- Prefer route loaders + Query over ad-hoc client fetching for SSR data.
- Keep secrets and DB access in `src/server/*.server.ts`; expose via `src/functions`.
- Return `{ success: true, data }` / `{ success: false, error }` from mutation-oriented server functions (`src/lib/api-response.ts`).
- Set `ssr` per route when full HTML, data-only, or client-only behavior is required.
- Use Conventional Commits; husky runs lint-staged + commitlint.

## Docker

```bash
# Dev with HMR
docker compose up web

# Production runner
docker compose --profile prod up web-prod --build
```

Multi-stage [`Dockerfile`](Dockerfile): `development` (Vite), `builder`, `runner` (`node .output/server/index.mjs`).

## Deploy with Nitro

```bash
pnpm build
pnpm start
# equivalent: node .output/server/index.mjs
```

Nitro keeps the application model stable while you swap hosting presets. See [Nitro deploy docs](https://v3.nitro.build/deploy).

## Adding Optional Integrations

Not pre-installed — add when needed:

- **Database** — Drizzle + Postgres/Neon
- **Auth** — Better Auth or Clerk
- **Payments** — Stripe
- **Email** — Resend
- **Observability** — Sentry / PostHog

See [`AGENTS.md`](AGENTS.md) for agent-oriented conventions.
