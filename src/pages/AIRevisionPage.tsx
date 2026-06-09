import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '@/components/layout/AppNavbar';
import FlowPathBar from '@/components/common/FlowPathBar';
import { aiRevisionDummyData } from '@/data/featurePrototypeData';

export default function AIRevisionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = aiRevisionDummyData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto w-full px-6 py-5 space-y-2">
                <Link to={`/content/${id}`} className="text-sm text-gray-400 hover:text-[#1B3A6B] transition-colors mb-4 inline-block">
                ‹ 심의 결과
                </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-gray-400">{data.managementNumber}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {data.statusLabel}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-white">
                  {data.flowLabel}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                임시 저장
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
              >
                이 수정안으로 재제출
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-5">
        <FlowPathBar from="심의 결과 상세" current="AI 수정안 생성" to="재제출 → 내 콘텐츠" />

        {/* 받은 준법 피드백 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-[#1B3A6B]">받은 준법 피드백</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
              {data.feedback.reviewer} · {data.feedback.date}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{data.feedback.content}</p>
        </div>

        {/* AI 수정안 · 콘텐츠 전체 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-gray-800">AI 수정안 · 콘텐츠 전체</h2>
            <span className="text-xs text-gray-400">{data.revisionNote}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400">원본</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 leading-relaxed min-h-[140px]">
                {data.originalCopy}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                <span>✦</span> AI 수정안 · 직접 편집 가능
              </p>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 text-sm text-gray-800 leading-relaxed min-h-[140px]">
                {data.revisedCopy.map((seg, i) =>
                  seg.highlighted ? (
                    <mark key={i} className="bg-emerald-200/60 text-emerald-900 rounded px-0.5">
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <span>✦</span> 다시 생성
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                직접 수정
              </button>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
            >
              이 수정안으로 재제출
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-xl px-5 py-3.5 text-sm text-gray-500 text-center bg-white/60">
          재제출하면 담당 자문가에게 다시 전달되어 '내 콘텐츠'에서 진행 상황을 확인할 수 있습니다.
        </div>
      </main>
    </div>
  );
}
