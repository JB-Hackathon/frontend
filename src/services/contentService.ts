import { authClient } from '@/services/apiClient';
import type { ContentDetail, UploadContentRequest, Advisor } from '@/types/api';
import type { ContentItem } from '@/types/dashboard';
import { DUMMY_CONTENT_DETAIL, DUMMY_ADVISORS } from '@/utils/contentDummyData';
import { contentItems as dummyContentItems, statusSummary as dummyStatusSummary } from '@/utils/dashboardDummyData';
import { ADVISORS } from '@/utils/constants/upload';

// ─── 서비스 함수 ──────────────────────────────────────────────────────────────

/**
 * ContentDetailPage / ReviewPage / EditorPage: 콘텐츠 상세 + 심의 이력 조회
 */
export async function getContentDetail(id: string): Promise<ContentDetail> {
  if (import.meta.env.DEV) return { ...DUMMY_CONTENT_DETAIL, id };
  const { data } = await authClient.get<ContentDetail>(`/contents/${id}`);
  return data;
}

/**
 * UploadPage: 콘텐츠 심의 요청 제출 (이미지 포함 multipart/form-data)
 */
export async function uploadContent(payload: UploadContentRequest): Promise<ContentItem> {
  if (import.meta.env.DEV) {
    const newItem: ContentItem = {
      id: `C-${String(Number(dummyContentItems[0]?.id?.replace('C-', '') ?? 0) + 1).padStart(4, '0')}`,
      title: payload.title,
      type: payload.channel,
      typeLabel: payload.channel,
      advisor: ADVISORS.find((a) => a.value === payload.advisorId)?.label ?? null,
      creator: '김지원',
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    dummyContentItems.unshift(newItem);
    dummyStatusSummary.pending += 1;
    dummyStatusSummary.total += 1;
    return newItem;
  }
  const form = buildFormData(payload);
  const { data } = await authClient.post<ContentItem>('/contents', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * UploadPage: 임시 저장
 */
export async function saveDraft(payload: UploadContentRequest): Promise<ContentItem> {
  if (import.meta.env.DEV) {
    return {
      id: `C-DRAFT-${Date.now()}`,
      title: payload.title,
      type: payload.channel,
      typeLabel: payload.channel,
      advisor: null,
      creator: '김지원',
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
  }
  const form = buildFormData(payload);
  const { data } = await authClient.post<ContentItem>('/contents/draft', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * ContentDetailPage: 반려 콘텐츠 재제출
 */
export async function resubmitContent(
  id: string,
  payload: UploadContentRequest,
): Promise<ContentItem> {
  if (import.meta.env.DEV) {
    return { ...DUMMY_CONTENT_DETAIL, id, status: 'pending', advisor: null };
  }
  const form = buildFormData(payload);
  const { data } = await authClient.post<ContentItem>(`/contents/${id}/resubmit`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * ContentDetailPage: 콘텐츠 삭제
 */
export async function deleteContent(id: string): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.delete(`/contents/${id}`);
}

/**
 * ContentDetailPage: 심의 보고서 PDF 다운로드
 * Blob을 반환하면 호출부에서 URL.createObjectURL로 처리
 */
export async function downloadReport(id: string): Promise<Blob> {
  if (import.meta.env.DEV) {
    return new Blob(['[더미] PDF 내용'], { type: 'application/pdf' });
  }
  const { data } = await authClient.get<Blob>(`/contents/${id}/report.pdf`, {
    responseType: 'blob',
  });
  return data;
}

/**
 * UploadPage: 자문가 목록 조회 (담당 자문가 선택 드롭다운)
 */
export async function getAdvisors(): Promise<Advisor[]> {
  if (import.meta.env.DEV) return DUMMY_ADVISORS;
  const { data } = await authClient.get<Advisor[]>('/advisors');
  return data;
}

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

function buildFormData(payload: UploadContentRequest): FormData {
  const form = new FormData();
  const { images, ...fields } = payload;
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  images?.forEach((file) => form.append('images', file));
  return form;
}
