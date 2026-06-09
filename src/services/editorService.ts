import { authClient } from '@/services/apiClient';
import type { EditorContent } from '@/types/api';
import { DUMMY_EDITOR_CONTENT } from '@/utils/editorDummyData';

// ─── 서비스 함수 ──────────────────────────────────────────────────────────────

/**
 * EditorPage: 에디터 진입 시 콘텐츠 + 기존 보고서 초안 로드
 * 좌측 원본 패널(이미지·텍스트·작성자 메모)과 중앙 에디터(보고서 HTML) 초기 데이터
 */
export async function getEditorContent(contentId: string): Promise<EditorContent> {
  if (import.meta.env.DEV) return { ...DUMMY_EDITOR_CONTENT, contentId };
  const { data } = await authClient.get<EditorContent>(`/contents/${contentId}/editor`);
  return data;
}

/**
 * EditorPage: 보고서 자동 저장 (디바운스 1.2s 후 호출)
 * 자문가가 에디터에서 작성 중인 HTML을 임시 저장
 */
export async function saveReport(contentId: string, html: string): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.put(`/contents/${contentId}/report`, { html });
}

/**
 * EditorPage: Publish 요청 — 최종 보고서를 확정하고 배포 승인 신청
 * 완료 후 콘텐츠 상태가 approved로 변경됨
 */
export async function requestPublish(contentId: string): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.post(`/contents/${contentId}/publish`);
}

/**
 * EditorPage: 원본 보기 — 제작자가 제출한 최신 원본 파일 URL 목록 반환
 */
export async function getSourceFileUrls(contentId: string): Promise<string[]> {
  if (import.meta.env.DEV) {
    return ['card_01.png', 'card_02.png', 'card_03.png'];
  }
  const { data } = await authClient.get<{ urls: string[] }>(
    `/contents/${contentId}/source-files`,
  );
  return data.urls;
}
