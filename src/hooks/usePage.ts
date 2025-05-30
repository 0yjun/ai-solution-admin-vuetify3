import { ref } from 'vue'
import axios from 'axios'
import qs from 'qs'
import type {
  DataTableOptions,
  PaginatedResult,
  SortBy,
} from './usePage.types'
import type { ApiResponseSuccess } from '@/types/common/api.type'

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
  const errorMessage = ref('')
  const hasInitialized = ref(false)
  const isSuccess = ref(false)
  const isLoading = ref(false)

  async function fetchPage (extra: Record<string, string|number|object|null> = {}): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    // build params from options and extra
    const params = {
      page: options.value.page - 1,
      size: options.value.itemsPerPage,
      sort: options.value.sortBy.map(({ key, order }: SortBy) => `${key},${order}`),
      ...extra,
    }

    try {
      const { data: api } = await axios.get<ApiResponseSuccess<PaginatedResult<T>>>(fetchUrl, {
        params,
        paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' }),
      })

      if (api.code === 'SUCCESS' && api.data) {
        pagination.value = api.data
        isSuccess.value = true
      } else {
        errorMessage.value = api.message
        pagination.value = createEmptyPage<T>(defaultSize)
        isSuccess.value = false
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
      isSuccess.value = false
    } finally {
      isLoading.value = false
    }

    return isSuccess.value
  }

  function onOptionsUpdate (newOpts: DataTableOptions) {
    if (!hasInitialized.value) {
      hasInitialized.value = true
      return
    }
    options.value.page = newOpts.page
    options.value.itemsPerPage = newOpts.itemsPerPage
    if (newOpts.sortBy.length) {
      options.value.sortBy = [...newOpts.sortBy]
    }
    fetchPage()
  }

  return {
    pagination,
    options,
    fetchPage,
    onOptionsUpdate,
    errorMessage,
    isSuccess,
    isLoading,
  }
}
