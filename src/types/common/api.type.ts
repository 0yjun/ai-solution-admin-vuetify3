export interface ApiResponseSuccess<T> {
  code: 'SUCCESS'
  message: string
  data: T
}

// 실패 응답: data 필드가 아예 없음
export interface ApiResponseError {
  // 'SUCCESS'가 아닌 모든 실패 코드
  code: Exclude<string, 'SUCCESS'>
  message: string
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError
