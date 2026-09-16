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

## Internationalization

- English (`en`) is the source language, Czech (`cs`) is the translation
- Never hardcode user-facing copy — every string goes in `messages/en.json` and `messages/cs.json`
- `messages/en.json` defines the valid message keys; they are type-checked, so a missing or misspelled key fails `pnpm typecheck`
- Import `Link`, `redirect`, `usePathname` and `useRouter` from `@/i18n/navigation` — importing them from `next/link` or `next/navigation` silently drops the locale
- Pages go under `app/[locale]/(main)/` and must call `setRequestLocale(locale)` before any `next-intl` API, otherwise the route falls back to dynamic rendering
- Pass ICU arguments that must not be number-formatted as strings — a number renders with a group separator (`2,026` instead of `2026`)
- `app/not-found.tsx` and `app/global-error.tsx` render outside the `[locale]` segment: they have no messages and must stay English
- New `next/font` families need the `latin-ext` subset, which carries the Czech diacritics (č, ě, ř, š, ť, ů, ž)
- `proxy.ts` is next-intl's locale resolution — new redirects or rewrites must compose with it, not replace it

## Environment Variables

- Access env vars only through `@/lib/env` (type-safe, validated at build time)
- Never use `NEXT_PUBLIC_` prefix for secrets or API keys

## Commits

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Keep commits small and focused
