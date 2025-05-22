/**
 * 개별 도움말 이미지 정보
 */
export interface HelpImageDto {
  /** 이미지 고유 ID */
  id: number;
  /** 이미지 바이너리 데이터 (Base64 문자열) */
  blob: string;
  /** 이미지 설명 */
  description: string;
  /** 이미지 순서 (1부터 시작) */
  seq: number;
  /* File */
  file: File
}

/**
 * 도움말 정보
 */
export interface HelpDto {
  /** 도움말 고유 ID */
  helpId: number;
  /** 도움말 본문 설명 */
  helpDescription: string;
  /** 연관된 이미지 리스트 (최대 3개) */
  images: HelpImageDto[];
  menuId: number
}

export interface HelpCreateDto {
  /** 도움말 고유 ID */
  /** 도움말 본문 설명 */
  helpDescription: string;
  menuId: number;
  /** 연관된 이미지 리스트 (최대 3개) */
  images: HelpImageDto[];
}
