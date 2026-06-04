import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppNavbar from '@/components/layout/AppNavbar';
import StatusCard from '@/components/dashboard/StatusCard';
import FilterSection from '@/components/dashboard/FilterSection';
import ContentTable from '@/components/dashboard/ContentTable';
import Pagination from '@/components/common/Pagination';
import { statusSummary, contentItems } from '@/utils/dashboardDummyData';

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'creator';

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState(contentItems);

  const totalPages = Math.max(1, Math.ceil(statusSummary.total / PAGE_SIZE));
  const pagedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageTitle = role === 'advisor' ? '팀 콘텐츠 심의 현황' : '팀 콘텐츠 심의 현황';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-400 mt-0.5">총 {statusSummary.total}건</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              팀 변경
            </button>
            {role === 'creator' && (
              <button className="px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold flex items-center gap-1.5">
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
            <StatusCard
              label="검토 대기"
              count={statusSummary.pending}
              description="심의 진행 전 콘텐츠"
              tag="반려 후 재제출 포함"
              accentColor="border-t-amber-400"
            />
            <StatusCard
              label="검토 진행"
              count={statusSummary.reviewing}
              description="심의가 진행 중인 콘텐츠"
              accentColor="border-t-sky-400"
            />
            <StatusCard
              label="승인"
              count={statusSummary.approved}
              description="심의 완료 · 발행 가능"
              accentColor="border-t-emerald-400"
            />
            <StatusCard
              label="반려"
              count={statusSummary.rejected}
              description="재작성 필요"
              tag="재제출 시 → 검토 대기 이동"
              accentColor="border-t-red-400"
            />
          </div>
        </section>

        {/* Filter */}
        <FilterSection
          role={role}
          onFilter={(types, sort, myOnly, query) => {
            let result = [...contentItems];

            if (!types.includes('all')) {
              result = result.filter((item) => types.includes(item.type));
            }

            if (query.trim()) {
              const q = query.toLowerCase();
              result = result.filter(
                (item) =>
                  item.title.toLowerCase().includes(q) ||
                  item.id.toLowerCase().includes(q)
              );
            }

            if (myOnly) {
              const myName = user?.name ?? '';
              result = result.filter((item) =>
                role === 'advisor'
                  ? item.advisor === myName
                  : item.creator === myName
              );
            }

            if (sort === 'title') {
              result.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
            } else if (sort === 'submitted') {
              result.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
            } else {
              result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
            }

            setFilteredItems(result);
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
