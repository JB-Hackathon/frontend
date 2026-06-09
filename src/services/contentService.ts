import { authClient } from '@/services/apiClient';
import type {
  Advisor,
  ApiResponse,
  ContentDetail,
  CreateBoardRequest,
  ReviewOriginalContent,
  ReviewVersion,
  ReviewVersionItem,
  UploadContentRequest,
} from '@/types/api';
import type { ContentItem, ContentStatus } from '@/types/dashboard';

// ─── 더미 데이터 ─────────────────────────────────────────────────────────────

const DUMMY_DETAIL: ContentDetail = {
  id: 'C-0142',
  title: '신규 적금 상품 런칭 SNS 카드뉴스 (3종)',
  status: 'approved',
  type: 'sns',
  typeLabel: 'SNS 카드뉴스',
  subType: '이미지+텍스트',
  submittedAt: '2026-05-16',
  finalAt: '2026-05-18',
  advisor: '박준법',
  creator: '김지원',
  complianceNo: 'JB-111111-111111',
  contentFilePath: 'image3.jpg',
  relatedContents: [
    { id: 'C-0098', title: '동일 캠페인 메인 배너' },
    { id: 'C-0114', title: '동일 상품 푸시 문구' },
  ],
};

const DUMMY_ADVISORS: Advisor[] = [
  { id: 'park', name: '박준법', team: '준법감시실 1팀' },
  { id: 'lee', name: '이감독', team: '준법감시실 2팀' },
  { id: 'choi', name: '최감리', team: '준법감시실 3팀' },
];

// ─── 서비스 함수 ──────────────────────────────────────────────────────────────

/**
 * ContentDetailPage / ReviewPage / EditorPage: 콘텐츠 상세 + 심의 이력 조회
 * id는 reviewId (대시보드 목록의 id와 동일)
 */
export async function getContentDetail(id: string): Promise<ContentDetail> {
  const { data } = await authClient.get<ApiResponse<ReviewOriginalContent>>(`/reviews/${id}`);
  return mapReviewOriginalContentToDetail(data.data);
}

function mapReviewOriginalContentToDetail(item: ReviewOriginalContent): ContentDetail {
  return {
    id: String(item.reviewId),
    title: item.title,
    status: item.reviewStatus,
    type: 'other', // TODO: API 응답에 채널 유형 필드가 추가되면 매핑
    typeLabel: '',
    subType: '',
    submittedAt: '',
    finalAt: '',
    advisor: item.complianceAdvisorName,
    creator: item.contentCreatorName,
    complianceNo: item.reviewApprovalNumber ?? '',
    contentFilePath: item.contentFilePath,
    relatedContents: DUMMY_DETAIL.relatedContents, // TODO: 관련 콘텐츠 조회 API가 추가되면 매핑
  };
}

const REVIEW_STATUS_LABEL: Record<ContentStatus, string> = {
  pending: '대기',
  reviewing: '검토중',
  approved: '승인',
  rejected: '반려',
};

/**
 * ContentDetailPage: 해당 심의(게시글)의 모든 버전 조회
 */
export async function getReviewVersions(boardId: string | number): Promise<ReviewVersion[]> {
  const { data } = await authClient.get<ApiResponse<ReviewVersionItem[]>>(
    `/reviews/board/${boardId}/all`,
  );
  return data.data.map(mapReviewVersionItem).sort((a, b) => b.version - a.version);
}

function mapReviewVersionItem(item: ReviewVersionItem): ReviewVersion {
  return {
    version: item.versionNo,
    label: REVIEW_STATUS_LABEL[item.reviewStatus],
    status: item.reviewStatus,
    date: item.createdAt.replace('T', ' ').slice(0, 16),
    reviewer: '', // TODO: 응답에 자문가 이름 필드가 추가되면 매핑
    summary: item.reviewComments ?? item.contentDescription,
    opinion: null, // TODO: reviewComments/reviewReports 구조가 확정되면 종합·항목별 의견으로 매핑
    contentFilePath: item.contentFilePath,
  };
}

/**
 * UploadPage: 심의 요청 생성 (POST /boards)
 * 첨부 이미지를 함께 전송하기 위해 폼데이터(multipart/form-data)로 요청
 */
export async function createBoard(payload: CreateBoardRequest): Promise<void> {
  const form = buildFormData(payload, 'contentFile');
  await authClient.post('/boards', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * UploadPage: 임시 저장
 */
export async function saveDraft(payload: UploadContentRequest): Promise<ContentItem> {
  if (import.meta.env.DEV) {
    return {
      id: `C-DRAFT-${Date.now()}`,
      managementNumber: `C-DRAFT-${Date.now()}`,
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
    return { ...DUMMY_DETAIL, id, managementNumber: id, status: 'pending', advisor: null };
  }
  const form = buildFormData(payload);
  const { data } = await authClient.post<ContentItem>(`/contents/${id}/resubmit`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * ContentDetailPage: 심의 삭제
 * id는 reviewId (대시보드 목록의 id와 동일)
 */
export async function deleteContent(id: string): Promise<void> {
  await authClient.delete(`/reviews/${id}`);
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

function buildFormData<T extends { images?: File[] }>(payload: T, fileFieldName = 'images'): FormData {
  const form = new FormData();
  const { images, ...fields } = payload;
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  images?.forEach((file) => form.append(fileFieldName, file));
  return form;
}
