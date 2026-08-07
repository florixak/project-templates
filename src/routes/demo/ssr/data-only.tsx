import { createFileRoute } from '@tanstack/react-router'

import { LoadingIndicator } from '#/components/state/loading-indicator.tsx'
import { getPostsFn } from '#/functions/demo.functions.ts'

export const Route = createFileRoute('/demo/ssr/data-only')({
  ssr: 'data-only',
  loader: async () => {
    const posts = await getPostsFn()
    return {
      mode: 'data-only' as const,
      loadedAt: new Date().toISOString(),
      titles: posts.map((post) => post.title),
    }
  },
  pendingComponent: () => (
    <LoadingIndicator text="Hydrating data-only route…" />
  ),
  component: DataOnlySsrPage,
})

function DataOnlySsrPage() {
  const data = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">ssr: data-only</h1>
      <p className="text-sm text-muted-foreground">
        The loader ran on the server. This component was rendered on the client
        after hydration (pending UI may appear first).
      </p>
      <div className="rounded-xl border border-border/80 p-4 text-sm">
        <p className="text-muted-foreground">Loaded at {data.loadedAt}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {data.titles.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
