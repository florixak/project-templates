import { createServerOnlyFn } from '@tanstack/react-start'

export type Post = {
  id: string
  title: string
  body: string
  tags: Array<string>
}

const POSTS: Array<Post> = [
  {
    id: '1',
    title: 'Typed server functions',
    body: 'Keep database and secret access behind createServerFn + .server modules.',
    tags: ['server', 'boundaries'],
  },
  {
    id: '2',
    title: 'Validated search params',
    body: 'Zod schemas on validateSearch give you typed Route.useSearch().',
    tags: ['router', 'zod'],
  },
  {
    id: '3',
    title: 'Query SSR prefetch',
    body: 'Loaders call ensureQueryData so the client hydrates without a refetch flash.',
    tags: ['query', 'ssr'],
  },
]

export const listPosts = createServerOnlyFn(async () => {
  await delay(80)
  return POSTS
})

export const getPostById = createServerOnlyFn(async (id: string) => {
  await delay(60)
  return POSTS.find((post) => post.id === id) ?? null
})

export const searchPosts = createServerOnlyFn(
  async (query: { q?: string; tag?: string }) => {
    await delay(120)
    const q = query.q?.trim().toLowerCase()
    const tag = query.tag?.trim().toLowerCase()

    return POSTS.filter((post) => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      const matchesTag = !tag || post.tags.includes(tag)
      return matchesQuery && matchesTag
    })
  },
)

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
