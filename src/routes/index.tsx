import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button.tsx'
import { siteConfig } from '#/lib/config.ts'

export const Route = createFileRoute('/')({
  component: Home,
})

const demos = [
  {
    to: '/demo/search',
    title: 'Validated search + Query',
    body: 'Zod search params, route loaders, and ensureQueryData hydration.',
  },
  {
    to: '/demo/server-fn',
    title: 'Typed server functions',
    body: 'Zod-validated payloads, server-only modules, and ApiResponse envelopes.',
  },
  {
    to: '/demo/stream',
    title: 'Streaming SSR',
    body: 'Shell first, deferred content via Suspense and pending UI.',
  },
  {
    to: '/demo/ssr',
    title: 'Selective SSR modes',
    body: 'Compare ssr: true, data-only, and client-only on sibling routes.',
  },
] as const

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="max-w-2xl space-y-4">
        <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {siteConfig.name}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          A lean TanStack Start foundation
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          File-based routes, Query SSR, typed server functions, and Nitro
          deployment — without changing the Router application model.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link to="/demo/search">Explore demos</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              View repo
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <Link
            key={demo.to}
            to={demo.to}
            className="rounded-xl border border-border/80 bg-card/40 p-5 transition-colors hover:border-foreground/20 hover:bg-accent/40"
          >
            <h2 className="font-medium tracking-tight">{demo.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{demo.body}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
