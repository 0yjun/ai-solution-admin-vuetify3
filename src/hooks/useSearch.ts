import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

/**
 * useSearch 훅
 * @param fetchUrl - 조회할 엔드포인트 URL
 * @param defaultParams - 초기 요청 파라미터 객체
 * @returns data, isLoading, isSuccess, errorMessage, fetch
 */
export function useSearch<T> (fetchUrl: string, defaultParams: Record<string, any> = {}) {
  const data = ref<T | T[] | null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref('')

  /**
     * 데이터 조회
     * @param extraParams - fetch 호출 시 추가할 파라미터
     * @param config - axios 요청 설정
     * @returns Promise<boolean> - 호출 성공 여부
     */
  async function fetch (
    extraParams: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ): Promise<boolean> {
    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''

    try {
      const { data: resp } = await axios.get<T | T[]>(fetchUrl, {
        params: { ...defaultParams, ...extraParams },
        ...config,
      })
      data.value = resp
      isSuccess.value = true
      return true
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
