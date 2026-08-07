import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { fail, ok } from '#/lib/api-response.ts'
import type { ApiResponse } from '#/lib/api-response.ts'
import { getPostById, listPosts, searchPosts } from '#/server/posts.server.ts'
import type { Post } from '#/server/posts.server.ts'

export const postsSearchSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  tag: z.string().trim().max(40).optional().catch(undefined),
})

export const greetingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(40, 'Keep it under 40 characters'),
})

export const getPostsFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Post>> => {
    return listPosts()
  },
)

export const getPostFn = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<Post | null> => {
    return getPostById(data.id)
  })

export const searchPostsFn = createServerFn({ method: 'GET' })
  .validator(postsSearchSchema)
  .handler(async ({ data }): Promise<Array<Post>> => {
    return searchPosts(data)
  })

export const greetFn = createServerFn({ method: 'POST' })
  .validator(greetingSchema)
  .handler(async ({ data }): Promise<ApiResponse<{ message: string }>> => {
    try {
      return ok({
        message: `Hello, ${data.name}! This response came from a typed server function.`,
      })
    } catch (error) {
      return fail('Unable to greet', [
        error instanceof Error ? error.message : 'Unknown error',
      ])
    }
  })

export const getSlowMessageFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ message: string; generatedAt: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return {
      message: 'This chunk arrived after the shell streamed to the client.',
      generatedAt: new Date().toISOString(),
    }
  },
)
