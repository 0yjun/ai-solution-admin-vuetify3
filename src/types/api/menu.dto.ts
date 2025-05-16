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
  prevMenuUrl?: string | null;
  prevMenuName?: string | null;
  nextMenuId?: number | null;
  nextMenuUrl?: string | null;
  nextMenuName?: string | null;
}
