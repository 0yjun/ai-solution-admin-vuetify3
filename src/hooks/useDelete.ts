import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export function useDelete (baseUrl: string) {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref('')

  /**
     * @param id        삭제 대상 리소스의 ID
     * @param params    DELETE 시 전달할 추가 쿼리 파라미터들 (cascade, force, soft, etc.)
     */
  async function mutate (id: string | number, params: Record<string, unknown> = {}): Promise<boolean> {
    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''

    const url = `${baseUrl}/${id}`
    const config: AxiosRequestConfig = {
      params,
    }

    try {
      const response = await axios.delete(url, config)
      if (response.data.code === 'SUCCESS') {
        isSuccess.value = true
        alert(response.data.message)
        return true
      }

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        errorMessage.value = err.response.data?.message ?? err.message
      } else if (err instanceof Error) {
        errorMessage.value = err.message
      } else {
        errorMessage.value = '알 수 없는 오류'
      }
    } finally {
      isLoading.value = false
    }

    return isSuccess.value
  }

  return {
    isLoading,
    isSuccess,
    errorMessage,
    mutate,
  }
}
