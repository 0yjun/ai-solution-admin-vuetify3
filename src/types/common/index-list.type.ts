import type { DataTableHeader, DataTableOptions } from './data-table.type'
import type { PaginatedResult } from './page.type'

export interface IndexListProps<T = any> {
  pagination: PaginatedResult<T>
  options: DataTableOptions
  headers: DataTableHeader[]
}
