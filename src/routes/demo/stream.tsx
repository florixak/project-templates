import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'

import { LoadingIndicator } from '#/components/state/loading-indicator.tsx'
import { getSlowMessageFn } from '#/functions/demo.functions.ts'

export const Route = createFileRoute('/demo/stream')({
  loader: async () => {
    return {
      shell: {
        title: 'Streaming shell',
        note: 'This content is available immediately while slower work continues.',
      },
      // Keep the promise unresolved so SSR can stream the fallback, then the result.
      deferred: getSlowMessageFn(),
    }
  },
  component: StreamDemoPage,
})

function StreamDemoPage() {
  const { shell, deferred } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{shell.title}</h1>
        <p className="text-muted-foreground text-sm">{shell.note}</p>
      </div>

      <section className="rounded-xl border border-border/80 p-5">
        <h2 className="font-medium tracking-tight">Immediate paint</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Full-document SSR streams HTML as Suspense boundaries resolve. The
          block below was intentionally delayed on the server.
        </p>
      </section>

      <Suspense
        fallback={<LoadingIndicator text="Streaming deferred chunk…" />}
      >
        <DeferredMessage promise={deferred} />
      </Suspense>
    </div>
  )
}

function DeferredMessage({
  promise,
}: {
  promise: Promise<{ message: string; generatedAt: string }>
}) {
  const data = use(promise)

  return (
    <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
      <h2 className="font-medium tracking-tight">Deferred chunk</h2>
      <p className="mt-2 text-sm">{data.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Generated at {data.generatedAt}
      </p>
    </section>
  )
}
