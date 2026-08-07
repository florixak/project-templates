import { createFileRoute } from '@tanstack/react-router'

import { LoadingIndicator } from '#/components/state/loading-indicator.tsx'
import { getPostsFn } from '#/functions/demo.functions.ts'

export const Route = createFileRoute('/demo/ssr/full')({
  ssr: true,
  loader: async () => {
    const posts = await getPostsFn()
    return {
      mode: 'full' as const,
      renderedAt: new Date().toISOString(),
      postCount: posts.length,
    }
  },
  pendingComponent: () => <LoadingIndicator text="Loading full SSR route…" />,
  component: FullSsrPage,
})

function FullSsrPage() {
  const data = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">ssr: true</h1>
      <p className="text-sm text-muted-foreground">
        Loader data and this component markup are included in the initial HTML.
      </p>
      <dl className="rounded-xl border border-border/80 p-4 text-sm">
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted-foreground">Mode</dt>
          <dd>{data.mode}</dd>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted-foreground">Rendered at</dt>
          <dd>{data.renderedAt}</dd>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <dt className="text-muted-foreground">Posts loaded</dt>
          <dd>{data.postCount}</dd>
        </div>
      </dl>
    </div>
  )
}
