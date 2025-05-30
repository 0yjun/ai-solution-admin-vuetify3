import type { PaginatedResult } from '@/hooks/usePage.types'
import type { DataTableHeader, DataTableOptions } from './data-table.type'


export interface IndexListProps<T> {
  pagination: PaginatedResult<T>
  options: DataTableOptions
  headers: DataTableHeader[]
  isLoading?: boolean
}
