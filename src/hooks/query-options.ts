import { queryOptions } from '@tanstack/react-query'

import { QUERY_KEYS } from '#/constants/query-keys.ts'
import {
  getPostFn,
  getPostsFn,
  searchPostsFn,
} from '#/functions/demo.functions.ts'
import type { postsSearchSchema } from '#/functions/demo.functions.ts'
import type { z } from 'zod'

type PostsSearch = z.infer<typeof postsSearchSchema>

export const createPostsQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.posts,
    queryFn: () => getPostsFn(),
  })

export const createPostQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.post(id),
    queryFn: () => getPostFn({ data: { id } }),
  })

export const createPostsSearchQueryOptions = (search: PostsSearch) =>
  queryOptions({
    queryKey: [...QUERY_KEYS.posts, 'search', search] as const,
    queryFn: () => searchPostsFn({ data: search }),
  })
