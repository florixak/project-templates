# Agent Rules

Rules for AI agents (Cursor, Claude, etc.) working in this codebase.

## TypeScript

- Never use `enum` — use `as const` objects with derived union types
- Always `await` async APIs: `cookies()`, `headers()`, `params`, `searchParams`
- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- Mark server-only files with `import "server-only"` at the top

## Styling

- Use `cn()` from `@/lib/utils` for conditional class merging
- Use Tailwind utility classes — no inline styles in components
- Semantic color tokens only (e.g. `bg-background`, `text-foreground`, `bg-primary`) — no raw colors
- Dark mode is handled by `next-themes` via the `.dark` CSS class

## Components

- Server Components by default — add `"use client"` only when necessary
- shadcn components live in `components/ui/` — do not edit them directly
- Feature components go in feature-based subdirectories under `components/`
- Loading skeletons go in `components/skeletons/`

## File Conventions

- Custom hooks: `hooks/use-kebab-case.ts`
- Server actions: `actions/domain-name-actions.ts` with `"use server"` directive
- Never add auth logic to `proxy.ts` — use Server Actions or a Data Access Layer

## Environment Variables

- Access env vars only through `@/lib/env` (type-safe, validated at build time)
- Never use `NEXT_PUBLIC_` prefix for secrets or API keys

## Commits

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Keep commits small and focused
