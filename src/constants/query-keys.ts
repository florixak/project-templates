export const QUERY_KEYS = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  greeting: (name: string) => ['greeting', name] as const,
} as const
