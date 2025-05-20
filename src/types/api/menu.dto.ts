export interface MenuClientDto {
  id: number;
  name: string;
  url: string;
  seq: number;
  icon: string;
  children?: MenuClientDto[] | null;
  prevMenuId?: number | null;
  prevMenuUrl?: string | null;
  prevMenuName?: string | null;
  nextMenuId?: number | null;
  nextMenuUrl?: string | null;
  nextMenuName?: string | null;
}

export interface MenuAdminDto {
  id: number | null;
  name: string;
  description: string;
  url: string;
  seq: number;
  icon: string;
  active: boolean;
  parentId: number | null;
  children?: MenuAdminDto[] | null;
  roles: string[];
  prevMenuId?: number | null;
  nextMenuId?: number | null;
}

export interface MenuUpdateRequestDto {
  /** 메뉴 아이디 */
  id: number

  /** 메뉴명 */
  name: string

  /** 메뉴 설명 */
  description: string

  /** URL */
  url: string

  /** 메뉴 순서 */
  seq: number

  /** 아이콘명 */
  icon: string

  /** 활성화 여부 */
  isActive: boolean

  /** 부모 메뉴 ID (없으면 null) */
  parentId: number | null

  /** 허용된 Role 목록 (최소 1개, 최대 4개) */
  roles: string[]

  /** 이전 메뉴 ID (없으면 null) */
  prevMenuId?: number | null

  /** 다음 메뉴 ID (없으면 null) */
  nextMenuId?: number | null
}
