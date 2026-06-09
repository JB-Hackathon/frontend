import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";
import { aiRevisionDummyData } from "@/data/featurePrototypeData";

const altRevision = [
  { highlighted: false, text: "지금 가입하시면 " },
  {
    highlighted: true,
    text: "연 최대 8% 목표 수익(원금 손실 가능, 투자 전 상품설명서 확인 필수).",
  },
  { highlighted: false, text: " 2023년 동일 상품 수익률 8.3% 기록" },
  {
    highlighted: true,
    text: "(과거 실적이 미래 수익을 보장하지 않습니다).",
  },
  {
    highlighted: false,
    text: " 합리적인 자산 설계를 지금 시작하세요. 선착순 100명 한정 상담 제공.",
  },
];

export default function AIRevisionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = aiRevisionDummyData;

  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoadingRevision, setIsLoadingRevision] = useState(true);
  const [revision, setRevision] = useState(data.revisedCopy);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(() =>
    data.revisedCopy.map((s) => s.text).join(""),
  );
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [regenCount, setRegenCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoadingRevision(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("임시 저장되었습니다.");
    }, 900);
  };

  const handleRegenerate = () => {
    if (isRegenerating) return;
    setIsEditing(false);
    setIsRegenerating(true);
    setTimeout(() => {
      const next = regenCount % 2 === 0 ? altRevision : data.revisedCopy;
      setRevision(next);
      setEditText(next.map((s) => s.text).join(""));
      setRegenCount((c) => c + 1);
      setIsRegenerating(false);
      showToast("새로운 수정안이 생성되었습니다.");
    }, 2000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setRevision([{ highlighted: false, text: editText }]);
      showToast("수정 내용이 반영되었습니다.");
    }
    setIsEditing((v) => !v);
  };

  const handleResubmit = () => {
    if (isResubmitting) return;
    setIsResubmitting(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {/* 재제출 로딩 오버레이 */}
      {isResubmitting && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-600">재제출 처리 중…</p>
        </div>
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto w-full px-6 py-5 space-y-2">
          <Link
            to={`/content/${id}`}
            className="text-sm text-gray-400 hover:text-[#1B3A6B] transition-colors mb-4 inline-block"
          >
            ‹ 심의 결과
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-gray-400">
                  {data.managementNumber}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-200">
                  {data.statusLabel}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-white">
                  {data.flowLabel}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-60 inline-flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                    저장 중…
                  </>
                ) : (
                  "임시 저장"
                )}
              </button>
              <button
                onClick={handleResubmit}
                disabled={isResubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold disabled:opacity-60"
              >
                해당 시안으로 재제출
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-[#1B3A6B]">
              반려 사유 피드백
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
              {data.feedback.reviewer} · {data.feedback.date}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.feedback.content}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-gray-800">
              AI 수정안 · 콘텐츠 전체
            </h2>
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
                <span>✦</span>{" "}
                {isLoadingRevision
                  ? "AI 수정안 생성 중…"
                  : isEditing
                  ? "직접 편집 중"
                  : "AI 수정안 · 직접 편집 가능"}
              </p>

              {isLoadingRevision ? (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 min-h-[140px] space-y-2.5">
                  <div className="h-3 bg-emerald-200/60 rounded animate-pulse w-full" />
                  <div className="h-3 bg-emerald-200/60 rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-emerald-100 rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-emerald-200/60 rounded animate-pulse w-full" />
                  <div className="h-3 bg-emerald-100 rounded animate-pulse w-3/4" />
                </div>
              ) : isRegenerating ? (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 min-h-[140px] flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-emerald-600 font-medium">
                    AI가 새로운 수정안을 생성 중입니다…
                  </p>
                </div>
              ) : isEditing ? (
                <textarea
                  className="w-full bg-amber-50/50 border border-amber-300 rounded-lg p-4 text-sm text-gray-800 leading-relaxed min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 text-sm text-gray-800 leading-relaxed min-h-[140px]">
                  {revision.map((seg, i) =>
                    seg.highlighted ? (
                      <mark
                        key={i}
                        className="bg-emerald-200/60 text-emerald-900 rounded px-0.5"
                      >
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating || isEditing || isLoadingRevision}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                <span>✦</span> 다시 생성
              </button>
              <button
                onClick={handleEditToggle}
                disabled={isRegenerating || isLoadingRevision}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-lg transition-colors font-medium disabled:opacity-50 ${
                  isEditing
                    ? "border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isEditing ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    편집 완료
                  </>
                ) : (
                  <>
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    직접 수정
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-xl px-5 py-3.5 text-sm text-gray-500 text-center bg-white/60">
          재제출 시 담당 자문가에게 다시 전달되어 '내 콘텐츠'에서 진행 상황을
          확인할 수 있습니다.
        </div>
      </main>
    </div>
  );
}
