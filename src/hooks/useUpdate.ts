import type { ApiResponse } from '@/types'
import axios from 'axios'
import type { createRequest } from './useCreate types'

export function useUpdate<T> (
  baseUrl: string
) {
  const data = ref<T | null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref<string>('')

  /**
     * @param pathVariable
     *   - 단일 PK: '123'
     *   - 비밀번호 초기화처럼 추가 경로가 필요한 경우: '123/password/reset'
     * @param payload
     *   - 수정할 필드들을 담은 객체
     */
  async function mutate ({ payload, pathVariable, config={} }: createRequest<T>): Promise<T | null> {
    const url = `${baseUrl}/${pathVariable}`

    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''
    data.value = null

    try {
      const { data: resp } = await axios.put<ApiResponse<T>>(url, payload, config)
      if (resp.code === 'SUCCESS' && resp.data !== undefined) {
        data.value = resp.data
        alert(resp.message)
        isSuccess.value = true
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
