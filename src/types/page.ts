// 페이징 응답용 제네릭 타입
export interface SortType {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface PageableType {
  pageNumber: number
  pageSize: number
  sort: SortType
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface PageOptionsType{
  page: number
  itemsPerPage: number,
  sortBy: { key:string , order: 'desc'|'asc' }[] | []
}

export interface PageType<T> {
  content: T[]
  pageable: PageableType
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: SortType
  first: boolean
  numberOfElements: number
  empty: boolean
}
