export type ApiErrorDetails =
  | Array<string>
  | Array<{ message: string; path?: Array<string | number> }>
  | Record<string, string>
  | string

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

export type ApiErrorResponse = {
  success: false
  error: {
    message: string
    details?: ApiErrorDetails
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function ok<T>(data: T): ApiSuccessResponse<T> {
  return { success: true, data }
}

export function fail(
  message: string,
  details?: ApiErrorDetails,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      message,
      ...(details === undefined ? {} : { details }),
    },
  }
}

export function isOk<T>(
  response: ApiResponse<T>,
): response is ApiSuccessResponse<T> {
  return response.success
}
