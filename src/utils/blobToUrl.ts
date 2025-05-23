/**
 * Blob 또는 base64 문자열을 브라우저에서 바로 렌더링 가능한 URL로 변환합니다.
 * @param rawBlob - Blob 객체이거나, "iVBORw0KGgoAAAANSUhEUg..." 같은 base64 문자열
 * @param mimeType - base64 문자열일 때 사용할 MIME 타입 (기본: image/png)
 * @returns object URL 또는 data URL
 */
export function blobToUrl (
  rawBlob: Blob | string,
  mimeType: string = 'image/png'
): string {
  try {
    if (typeof rawBlob === 'string') {
    // 이미 data URL 형태라면 그대로 반환
      if (rawBlob.startsWith('data:')) {
        return rawBlob;
      }
      // base64 문자열이라면 data URL로 감싸기
      return `data:${mimeType};base64,${rawBlob}`;
    }

    // Blob 객체라면 object URL 생성
    return URL.createObjectURL(rawBlob);
  } catch (error) {
    console.error(error)
    return ''
  }
}
