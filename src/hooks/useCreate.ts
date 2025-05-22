import type { ApiResponse } from '@/types'
import axios from 'axios'

export function useCreate<T> (createUrl: string) {
  const data = ref<T | null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref<string>('')

  /**
     * 요청 본문을 받아 새 리소스를 생성합니다.
     * 성공 시 `data`, `isSuccess`를 업데이트하고,
     * 실패 시 `errorMessage`를 설정합니다.
     */
  async function mutate (payload: Partial<T>): Promise<T | null> {
    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''
    data.value = null

    try {
      const { data: resp } = await axios.post<ApiResponse<T>>(createUrl, payload)
      if (resp.code === 'SUCCESS' && resp.data !== undefined) {
        data.value = resp.data
        isSuccess.value = true
        alert(resp.message)
        return resp.data
      } else {
        errorMessage.value = resp.message || '알 수 없는 서버 오류'
        return null
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        errorMessage.value = err.response.data?.message ?? err.message
      } else if (err instanceof Error) {
        errorMessage.value = err.message
      } else {
        errorMessage.value = '알 수 없는 오류'
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    mutate,
    isLoading,
    isSuccess,
    errorMessage,
  }
}
