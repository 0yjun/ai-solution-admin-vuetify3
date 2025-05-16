import { ref } from 'vue'
import axios from 'axios'
import qs from 'qs'
import type {
  DataTableOptions,
  PaginatedResult,
  PagingParamsProps,
  SortBy,
} from './usePage.types'
import type { ApiResponse } from '@/types/common/api.type'

/** 빈 페이지 생성 유틸 */
function createEmptyPage<T> (size: number): PaginatedResult<T> {
  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: size,
      offset: 0,
      paged: false,
      unpaged: true,
      sort: { empty: true, sorted: false, unsorted: true },
    },
    last: true,
    totalPages: 0,
    totalElements: 0,
    size,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    first: true,
    numberOfElements: 0,
    empty: true,
  }
}

export function usePage<T> (fetchUrl: string, defaultSize = 10) {
  const pagination = ref<PaginatedResult<T>>(createEmptyPage<T>(defaultSize))
  const options = ref<DataTableOptions>({
    page: 1,
    itemsPerPage: defaultSize,
    sortBy: [],
  })
  const params = ref<PagingParamsProps>({
    page: 0,
    size: defaultSize,
    sort: [],
  })
  const errorMessage = ref('')
  const hasInitialized = ref(false)

  async function fetchPage (extra: Record<string, any> = {}): Promise<boolean> {
    errorMessage.value = ''
    // 요청 파라미터 구성
    params.value = {
      page: options.value.page - 1,
      size: options.value.itemsPerPage,
      sort: options.value.sortBy.map(({ key, order }: SortBy) => `${key},${order}`),
      ...extra,
    }
    try {
      const { data: api } = await axios.get<ApiResponse<PaginatedResult<T>>>(fetchUrl, {
        params: params.value,
        paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' }),
      })
      if (api.code === 'SUCCESS' && api.data) {
        pagination.value = api.data
        return true
      } else {
        errorMessage.value = api.message
        pagination.value = createEmptyPage<T>(defaultSize)
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
      pagination.value = createEmptyPage<T>(defaultSize)
      return false
    }
  }

  function onOptionsUpdate (newOpts: DataTableOptions) {
    if(!hasInitialized.value){
      hasInitialized.value = true
      return
    }
    // 페이징·정렬 상태 업데이트 및 자동 조회
    options.value.page = newOpts.page
    options.value.itemsPerPage = newOpts.itemsPerPage
    if (newOpts.sortBy.length) {
      options.value.sortBy = newOpts.sortBy
    }
    fetchPage()
  }

  function reset () {
    pagination.value = createEmptyPage<T>(defaultSize)
    errorMessage.value = ''
  }

  return {
    pagination,
    options,
    params,
    fetchPage,
    onOptionsUpdate,
    reset,
    errorMessage,
  }
}
