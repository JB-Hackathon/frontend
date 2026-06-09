function ChevronIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface Props {
  from: string;
  current: string;
  to: string;
}

/** 신규 기능 페이지 상단의 "진입 경로 → 현재 단계 → 다음 단계" 흐름 표시 바 */
export default function FlowPathBar({ from, current, to }: Props) {
  return (
    <div className="bg-gray-100/60 border border-gray-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-2.5 text-sm">
      <span className="font-semibold text-gray-400">진입 경로</span>
      <span className="text-gray-500">{from}</span>
      <ChevronIcon />
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold bg-white">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
        {current}
      </span>
      <ChevronIcon />
      <span className="text-gray-500">{to}</span>
    </div>
  );
}
