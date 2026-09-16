import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

// proxy.ts replaces middleware.ts in Next.js 16.
// Runs on the Node.js runtime (not Edge).
// Use for redirects and rewrites ONLY — do not add auth logic here.
//
// next-intl's proxy resolves the locale for every request: it rewrites
// unprefixed paths onto the `[locale]` segment (`/about` -> `/en/about`) and
// redirects requests that carry a redundant default-locale prefix
// (`/en/about` -> `/about`).
export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except for
    // - API and tRPC routes
    // - Next.js internals (`/_next`) and Vercel internals (`/_vercel`)
    // - files with an extension (e.g. `favicon.ico`, `robots.txt`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
}
