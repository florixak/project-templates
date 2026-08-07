# AGENTS.md — TanStack Start Template

Binding conventions for humans and coding agents working in this template.

## Stack

- TanStack Start + TanStack Router (file routes in `src/routes`)
- TanStack Query with `setupRouterSsrQueryIntegration`
- Zod for search params, server function payloads, and forms
- Tailwind CSS v4 + shadcn/ui primitives
- Nitro Node adapter for deploy-anywhere output
- ESLint (`@tanstack/eslint-config`) + Prettier
- Vitest + Testing Library
- Husky + lint-staged + commitlint (conventional commits)

## Hard rules

1. **Router is the app model.** Prefer `createFileRoute`, loaders, search schemas, `Link`, and route boundaries. Do not invent Next.js / Remix APIs.
2. **Server boundaries are explicit.** Put secret/DB work in `*.server.ts` (or `createServerOnlyFn`) and expose it through `createServerFn` in `src/functions/*.functions.ts`.
3. **Validate at the edge.** Use Zod for `validateSearch`, `.validator()` on server functions, and TanStack Form validators.
4. **Unified mutation responses.** Prefer `ok()` / `fail()` from `src/lib/api-response.ts` for server function results consumed by client mutations.
5. **Choose SSR mode per route.** Default is full SSR (`defaultSsr: true` in `src/start.ts`). Use `ssr: 'data-only'` or `ssr: false` intentionally.
6. **Env access goes through `src/env.ts`.** Do not sprinkle raw `process.env` / `import.meta.env` reads in feature code.
7. **No TypeScript `enum`.** Use `as const` objects and derived union types.
8. **Path aliases.** Prefer `#/*` (package imports) or `@/*` for `src/*`.
9. **Commits** must follow Conventional Commits (`feat:`, `fix:`, `chore:`, …).

## Where things live

| Concern             | Location                       |
| ------------------- | ------------------------------ |
| Routes              | `src/routes/**`                |
| Server functions    | `src/functions/*.functions.ts` |
| Server-only helpers | `src/server/*.server.ts`       |
| Query options       | `src/hooks/query-options.ts`   |
| Shared UI           | `src/components/**`            |
| Env schema          | `src/env.ts`                   |
| Site metadata       | `src/lib/config.ts`            |

## Commands

```bash
pnpm install
cp .env.example .env.local
pnpm dev
pnpm check
pnpm typecheck
pnpm test:run
pnpm build
pnpm start   # node .output/server/index.mjs
```

## Optional integrations (not pre-installed)

Document only — add when a project needs them:

- Database: Drizzle + Postgres/Neon
- Auth: Better Auth / Clerk
- Payments: Stripe
- Email: Resend
- Analytics: PostHog / Sentry
