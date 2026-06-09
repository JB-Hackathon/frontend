import { authClient } from '@/services/apiClient';
import {
  statusSummary as dummyStatusSummary,
  advisorSummary as dummyAdvisorSummary,
} from '@/utils/dashboardDummyData';
import type { ContentItem, ContentType, StatusSummary } from '@/types/dashboard';
import type {
  AdvisorSummary,
  ApiResponse,
  BoardItem,
  ContentListParams,
  ContentListResponse,
} from '@/types/api';

// 서버 channelType → 대시보드 표시용 유형/라벨 매핑
// (sms/kakao는 백엔드에서 'messenger'로 통합 저장되어 구분이 불가하므로 '메신저'로 표기)
const CHANNEL_TYPE_LABELS: Record<BoardItem['channelType'], { type: ContentType; label: string }> = {
  homepage: { type: 'homepage', label: '홈페이지' },
  sns: { type: 'sns', label: 'SNS' },
  messenger: { type: 'other', label: '메신저' },
  other: { type: 'other', label: '기타' },
};

/**
 * DashboardPage (creator): 심의 상태별 건수 요약
 * StatusCard 4개에 표시되는 pending/reviewing/approved/rejected/total
 */
export async function getStatusSummary(): Promise<StatusSummary> {
  if (import.meta.env.DEV) return dummyStatusSummary;
  const { data } = await authClient.get<StatusSummary>('/dashboard/summary');
  return data;
}

/**
 * DashboardPage (advisor): 자문가 전용 업무 현황 요약
 * AdvisorStatusCard 4개에 표시되는 처리 통계
 */
export async function getAdvisorSummary(): Promise<AdvisorSummary> {
  if (import.meta.env.DEV) return dummyAdvisorSummary;
  const { data } = await authClient.get<AdvisorSummary>('/dashboard/advisor-summary');
  return data;
}

/**
 * DashboardPage: 콘텐츠 목록 조회 (필터 + 정렬 + 페이지네이션)
 *
 * 서버에서 필터링해야 할 파라미터:
 *  - statuses: 상태 다중 선택 (pending | reviewing | approved | rejected)
 *  - types: 채널 다중 선택 (homepage | sns | sms | kakao | other)
 *  - query: 제목/ID 검색어
 *  - dateFrom / dateTo: 제출일 범위
 *  - myOnly: 내 콘텐츠만 (role에 따라 creator 또는 advisor 기준)
 *  - sortBy: latest(기본) | oldest | title | submitted
 *  - page / pageSize: 페이지네이션
 */
export async function getContentList(params: ContentListParams): Promise<ContentListResponse> {
  const { data } = await authClient.get<ApiResponse<BoardItem[]>>('/boards/all');
  const items = data.data.map(mapBoardItemToContentItem);
  return applyLocalFilters(items, params);
}

function mapBoardItemToContentItem(board: BoardItem): ContentItem {
  const { type, label } = CHANNEL_TYPE_LABELS[board.channelType];
  return {
    id: String(board.reviewId),
    managementNumber: board.managementNumber,
    title: board.title,
    type,
    typeLabel: label,
    advisor: board.complianceAdvisorName,
    creator: board.contentCreatorName,
    submittedAt: board.createdAt.slice(0, 10),
    status: board.reviewStatus,
  };
}

// 로컬 필터링 (서버가 필터/페이지네이션을 지원하지 않아 클라이언트에서 처리)
function applyLocalFilters(
  items: ContentItem[],
  params: ContentListParams,
): ContentListResponse {
  let result = [...items];
  const { statuses, types, query, myOnly, dateFrom, dateTo, sortBy, userName, role } = params;
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  if (statuses && statuses.length > 0 && !statuses.includes('pending' as never)) {
    // 'all' 처리가 없으면 필터 적용
  }

  if (types && types.length > 0) {
    result = result.filter((item) => types.includes(item.type));
  }

  if (query?.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (item) => item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q),
    );
  }

  if (myOnly && userName) {
    result = result.filter((item) =>
      role === 'advisor' ? item.advisor === userName : item.creator === userName,
    );
  }

  if (dateFrom) result = result.filter((item) => item.submittedAt >= dateFrom);
  if (dateTo) result = result.filter((item) => item.submittedAt <= dateTo);

  if (sortBy === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  } else if (sortBy === 'submitted') {
    result.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  } else if (sortBy === 'oldest') {
    result.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  } else {
    result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  const total = result.length;
  const paged = result.slice((page - 1) * pageSize, page * pageSize);

  return { items: paged, total, page, pageSize };
}
