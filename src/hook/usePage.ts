import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse, PaginatedResult } from '@/types'
import { createEmptyPage } from '@/utils/initObjects'
import qs from 'qs'
import type { PagingParamsProps } from '@/types/common/paging-params.type'

export function usePage<T> (fetchUrl: string,defaultSize = 10) {
  const pagenation = ref<PaginatedResult<T>>(createEmptyPage<T>(defaultSize))
  const errorMessage = ref('')

  async function fetchPage (params: PagingParamsProps): Promise<boolean> {
    errorMessage.value = ''
    try {
      const { data: api } = await axios.get<ApiResponse<PaginatedResult<T>>>(fetchUrl, { params, paramsSerializer: p =>qs.stringify(p, { arrayFormat: 'repeat' }) })
      if (api.code === 'SUCCESS' && api.data) {
        pagenation.value = api.data
        return true
      } else {
        errorMessage.value = api.message
        pagenation.value = createEmptyPage<T>(defaultSize)
        return false
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        errorMessage.value = err.response.data.message
      } else if (err instanceof Error) {
        errorMessage.value = err.message
      } else {
        errorMessage.value = '알 수 없는 오류'
      }
      pagenation.value = createEmptyPage<T>(defaultSize)
      return false
    }
  }

  function reset () {
    pagenation.value = createEmptyPage<T>(defaultSize)
    errorMessage.value = ''
  }

  return { pagenation, fetchPage, reset, errorMessage }
}
