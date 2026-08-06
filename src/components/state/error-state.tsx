import { Link } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function ErrorState({
  error,
  reset,
}: {
  error?: Error
  reset?: () => void
}) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <CircleAlert className="size-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground text-sm">
        {error?.message ||
          'An unexpected error occurred while rendering this route.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset ? (
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </section>
  )
}
