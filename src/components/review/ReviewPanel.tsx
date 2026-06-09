
import { useState, useEffect } from 'react';
import { AISummaryButton } from './AISummaryButton';
import { getReviewFeedback } from '@/services/reviewService';
import type { ReviewFeedback } from '@/types/api';

function ReviewPanelSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            …
          </span>
        </div>
        <p className="text-sm text-gray-400">직접 수정은 2차 페이지에서 가능합니다.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="p-5">
          <div className="h-16 rounded-lg skeleton-shimmer" />
        </div>
      </div>

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

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="h-4 w-44 rounded skeleton-shimmer" />
        <div className="h-12 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; containerClass: string; badgeClass: string; textClass: string }> = {
  approved: {
    label: '승인',
    icon: '✓',
    containerClass: 'bg-green-50 border-green-100',
    badgeClass: 'bg-green-100 text-green-600 border-green-200',
    textClass: 'text-green-800',
  },
  rejected: {
    label: '반려',
    icon: '✕',
    containerClass: 'bg-red-50 border-red-100',
    badgeClass: 'bg-red-100 text-red-600 border-red-200',
    textClass: 'text-red-800',
  },
};

const DEFAULT_STATUS_CONFIG = {
  label: '심의중',
  icon: '…',
  containerClass: 'bg-yellow-50 border-yellow-100',
  badgeClass: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  textClass: 'text-yellow-800',
};

interface ReviewPanelProps {
  reviewId?: number;
}

export default function ReviewPanel({ reviewId }: ReviewPanelProps) {
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!reviewId) return;
    let cancelled = false;
    setIsLoading(true);
    setFeedback(null);
    getReviewFeedback(reviewId)
      .then((data) => { if (!cancelled) setFeedback(data); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [reviewId]);

  if (isLoading || (!feedback && reviewId)) {
    return <ReviewPanelSkeleton />;
  }

  const statusCfg = feedback
    ? (STATUS_CONFIG[feedback.reviewStatus] ?? DEFAULT_STATUS_CONFIG)
    : DEFAULT_STATUS_CONFIG;

  const handleCopy = () => {
    if (feedback?.reviewComments) {
      navigator.clipboard.writeText(feedback.reviewComments);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      {/* Panel header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
          {feedback && (
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              v{feedback.versionNo}
            </span>
          )}
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
          <div className={`flex items-start gap-3 border rounded-lg px-4 py-3 ${statusCfg.containerClass}`}>
            <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2 py-0.5 mt-0.5 ${statusCfg.badgeClass}`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
            <p className={`text-sm leading-relaxed ${statusCfg.textClass}`}>
              {feedback?.reviewReports ?? '심의 의견이 없습니다.'}
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
        <div className="px-5 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {feedback?.reviewComments ?? '상세 피드백이 없습니다.'}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={handleCopy}
            disabled={!feedback?.reviewComments}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            클립보드에 복사하기
          </button>
        </div>
      </div>

      {/* 제작자에게 전달할 한 줄 요약 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">제작자에게 전달할 한 줄 요약</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
          {feedback?.reviewReports
            ? feedback.reviewReports.split('\n')[0]
            : '요약 내용이 없습니다.'}
        </div>
      </div>
    </div>
  );
}
