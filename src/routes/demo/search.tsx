import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

import { LoadingIndicator } from '#/components/state/loading-indicator.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { postsSearchSchema } from '#/functions/demo.functions.ts'
import { createPostsSearchQueryOptions } from '#/hooks/query-options.ts'

export const Route = createFileRoute('/demo/search')({
  validateSearch: zodValidator(postsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      createPostsSearchQueryOptions(deps),
    )
  },
  pendingComponent: () => <LoadingIndicator text="Loading posts…" />,
  component: SearchDemoPage,
})

function SearchDemoPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { data: posts } = useSuspenseQuery(
    createPostsSearchQueryOptions(search),
  )

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Validated search params
        </h1>
        <p className="text-muted-foreground text-sm">
          Search state is validated with Zod, loaded in the route loader, and
          hydrated into TanStack Query.
        </p>
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          void navigate({
            search: {
              q: String(formData.get('q') || '') || undefined,
              tag: String(formData.get('tag') || '') || undefined,
            },
          })
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="q">Query</Label>
          <Input
            id="q"
            name="q"
            defaultValue={search.q ?? ''}
            placeholder="server, query, zod…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Input
            id="tag"
            name="tag"
            defaultValue={search.tag ?? ''}
            placeholder="ssr"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Apply filters
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-border/80 px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium">{post.title}</h2>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to="/demo/search"
                    search={{ tag }}
                    className="underline-offset-2 hover:underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{post.body}</p>
          </li>
        ))}
        {posts.length === 0 ? (
          <li className="text-sm text-muted-foreground">No posts matched.</li>
        ) : null}
      </ul>
    </div>
  )
}
