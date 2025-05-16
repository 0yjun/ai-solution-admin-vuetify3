/** 정렬 정보 */
export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

/** sortBy 한 건 */
export interface SortBy {
  key: string
  order: 'desc' | 'asc'
}

/** 페이징 메타데이터(스프링 Pageable 유사) */
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
