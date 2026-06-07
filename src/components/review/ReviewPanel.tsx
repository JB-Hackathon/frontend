
import { useState, useEffect } from 'react';
import { AISummaryButton } from './AISummaryButton';
import { feedbackDetail } from '../../utils/reviewDummyData';

function ReviewPanelSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      {/* Panel header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            v2
          </span>
        </div>
        <p className="text-sm text-gray-400">직접 수정은 2차 페이지에서 가능합니다.</p>
      </div>


      {/* 종합 의견 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="p-5">
          <div className="h-16 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* 피드백 상세 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="px-5 py-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-2/3 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <div className="h-8 w-36 rounded-lg skeleton-shimmer" />
          <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* 제작자에게 전달할 한 줄 요약 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="h-4 w-44 rounded skeleton-shimmer" />
        <div className="h-12 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function ReviewPanel() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ReviewPanelSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      {/* Panel header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            v2
          </span>
        </div>
        <p className="text-sm text-gray-400">직접 수정은 2차 페이지에서 가능합니다.</p>
      </div>

      {/* 종합 의견 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">종합 의견</h3>
          <AISummaryButton />
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold bg-red-100 text-red-600 border border-red-200 rounded-full px-2 py-0.5 mt-0.5">
              ✕ 반려
            </span>
            <p className="text-sm text-red-800 leading-relaxed">
              본 카드뉴스 카피는 광고심의규정 제 7조(우대금리 표기) 및 제 6조(단정적 표현 금지) 위반 소지가 있어 수정이 권고됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 피드백 상세 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">피드백 상세</h3>
          <AISummaryButton />
        </div>
        <div className="px-5 py-5 space-y-4 text-sm text-gray-700 leading-relaxed">
          {feedbackDetail.map((section) => (
            <div key={section.title}>
              <p className="font-bold text-gray-900 mb-1.5">{section.title}</p>
              {section.body.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            클립보드에 복사하기
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            ↩ 되돌리기
          </button>
        </div>
      </div>

      {/* 제작자에게 전달할 한 줄 요약 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">제작자에게 전달할 한 줄 요약</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
          우대조건 자막 보강(§4-2)과 단정적 표현 2건 삭제(§6-1) 후 재제출 시 승인 예정입니다.
        </div>
      </div>
    </div>
  );
}
