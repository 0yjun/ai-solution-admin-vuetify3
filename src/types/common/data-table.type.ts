export interface DataTableHeader {
  /** 컬럼에 표시할 제목(text) */
  title: string
  /** 바인딩할 아이템 속성(key) */
  value: string
  /** 정렬 가능 여부 (기본 true) */
  sortable?: boolean
  /** 정렬 키와 분리해 개별 정렬 허용 여부 (기본 false) */
  filterable?: boolean
  /** 컬럼 너비 (예: '20%','100px') */
  width?: string
  /** 정렬 방향 표시 위치: 'start' | 'center' | 'end' */
  align?: 'start' | 'center' | 'end'
  /** 추가 CSS 클래스 */
  class?: string
  key?: string
}

export interface SortBy {
  key: string
  order: 'asc' | 'desc'
}

/** v-data-table 의 옵션 객체 */
export interface DataTableOptions {
  /** 현재 페이지 (1-based) */
  page: number

  /** 페이지당 항목 수 */
  itemsPerPage: number

  /** 정렬 기준 목록 (키 + 방향) */
  sortBy: SortBy[]

  /** 그룹핑할 컬럼 키 목록 */
  groupBy?: string[]

  /** (선택) 그룹 내 정렬 방향 */
  groupDesc?: boolean[]

  /** (선택) 다중 정렬 허용 여부 */
  multiSort?: boolean

  /** (선택) 반드시 하나 이상의 정렬 기준을 유지할지 여부 */
  mustSort?: boolean
}
