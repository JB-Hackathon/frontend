import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppNavbar from '@/components/layout/AppNavbar';
import StatusCard from '@/components/dashboard/StatusCard';
import AdvisorStatusCard from '@/components/dashboard/AdvisorStatusCard';
import FilterSection from '@/components/dashboard/FilterSection';
import ContentTable from '@/components/dashboard/ContentTable';
import Pagination from '@/components/common/Pagination';
import {
  getStatusSummary,
  getAdvisorSummary,
  getContentList,
} from '@/services/dashboardService';
import type { StatusSummary, ContentItem, ContentType } from '@/types/dashboard';
import type { AdvisorSummary, ContentListParams } from '@/types/api';

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? 'creator';

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pagedItems, setPagedItems] = useState<ContentItem[]>([]);
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(null);
  const [advisorSummary, setAdvisorSummary] = useState<AdvisorSummary | null>(null);
  const [filterParams, setFilterParams] = useState<ContentListParams>({
    sortBy: 'latest',
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (role === 'advisor') {
      getAdvisorSummary().then(setAdvisorSummary);
    } else {
      getStatusSummary().then(setStatusSummary);
    }
  }, [role]);

  useEffect(() => {
    getContentList({ ...filterParams, page: currentPage, role, userName: user?.name }).then(
      (res) => {
        setPagedItems(res.items);
        setTotalItems(res.total);
      },
    );
  }, [filterParams, currentPage, role, user?.name]);

  const pageTitle = role === 'advisor' ? '검토 대기 리스트' : '팀 콘텐츠 심의 현황';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-400 mt-0.5">총 {totalItems}건</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              팀 변경
            </button>
            {role === 'creator' && (
              <button
                onClick={() => navigate('/upload')}
                className="px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                콘텐츠 업로드
              </button>
            )}
          </div>
        </div>

        {/* Status overview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">심의 상태별 현황</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {role === 'advisor' ? (
              <>
                <AdvisorStatusCard
                  label="검토 대기"
                  value={advisorSummary?.pending ?? 0}
                  unit="건"
                  badge={{ text: '대기', variant: 'amber' }}
                />
                <AdvisorStatusCard
                  label="오늘 처리 완료"
                  value={advisorSummary?.todayDone ?? 0}
                  unit="건"
                  badge={{ text: '완료', variant: 'green' }}
                  sub={`승인 ${advisorSummary?.todayApproved ?? 0} / 반려 ${advisorSummary?.todayRejected ?? 0}`}
                />
                <AdvisorStatusCard
                  label="평균 처리 시간"
                  value={advisorSummary?.avgDays ?? 0}
                  unit="일"
                  hint="목표 1.5일 이내"
                />
                <AdvisorStatusCard
                  label="재제출 검토"
                  value={advisorSummary?.resubmit ?? 0}
                  unit="건"
                  badge={{ text: '검토중', variant: 'slate' }}
                />
              </>
            ) : (
              <>
                <StatusCard
                  label="검토 대기"
                  count={statusSummary?.pending ?? 0}
                  description="심의 진행 전 콘텐츠"
                  tag="반려 후 재제출 포함"
                  accentColor="border-t-amber-400"
                />
                <StatusCard
                  label="검토 진행"
                  count={statusSummary?.reviewing ?? 0}
                  description="심의가 진행 중인 콘텐츠"
                  accentColor="border-t-sky-400"
                />
                <StatusCard
                  label="승인"
                  count={statusSummary?.approved ?? 0}
                  description="심의 완료 · 발행 가능"
                  accentColor="border-t-emerald-400"
                />
                <StatusCard
                  label="반려"
                  count={statusSummary?.rejected ?? 0}
                  description="재작성 필요"
                  tag="재제출 시 → 검토 대기 이동"
                  accentColor="border-t-red-400"
                />
              </>
            )}
          </div>
        </section>

        {/* Filter */}
        <FilterSection
          role={role}
          onFilter={(types, sort, myOnly, query, dateFrom, dateTo) => {
            setFilterParams({
              types: types.includes('all') ? undefined : (types as ContentType[]),
              sortBy: sort,
              myOnly,
              query,
              dateFrom,
              dateTo,
              pageSize: PAGE_SIZE,
            });
            setCurrentPage(1);
          }}
        />

        {/* Table */}
        <ContentTable items={pagedItems} role={role} />

        {/* Pagination */}
        <div className="flex justify-center pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
