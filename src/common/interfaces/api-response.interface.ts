import { PaginationMeta } from './pagination-meta.interface';

export interface ApiSuccessResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface ApiSuccessResponseWithPagination<T> {
  data: T;
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}
