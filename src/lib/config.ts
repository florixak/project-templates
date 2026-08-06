import { env } from '#/env.ts'

export const siteConfig = {
  name: env.VITE_APP_TITLE,
  description:
    'Production-ready TanStack Start boilerplate with typed routes, Query SSR, and server functions.',
  github: 'https://github.com/florixak/project-templates',
} as const
