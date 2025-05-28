import type { AxiosRequestConfig } from 'axios'

export interface createRequest<T> {
  payload?: T
  /** URL 뒤에 붙일 path variable */
  pathVariable?: string | number
  /** axios 요청 설정 */
  config?: AxiosRequestConfig
}
