import { ref } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

type Params = Record<string, unknown>

type FetchOptions = {
  /** 추가할 쿼리 파라미터 */
  params?: Params
  /** URL 뒤에 붙일 path variable */
  pathVariable?: string | number
  /** axios 요청 설정 */
  config?: AxiosRequestConfig
}

export function useSearch<T> (
  fetchUrl: string,
  defaultParams: Params = {}
) {
  const data = ref<T|null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref('')

  /**
   * 데이터 조회
   * @param options.params - 추가 쿼리 파라미터
   * @param options.pathVariable - URL 뒤에 붙일 path variable
   * @param options.config - axios 요청 설정
   */
  async function fetch ({ params = {}, pathVariable, config = {} }: FetchOptions = {}) {
    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''

    // URL 구성
    const url = pathVariable != null
      ? `${fetchUrl}/${pathVariable}`
      : fetchUrl

    // 쿼리 파라미터 병합
    const mergedParams: Params = { ...defaultParams, ...params }

    try {
      const response = await axios.get<ApiResponse<T>>(url, {
        params: mergedParams,
        ...config,
      })

      if (response.data.code === 'SUCCESS' && response.data.data) {
        data.value = response.data.data
        isSuccess.value = true
        return true
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        errorMessage.value = err.response.data?.message || err.message
      } else if (err instanceof Error) {
        errorMessage.value = err.message
      } else {
        errorMessage.value = '알 수 없는 오류'
      }
      data.value = null
      isSuccess.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    isSuccess,
    errorMessage,
    fetch,
  }
}
