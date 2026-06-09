interface FlowPathBarProps {
  from: string;
  current: string;
  to: string;
}

export default function FlowPathBar({ from, current, to }: FlowPathBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-wrap">
      <span>{from}</span>
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="font-semibold text-[#1B3A6B]">{current}</span>
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span>{to}</span>
    </div>
  );
}
