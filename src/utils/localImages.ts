import { BASE_URL } from '@/services/apiClient';
import image2_1 from '@/assets/data/image_2_1.jpg';
import image2_2 from '@/assets/data/image_2_2.jpg';
import image3 from '@/assets/data/image3.jpg';

const SERVER_ORIGIN = new URL(BASE_URL).origin;

// 더미 데이터의 contentFilePath(파일명)를 번들된 로컬 이미지로 매핑
// TODO: 백엔드가 모든 첨부 파일을 URL로 내려주면 제거
export const LOCAL_IMAGE_BY_FILENAME: Record<string, string> = {
  'image_2_1.jpg': image2_1,
  'image_2_2.jpg': image2_2,
  'image3.jpg': image3,
};


/**
 * contentFilePath → <img src>로 사용할 수 있는 주소로 변환
 * - 전체 URL(http://...)이면 그대로 사용
 * - 서버 기준 절대 경로(/uploads/...)이면 서버 origin을 붙여서 사용
 * - 더미 데이터용 파일명이면 번들된 로컬 이미지를 사용
 * - 그 외(백엔드가 내려주는 파일명)에는 upload/reviews 정적 경로로 조회
 */
export function resolveContentImageSrc(filePath: string | null | undefined): string | undefined {
  if (!filePath) return undefined;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  if (filePath.startsWith('/')) return `${SERVER_ORIGIN}${filePath}`;
  return LOCAL_IMAGE_BY_FILENAME[filePath] ?? `${SERVER_ORIGIN}/${filePath}`;
}
