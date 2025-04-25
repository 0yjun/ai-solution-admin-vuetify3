export interface MenuClientDto {
  id: number
  name: string
  url: string
  icon: string
  parentId: number | null
  children?: MenuClientDto[]
}
