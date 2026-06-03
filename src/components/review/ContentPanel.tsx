import { cards } from '../../utils/reviewDummyData';

interface ContentPanelProps {
  onCollapse: () => void;
}

export default function ContentPanel({ onCollapse }: ContentPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <span className="text-sm font-semibold text-gray-800">제출된 콘텐츠 (원본)</span>
        <button
          onClick={onCollapse}
          title="접기"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Content type tags */}
        <div className="flex flex-wrap gap-1.5">
          {['SNS 카드뉴스', '이미지+텍스트', '3장'].map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
              {t}
            </span>
          ))}
        </div>

        {/* Attached images */}
        <section>
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">첨부 이미지</h3>
          <div className="flex gap-2">
            {['card_01', 'card_02', 'card_03'].map((name) => (
              <div
                key={name}
                className="flex-1 aspect-square bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1.5"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[9px] text-gray-400">{name}.png</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">텍스트 / 카피</h3>
          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.label} className="border-l-2 border-gray-200 pl-3 py-0.5">
                <p className="text-[10px] text-gray-400 font-medium mb-1">{card.label}</p>
                {card.lines.map((line, i) => (
                  <p key={i} className="text-sm text-gray-700">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">제작자 메모</h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
            SNS 채널 노출용으로 임팩트 강하게 작성했습니다. 우대조건은 Card 3 하단에 작게 표기되어 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
