import type { ContentDetail, UploadContentRequest, Advisor } from '@/types/api';
import type { ContentItem } from '@/types/dashboard';
import { DUMMY_CONTENT_DETAIL_C0142, DUMMY_CONTENT_DETAIL_C0143, DUMMY_CONTENT_DETAIL_C0144, DUMMY_CONTENT_DETAIL_C0141, DUMMY_ADVISORS } from '@/utils/contentDummyData';
import { contentItems as dummyContentItems, statusSummary as dummyStatusSummary } from '@/utils/dashboardDummyData';
import { ADVISORS } from '@/utils/constants/upload';

export async function getContentDetail(id: string): Promise<ContentDetail> {
  if (id === 'C-0141') return { ...DUMMY_CONTENT_DETAIL_C0141 };
  if (id === 'C-0142') return { ...DUMMY_CONTENT_DETAIL_C0142 };
  if (id === 'C-0143') return { ...DUMMY_CONTENT_DETAIL_C0143 };
  if (id === 'C-0144') return { ...DUMMY_CONTENT_DETAIL_C0144 };
  return { ...DUMMY_CONTENT_DETAIL_C0144, id };
}

export async function uploadContent(payload: UploadContentRequest): Promise<ContentItem> {
  const newItem: ContentItem = {
    id: `C-${String(Number(dummyContentItems[0]?.id?.replace('C-', '') ?? 0) + 1).padStart(4, '0')}`,
    title: payload.title,
    type: payload.channel,
    typeLabel: payload.channel,
    advisor: ADVISORS.find((a) => a.value === payload.advisorId)?.label ?? null,
    creator: '이종철',
    submittedAt: new Date().toISOString().slice(0, 10),
    status: 'pending',
  };
  dummyContentItems.unshift(newItem);
  dummyStatusSummary.pending += 1;
  dummyStatusSummary.total += 1;
  return newItem;
}

export async function saveDraft(payload: UploadContentRequest): Promise<ContentItem> {
  return {
    id: `C-DRAFT-${Date.now()}`,
    title: payload.title,
    type: payload.channel,
    typeLabel: payload.channel,
    advisor: null,
    creator: '이종철',
    submittedAt: new Date().toISOString().slice(0, 10),
    status: 'pending',
  };
}

export async function resubmitContent(
  id: string,
  payload: UploadContentRequest,
): Promise<ContentItem> {
  void payload;
  return { ...DUMMY_CONTENT_DETAIL_C0144, id, status: 'pending', advisor: null };
}

export async function deleteContent(id: string): Promise<void> {
  void id;
}

export async function downloadReport(id: string): Promise<Blob> {
  void id;
  return new Blob(['[더미] PDF 내용'], { type: 'application/pdf' });
}

export async function getAdvisors(): Promise<Advisor[]> {
  return DUMMY_ADVISORS;
}
