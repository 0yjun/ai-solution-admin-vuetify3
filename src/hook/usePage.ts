import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/types'
import { createEmptyPage } from '@/utils/initObjects'
import type { PageType } from '@/types/page'
import qs from 'qs'
import type { PagingParams } from '@/types/pagingParams'

export function usePage<T> (fetchUrl: string,defaultSize = 10) {
  const page = ref<PageType<T>>(createEmptyPage<T>(defaultSize))
  const errorMessage = ref('')

  async function fetchPage (params: PagingParams): Promise<boolean> {
    errorMessage.value = ''
    try {
      const { data: api } = await axios.get<ApiResponse<PageType<T>>>(fetchUrl, { params, paramsSerializer: p =>qs.stringify(p, { arrayFormat: 'repeat' }) })
      if (api.code === 'SUCCESS' && api.data) {
        page.value = api.data
        return true
      } else {
        errorMessage.value = api.message
        page.value = createEmptyPage<T>(defaultSize)
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
      page.value = createEmptyPage<T>(defaultSize)
      return false
    }
  }

  function reset () {
    page.value = createEmptyPage<T>(defaultSize)
    errorMessage.value = ''
  }

  return { page, fetchPage, reset, errorMessage }
}
