import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavbar from "@/components/layout/AppNavbar";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  getContentDetail,
  deleteContent,
  downloadReport,
} from "@/services/contentService";
import type { ContentDetail, ReviewVersion } from "@/types/api";
import type { ContentStatus } from "@/types/dashboard";

// ── Sub-components ─────────────────────────────────────────────────────────────

const dotColor: Record<ContentStatus, string> = {
  approved: "bg-emerald-400",
  rejected: "bg-red-400",
  pending: "bg-gray-300",
};

function ReviewAccordionItem({
  review,
  defaultOpen = false,
}: {
  review: ReviewVersion;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <span
          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
            dotColor[review.status]
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">
              v{review.version} · {review.label}
            </span>
            <StatusBadge status={review.status} />
          </div>
          <p className="text-xs text-gray-500 mt-2 truncate">
            {review.summary}
          </p>
        </div>
        <div className="shrink-0 text-right ml-2">
          <p className="text-xs text-gray-400 tabular-nums whitespace-nowrap">
            {review.date}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{review.reviewer}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && review.opinion && (
        <div className="px-5 pb-5 ml-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#1B3A6B] mb-1.5">
              종합 의견
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.opinion.general}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#1B3A6B] mb-1.5">
              항목별 의견
            </p>
            <ul className="space-y-1.5">
              {review.opinion.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-gray-700 leading-relaxed"
                >
                  <span className="text-[#1B3A6B] shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-1">
            <p className="text-xs font-semibold text-[#1B3A6B] mb-1.5">
              참고 규정
            </p>
            <ul className="space-y-1">
              {review.opinion.regulations.map((reg, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-500">
                  <span className="shrink-0">•</span>
                  <span>{reg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {open && !review.opinion && (
        <div className="px-5 pb-4 ml-5">
          <p className="text-sm text-gray-400 italic">의견 내용이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ContentDetailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const role = user?.role ?? "creator";

  const [content, setContent] = useState<ContentDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    getContentDetail(id).then(setContent);
  }, [id]);

  const handleDownloadReport = async () => {
    if (!content) return;
    const blob = await downloadReport(content.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `심의보고서_${content.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!content || !confirm("정말 삭제하시겠습니까?")) return;
    await deleteContent(content.id);
    navigate("/dashboard");
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppNavbar />
        <main className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          불러오는 중...
        </main>
      </div>
    );
  }

  const finalReview =
    content.status !== "pending"
      ? content.reviews.find(
          (r) => r.status === "approved" || r.status === "rejected",
        )
      : undefined;

  const finalResultLabel: Record<ContentStatus, string> = {
    approved: "승인",
    rejected: "반려",
    pending: "대기",
  };

  const finalResultColor: Record<ContentStatus, string> = {
    approved: "text-emerald-600 bg-emerald-50 border-emerald-200",
    rejected: "text-red-500 bg-red-50 border-red-200",
    pending: "text-amber-600 bg-amber-50 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link
            to="/dashboard"
            className="hover:text-[#1B3A6B] transition-colors"
          >
            ‹ 메인
          </Link>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-semibold text-gray-400">
              {content.id}
            </span>
            <StatusBadge status={content.status} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>

          <p className="text-sm text-gray-400 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
            <span>{content.typeLabel}</span>
            <span className="text-gray-300">·</span>
            <span>{content.subType}</span>
            <span className="text-gray-300">·</span>
            <span>제출 {content.submittedAt}</span>
            <span className="text-gray-300">·</span>
            <span>자문가 {content.advisor}</span>
            {content.status !== "pending" && (
              <>
                <span className="text-gray-300">·</span>
                <span>
                  {content.status === "approved" ? "최종 승인" : "최종 반려"}{" "}
                  {content.finalAt}
                </span>
                {content.status === "approved" && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>심의필 번호: {content.complianceNo}</span>
                  </>
                )}
              </>
            )}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {role === "creator" ? (
              <>
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  보고서 PDF 다운로드
                </button>
                {content.status === "rejected" && (
                  <button
                    onClick={() => navigate(`/content/${content.id}/resubmit`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    재제출
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  보고서 PDF 다운로드
                </button>
                <button
                  onClick={() => navigate(`/review/${content.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  검토하기
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="flex gap-6 items-start">
          {/* Left — Review history */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-800">
                  심의 의견
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  총 {content.reviews.length}개
                </span>
              </div>
              <span className="text-xs text-gray-400">
                최신순 · 항목 클릭 시 펼침
              </span>
            </div>

            <div>
              {content.reviews.map((review, i) => (
                <ReviewAccordionItem
                  key={review.version}
                  review={review}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="w-72 shrink-0 self-stretch">
            <div className="sticky top-6 space-y-4">
              {/* Final result */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  최종 결과
                </h3>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${
                      finalResultColor[content.status]
                    }`}
                  >
                    {finalResultLabel[content.status]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {content.finalAt}
                  </span>
                </div>

                {finalReview && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {finalReview.opinion?.general ?? finalReview.summary}
                  </p>
                )}

                <div className="pt-1 border-t border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400 pt-2">
                    담당 자문가 ·{" "}
                    <span className="font-semibold text-gray-600">
                      {content.advisor}
                    </span>
                    <span className="text-gray-400"> (마케팅 본부)</span>
                  </p>
                </div>
              </div>

              {/* Creator next-step actions */}
              {role === "creator" && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    추가 기능
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        navigate(`/content/${content.id}/ai-revision`)
                      }
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-gray-200 hover:border-[#1B3A6B]/40 hover:bg-blue-50/40 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                        <svg
                          className="w-4 h-4 text-violet-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">
                          AI 수정안 생성
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          반려 피드백 기반 자동 수정
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-[#1B3A6B] transition-colors shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/content/${content.id}/translate`)
                      }
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-gray-200 hover:border-[#1B3A6B]/40 hover:bg-blue-50/40 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                        <svg
                          className="w-4 h-4 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">
                          AI 다국어 번역
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          승인 콘텐츠 다국어 변환
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-[#1B3A6B] transition-colors shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => navigate(`/content/${content.id}/publish`)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-gray-200 hover:border-[#1B3A6B]/40 hover:bg-blue-50/40 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">
                          채널 게시
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          SNS 채널 연동 게시 라우팅
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-[#1B3A6B] transition-colors shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Related contents */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  관련 콘텐츠
                </h3>
                <ul className="space-y-2">
                  {content.relatedContents.map((rel) => (
                    <li key={rel.id}>
                      <Link
                        to={`/content/${rel.id}`}
                        className="text-sm text-[#1B3A6B] hover:underline leading-snug"
                      >
                        <span className="font-mono text-xs text-gray-400 mr-1">
                          {rel.id}
                        </span>
                        · {rel.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
