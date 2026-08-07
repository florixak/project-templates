import { Link } from '@tanstack/react-router'

import { siteConfig } from '#/lib/config.ts'
import { cn } from '#/lib/utils.ts'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/demo/search', label: 'Search' },
  { to: '/demo/server-fn', label: 'Server Fn' },
  { to: '/demo/stream', label: 'Stream' },
  { to: '/demo/ssr', label: 'SSR Modes' },
] as const

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="font-semibold tracking-tight text-foreground hover:opacity-80"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              )}
              activeProps={{
                className:
                  'rounded-md px-2.5 py-1.5 bg-accent text-accent-foreground',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
