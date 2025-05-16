/** 요청 파라미터 타입 */
export interface PagingParamsProps {
  page: number // 0-based
  size: number
  sort: string[] // ["role,asc","username,desc"] 형태
  [key: string]: any // 추가 필터 (search, role 등)
}

/** 정렬 상태 정보 */
export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

/** v-data-table sortBy 항목 */
export interface SortBy {
  key: string
  order: 'desc' | 'asc'
}

/** 페이징 메타데이터 (Spring Pageable 유사) */
export interface Pageable {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
  sort: Sort
}

/** 페이징된 결과 전체 */
export interface PaginatedResult<T> {
  content: T[]
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number // current page index
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
}

/** DataTable 옵션 */
export interface DataTableOptions {
  page: number
  itemsPerPage: number
  sortBy: SortBy[]
}
