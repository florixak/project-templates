# nextjs-starter

Personal Next.js project template. Production-ready foundation for every new project.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict + erasableSyntaxOnly) |
| Styling | Tailwind CSS v4 + shadcn/ui (base-lyra) |
| Linting | Biome v2 |
| Testing | Vitest |
| Git hooks | Husky + lint-staged + commitlint |
| Package manager | pnpm |
| Data fetching | TanStack Query v5 |
| Internationalization | next-intl v4 (English + Czech) |

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server (Turbopack)
pnpm dev
```

## Environment Variables

See [`.env.example`](.env.example) for all available variables.

The only required variable is:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm check` | Run Biome linter + formatter check |
| `pnpm check:write` | Auto-fix with Biome |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once (CI) |

## Project Structure

```
app/
  [locale]/             # Every page lives under the locale segment
    layout.tsx          # Root layout: <html lang>, providers, fonts
    error.tsx           # Runtime error boundary ("use client")
    not-found.tsx       # Localized 404 page
    (main)/             # Route group holding the actual pages
      page.tsx          # Home page
      loading.tsx       # Suspense loading UI
    [...rest]/page.tsx  # Unmatched paths -> localized 404
  global-error.tsx      # Root layout error fallback ("use client")
  not-found.tsx         # 404 for requests with no locale (see below)
  robots.ts             # robots.txt
  sitemap.ts            # sitemap.xml, one entry per locale
  manifest.ts           # Web app manifest
  opengraph-image.tsx   # OG image generation

i18n/
  routing.ts            # Locales, default locale, prefix strategy
  request.ts            # Per-request config + message loading
  navigation.ts         # Locale-aware Link/redirect/usePathname/useRouter
  messages.spec.ts      # Guards en/cs against translation drift
messages/
  en.json               # Source language
  cs.json               # Czech translation
proxy.ts                # next-intl locale resolution (was middleware.ts)
global.d.ts             # Strict types for message keys and Locale

actions/                # Server Actions (domain-split, "use server")
components/
  layout/               # Header, Footer, ThemeProvider, ThemeToggle, LocaleSwitcher
  providers/            # QueryProvider and other client providers
  query/                # AsyncQueryState, QueryRefetchIndicator
  skeletons/            # Loading skeleton components
  ui/                   # shadcn/ui components
hooks/                  # Custom hooks (use-kebab-case.ts)
lib/
  api/
    query-client.ts     # getQueryClient(), SSR-safe singleton
  config.ts             # siteConfig
  env.ts                # Type-safe environment variables
  metadata.ts           # createMetadata() factory + hreflang helpers
  structured-data.ts    # JSON-LD schema helpers
  utils.ts              # cn(), absoluteUrl()
types/
  index.ts              # Shared type definitions
```

## Conventions

- **No enums** — use `as const` objects with derived union types
- **Server Components by default** — add `"use client"` only when needed
- **Type-safe env vars** — always access via `@/lib/env`, never raw `process.env`
- **Navigation** — import `Link`, `redirect`, `usePathname` and `useRouter` from `@/i18n/navigation`, never from `next/link` or `next/navigation`, or the active locale is dropped
- **No hardcoded copy** — user-facing strings belong in `messages/*.json`
- **Commits** — follow [Conventional Commits](https://www.conventionalcommits.org)

## Internationalization

English is the source language, Czech is the translation. The locale is resolved
purely from the URL — there is no `accept-language` sniffing and no locale
cookie, so a given URL always renders the same language and stays cacheable.

| URL | Locale |
|---|---|
| `/`, `/about` | English (default, unprefixed) |
| `/cs`, `/cs/about` | Czech |
| `/en`, `/en/about` | Redirects to `/`, `/about` |

Change any of this in [`i18n/routing.ts`](i18n/routing.ts) — `localePrefix`,
`localeDetection` and `localeCookie` are all set explicitly there.

### Using translations

Message keys are type-checked against `messages/en.json`, so a typo or a missing
key fails `pnpm typecheck`.

```tsx
// Server Component (the default)
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("HomePage")
  return <h1>{t("title")}</h1>
}
```

```tsx
// Client Component — no extra setup, messages are inherited from the layout
"use client"
import { useTranslations } from "next-intl"
```

```tsx
// Metadata, where the locale has to be passed explicitly to stay static
export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return createMetadata({ locale, title: t("title") })
}
```

### Adding a page

Create it under `app/[locale]/(main)/`, and call `setRequestLocale(locale)`
before any `next-intl` API so the route can still be rendered statically:

```tsx
export default async function AboutPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  // ...
}
```

Then add its pathname to the `pathnames` array in
[`app/sitemap.ts`](app/sitemap.ts) so every locale is indexed with the correct
`hreflang` alternates.

### Adding a locale

1. Add the code to `locales` and a label to `localeLabels` in `i18n/routing.ts`.
2. Add an `og:locale` entry to `ogLocales` in `lib/metadata.ts`.
3. Copy `messages/en.json` to `messages/<code>.json` and translate it.
4. If the language needs glyphs outside `latin`/`latin-ext`, add the matching
   subset to the fonts in `app/[locale]/layout.tsx`.

`pnpm test:run` fails if a locale is missing a key or uses different ICU
arguments than English.

### Notes

- `app/not-found.tsx` and `app/global-error.tsx` render outside the `[locale]`
  segment, so they cannot be translated and are intentionally English-only.
  Localized 404s live in `app/[locale]/not-found.tsx`.
- `[...rest]/page.tsx` sits outside the `(main)` group on purpose. A
  `loading.tsx` above it would open a streaming boundary and downgrade its 404
  to a soft 404 (a `200` response showing 404 content).
- `i18n/request.ts` uses `requestLocale`, which is stable on Next.js 16.2. Once
  the project is on Next.js 16.3+, it can migrate to
  [`next/root-params`](https://next-intl.dev/blog/nextjs-root-params) and drop
  the `setRequestLocale` calls.

## Adding Optional Integrations

Documented in `.env.example`. Install per project:

- **Database**: `drizzle-orm` + `drizzle-kit` + `@neondatabase/serverless`
- **Auth**: `better-auth` (Drizzle adapter, email + Google OAuth)
- **Payments**: `stripe`
- **Email**: `resend`
- **Client state**: `zustand`
- **Forms**: `@tanstack/react-form`
