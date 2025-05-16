import type { PaginatedResult } from './page.type'

export interface IndexListProps<T> {
  pagenation: PaginatedResult<T>
  options: Record<string, any>
  headers: object[]
  onOptionsUpdate: (value: any) => void

  onUpdate?: (item: T) => void
  onDelete?: (item: T) => void
  onRowClick?: (item: T) => void
}
