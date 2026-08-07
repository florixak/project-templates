import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { LoadingIndicator } from '#/components/state/loading-indicator.tsx'

export const Route = createFileRoute('/demo/ssr/client')({
  ssr: false,
  pendingComponent: () => (
    <LoadingIndicator text="Bootstrapping client-only route…" />
  ),
  component: ClientOnlySsrPage,
})

function ClientOnlySsrPage() {
  const [now, setNow] = useState<string>('…')

  useEffect(() => {
    setNow(new Date().toISOString())
  }, [])

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">ssr: false</h1>
      <p className="text-sm text-muted-foreground">
        This route skips server loaders and server component rendering on the
        initial request. Useful when you need browser-only APIs.
      </p>
      <div className="rounded-xl border border-border/80 p-4 text-sm">
        <p>
          Client clock after mount:{' '}
          <span className="font-medium text-foreground">{now}</span>
        </p>
        <p className="mt-2 text-muted-foreground">
          localStorage available:{' '}
          {typeof window !== 'undefined' && 'localStorage' in window
            ? 'yes'
            : 'no'}
        </p>
      </div>
    </div>
  )
}
