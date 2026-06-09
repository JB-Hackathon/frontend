import { AISummaryButton } from "./AISummaryButton";
import { checklistVersions } from "../../utils/reviewDummyData";
import type { ContentTypeCard, CheckItem } from "../../utils/reviewDummyData";

interface ReviewPanelProps {
  version: 1 | 2 | 3;
  isRefreshing: boolean;
}

const LAW_DESCRIPTIONS: Record<string, string> = {
  "광고심의규정 §4-2":
    "기본금리와 우대금리를 구분 표기하거나, 우대조건(가입 방법·자동이체 등)을 명확히 병기해야 합니다.",
  "금융소비자보호법 §22":
    "금융상품 광고 시 중요 정보를 명확히 표시해야 하며, 소비자를 오인하게 하는 표현을 금지합니다.",
  "광고심의규정 §6-1":
    "소비자에게 불안감·긴박감을 조성하거나 사실과 다른 단정적 표현을 사용할 수 없습니다.",
  "시각광고 가이드라인 §3":
    "이미지 내 금리·수익률 등 수치 정보에는 조건·단서 문구를 함께 표기해야 합니다.",
  "내부 브랜드 가이드라인 §2":
    "JB은행 공식 CI 색상 및 로고 사용 기준을 규정하며, 무단 변형 및 오용을 금지합니다.",
  "접근성 가이드라인 WCAG 2.1":
    "배경과 텍스트의 명암 대비는 WCAG AA 기준(일반 텍스트 4.5:1 이상)을 충족해야 합니다.",
  "디지털광고 가이드라인 §5":
    "디지털 광고의 CTA 문구 및 앱 다운로드 경로(앱스토어·구글플레이) 표기 기준을 규정합니다.",
  "광고심의규정 §8-1":
    '금리·수익률 등 변동 가능한 정보는 "변경될 수 있습니다" 등의 고지가 필수입니다.',
};

function LawBadge({ law }: { law: string }) {
  const desc = LAW_DESCRIPTIONS[law];
  return (
    <div className="relative group inline-flex">
      <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-medium cursor-default select-none">
        {law}
      </span>
      {desc && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-gray-100 text-[11px] leading-relaxed rounded-lg px-3 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-xl">
          {desc}
          <div className="absolute top-full left-3.5 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 rounded-t-xl">
        <div className="h-4 w-32 rounded skeleton-shimmer" />
        <div className="h-6 w-16 rounded-full skeleton-shimmer" />
      </div>
      <div className="px-5 py-4 divide-y divide-gray-100">
        {[1, 2].map((i) => (
          <div key={i} className="py-4 space-y-2 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full skeleton-shimmer" />
                <div className="h-3.5 w-40 rounded skeleton-shimmer" />
              </div>
              <div className="h-4 w-12 rounded skeleton-shimmer" />
            </div>
            <div className="flex gap-1.5 pl-3.5">
              <div className="h-4 w-24 rounded-full skeleton-shimmer" />
              <div className="h-4 w-32 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-1.5 pl-3.5">
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-5/6 rounded skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewPanelSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            분석 중...
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          AI가 피드백을 재분석하고 있습니다.
        </p>
        <div className="h-1.5 bg-gray-100 rounded-full skeleton-shimmer" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 rounded-t-xl">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="p-5">
          <div className="h-16 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="h-4 w-44 rounded skeleton-shimmer" />
        <div className="h-12 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}

function CheckItemRow({ item }: { item: CheckItem }) {
  const isPass = item.status === "통과";
  return (
    <div className="py-4 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 w-1.5 h-1.5 rounded-full ${
              isPass ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`text-sm font-semibold leading-snug ${
              isPass ? "text-gray-700" : "text-amber-800"
            }`}
          >
            {item.check_title}
          </span>
        </div>
        <span
          className={`shrink-0 text-[11px] font-medium tracking-tight ${
            isPass ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {isPass ? "통과" : "수정권고"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-3.5">
        {item.law_list.map((law) => (
          <LawBadge key={law} law={law} />
        ))}
      </div>
      <p className="text-sm text-gray-500 leading-relaxed pl-3.5">
        {item.check_description}
      </p>
    </div>
  );
}

function ContentCard({
  card,
  index,
}: {
  card: ContentTypeCard;
  index: number;
}) {
  const hasIssue = card.check_list.some((c) => c.status === "수정권고");
  const issueCount = card.check_list.filter(
    (c) => c.status === "수정권고",
  ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b rounded-t-xl ${
          hasIssue
            ? "border-amber-100 bg-amber-50/40"
            : "border-emerald-100 bg-emerald-50/30"
        }`}
      >
        <h3 className="flex items-center text-sm font-bold text-gray-900">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mr-2 ${
              hasIssue
                ? "bg-amber-200 text-amber-800"
                : "bg-emerald-200 text-emerald-800"
            }`}
          >
            {index + 1}
          </span>
          {card.content_label}
        </h3>
        <div className="flex items-center gap-2">
          {hasIssue ? (
            <>
              <span className="text-[11px] text-amber-400 font-medium">
                {issueCount}건
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                ! 수정권고
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">
              ✓ 통과
            </span>
          )}
        </div>
      </div>
      <div className="px-5 divide-y divide-gray-100">
        {card.check_list.map((item, i) => (
          <CheckItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewPanel({
  version,
  isRefreshing,
}: ReviewPanelProps) {
  if (isRefreshing) return <ReviewPanelSkeleton />;

  const key = `v${version}` as "v1" | "v2" | "v3";
  const data = checklistVersions[key];
  const totalChecks = data.contentCards.reduce(
    (s, c) => s + c.check_list.length,
    0,
  );
  const passCount = data.contentCards.reduce(
    (s, c) => s + c.check_list.filter((i) => i.status === "통과").length,
    0,
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
      {/* 패널 헤더 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">준법 피드백</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              v{version} 검토
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {passCount}/{totalChecks} 통과
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          직접 수정은 2차 페이지에서 가능합니다.
        </p>
        {/* <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div> */}
      </div>

      {/* 종합 의견 */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 rounded-t-xl">
          <h3 className="text-sm font-bold text-gray-900">종합 의견</h3>
          <AISummaryButton />
        </div>
        <div className="p-5">
          {data.overallStatus !== "approved" ? (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold bg-red-100 text-red-600 border border-red-200 rounded-full px-2 py-0.5 mt-0.5">
                ✕ 반려
              </span>
              <p className="text-sm text-red-800 leading-relaxed">
                {data.overallText}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 mt-0.5">
                ✓ 승인
              </span>
              <p className="text-sm text-emerald-900 leading-relaxed">
                {data.overallText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠별 체크리스트 카드 */}
      {data.contentCards.map((card, i) => (
        <ContentCard key={card.content_type} card={card} index={i} />
      ))}

      {/* 제작자에게 전달할 한 줄 요약 */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 rounded-t-xl">
          <svg
            className="w-3.5 h-3.5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-700">
            제작자에게 전달할 한 줄 요약
          </h3>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
