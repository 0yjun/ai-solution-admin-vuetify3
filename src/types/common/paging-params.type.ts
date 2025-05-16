export interface PagingParamsProps {
  page: number // 0-based
  size: number
  sort: string[] // ["role,asc","username,desc"] 형태
  [key: string]: any // 추가 필터 (search, role 등)
}
