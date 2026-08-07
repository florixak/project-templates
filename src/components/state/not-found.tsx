import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button.tsx'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground text-sm">
        The route you requested is not part of this template.
      </p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </section>
  )
}
