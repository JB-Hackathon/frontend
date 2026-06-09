import {
  statusSummary as dummyStatusSummary,
  advisorSummary as dummyAdvisorSummary,
  contentItems as dummyContentItems,
} from '@/utils/dashboardDummyData';
import type { ContentItem, StatusSummary } from '@/types/dashboard';
import type { AdvisorSummary, ContentListParams, ContentListResponse } from '@/types/api';

export async function getStatusSummary(): Promise<StatusSummary> {
  return dummyStatusSummary;
}

export async function getAdvisorSummary(): Promise<AdvisorSummary> {
  return dummyAdvisorSummary;
}

export async function getContentList(params: ContentListParams): Promise<ContentListResponse> {
  return applyLocalFilters(dummyContentItems, params);
}

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
