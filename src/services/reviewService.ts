import { authClient } from '@/services/apiClient';
import type { ContentDetail, ReviewSubmitRequest, AIChatRequest, AIChatResponse } from '@/types/api';
import type { ContentStatus } from '@/types/dashboard';
import { messages as dummyMessages, quickChips as dummyChips } from '@/utils/reviewDummyData';
import type { Message } from '@/types/review';

// ─── 더미 데이터 ─────────────────────────────────────────────────────────────

const DUMMY_AI_RESPONSES: AIChatResponse[] = [
  {
    id: 'ai-1',
    content: 'Card 1 우대금리 표기, Card 2 단정 표현 2건을 발견했어요. 피드백 초안에 반영했습니다. (3건 적용)',
    badge: '✓ 피드백 v1 반영됨',
  },
  {
    id: 'ai-2',
    content: '대체 표현 3가지:',
    alternatives: [
      '① "혜택은 한정 기간만 제공됩니다"',
      '② "조기 마감될 수 있습니다"',
      '③ "지금 가입 가능한 우대 혜택"',
    ],
    altNote: '①·②는 §6-1 위반 가능성 낮음, ③ 권장.',
    actions: { primary: '적용하기', secondary: '모두 보기' },
  },
];

// ─── 서비스 함수 ──────────────────────────────────────────────────────────────

/**
 * ReviewPage: 자문가가 심의 의견 제출 (승인 또는 반려)
 * 제출 후 콘텐츠 상태가 approved/rejected로 변경됨
 */
export async function submitReview(
  contentId: string,
  payload: ReviewSubmitRequest,
): Promise<ContentDetail> {
  if (import.meta.env.DEV) {
    const { getContentDetail } = await import('@/services/contentService');
    const detail = await getContentDetail(contentId);
    return { ...detail, status: payload.status };
  }
  const { data } = await authClient.post<ContentDetail>(
    `/contents/${contentId}/review`,
    payload,
  );
  return data;
}

/**
 * ReviewPage: 상태만 단순 변경 (반려 처리 / 초안으로 되돌리기)
 * 별도 의견 없이 워크플로우 상태만 업데이트
 */
export async function updateContentStatus(
  contentId: string,
  status: ContentStatus,
): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.patch(`/contents/${contentId}/status`, { status });
}

/**
 * ReviewPage (ChatPanel): AI 자문 메시지 전송
 * 콘텐츠 ID + 현재 대화 이력을 함께 보내 문맥 기반 응답 생성
 */
export async function sendAIChat(payload: AIChatRequest): Promise<AIChatResponse> {
  if (import.meta.env.DEV) {
    const idx = Math.floor(Math.random() * DUMMY_AI_RESPONSES.length);
    return { ...DUMMY_AI_RESPONSES[idx], id: `ai-${Date.now()}` };
  }
  const { data } = await authClient.post<AIChatResponse>('/ai/chat', payload);
  return data;
}

/**
 * ReviewPage (ChatPanel): 초기 대화 이력 조회
 * 자문가가 해당 콘텐츠에서 나눈 AI 채팅 기록 복원
 */
export async function getChatHistory(contentId: string): Promise<Message[]> {
  if (import.meta.env.DEV) return dummyMessages;
  const { data } = await authClient.get<Message[]>(`/contents/${contentId}/chat`);
  return data;
}

/**
 * ReviewPage (ChatPanel): 빠른 입력 칩 목록 조회
 * 자문가용 단축 프롬프트 버튼 목록 (규정 인용, 대체 표현 요청 등)
 */
export async function getQuickChips(): Promise<string[]> {
  if (import.meta.env.DEV) return dummyChips;
  const { data } = await authClient.get<string[]>('/ai/quick-chips');
  return data;
}

/**
 * ContentDetailPage: 특정 심의 버전의 AI 요약본 조회
 * "AI 요약본" 버튼 클릭 시 해당 버전 요약 텍스트 반환
 */
export async function getAISummary(contentId: string, version: number): Promise<string> {
  if (import.meta.env.DEV) {
    return '제출하신 카드뉴스는 광고심의규정 §4-2 및 §6-1 위반 요소가 모두 해소되었습니다.';
  }
  const { data } = await authClient.get<{ summary: string }>(
    `/contents/${contentId}/reviews/${version}/ai-summary`,
  );
  return data.summary;
}
