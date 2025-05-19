export interface MemberClientDto {
  username: string
  role: string
}

export interface MemberAdminDto {
  id: number | null
  username: string
  role: string
  description: string
}
