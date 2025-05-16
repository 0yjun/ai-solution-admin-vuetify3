import type { Page, Pageable, Sort } from '@/types'

// 공통으로 쓸 기본 Sort/Pageable 템플릿
const defaultSort: Sort = { empty: true, sorted: false, unsorted: true }
const defaultPageable: Pageable = {
  pageNumber: 0,
  pageSize: 10,
  sort: defaultSort,
  offset: 0,
  paged: true,
  unpaged: false,
}

/**
 * 빈 Page<T> 객체 생성기
 */
export function createEmptyPage<T> (pageSize = 10): Page<T> {
  return {
    content: [],
    pageable: { ...defaultPageable, pageSize },
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: pageSize,
    number: 0,
    sort: defaultSort,
    first: true,
    numberOfElements: 0,
    empty: true,
  }
}
