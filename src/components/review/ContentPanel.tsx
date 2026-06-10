import { useState, useEffect, useCallback } from "react";
import { submittedContentText } from "../../utils/reviewDummyData";
import jbImage from "../../assets/JB_image.png";

const cardImages = [{ src: jbImage, label: "첨부 이미지" }];

interface ContentPanelProps {
  onCollapse: () => void;
}

function ImageLightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { src, label } = cardImages[index];
  const total = cardImages.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 닫기 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 이전 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
        disabled={index === 0}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 이미지 */}
      <div
        className="relative max-w-lg w-full mx-16 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={label} className="w-full rounded-xl shadow-2xl" />
        {/* 인디케이터 */}
        <div className="flex items-center gap-2">
          {cardImages.map((_, i) => (
            <button
              key={i}
              onClick={() => (i < index ? onPrev() : onNext())}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === index ? "bg-white w-4" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <span className="text-white/50 text-xs">
          {label} · {index + 1} / {total}
        </span>
      </div>

      {/* 다음 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
        disabled={index === total - 1}
      >
        <svg
          className="w-6 h-6"
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
  );
}

export default function ContentPanel({ onCollapse }: ContentPanelProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handlePrev = useCallback(
    () => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const handleNext = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null && i < cardImages.length - 1 ? i + 1 : i,
      ),
    [],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <span className="text-sm font-semibold text-gray-800">
          제출된 콘텐츠 (원본)
        </span>
        <button
          onClick={onCollapse}
          title="접기"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 p-4 gap-5">
        {/* Content type tags */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {["SNS 카드뉴스", "이미지+텍스트", "1장"].map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Attached images */}
        <section className="shrink-0">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            첨부 이미지
          </h3>
          <div className="flex gap-2">
            {cardImages.map(({ src, label }, idx) => (
              <button
                key={label}
                onClick={() => setLightboxIdx(idx)}
                className="group w-32 aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50 relative cursor-zoom-in"
              >
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 shrink-0">
            텍스트
          </h3>
          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {submittedContentText}
            </p>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <ImageLightbox
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
