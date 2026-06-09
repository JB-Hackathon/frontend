import { useState } from 'react';
import type { ReviewOriginalContent } from '@/types/api';
import { resolveContentImageSrc } from '@/utils/localImages';

interface ContentPanelProps {
  onCollapse: () => void;
  content: ReviewOriginalContent | null;
}

export default function ContentPanel({ onCollapse, content }: ContentPanelProps) {
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);

  const imageUrls = content?.contentFileUrls ?? [];
  const openImageSrc =
    openImageIndex !== null ? resolveContentImageSrc(imageUrls[openImageIndex]) : undefined;

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
        {!content ? (
          <p className="text-xs text-gray-400 text-center mt-6">콘텐츠를 불러오는 중…</p>
        ) : (
          <>
            {/* Attached files */}
            {imageUrls.length > 0 && (
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">첨부 파일</h3>
                <div className="space-y-2.5">
                  {imageUrls.map((url, index) => {
                    const imageSrc = resolveContentImageSrc(url);
                    const fileName = content.contentFilePaths[index]?.split('/').pop() ?? url;
                    return imageSrc ? (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setOpenImageIndex(index)}
                        title="클릭하면 확대해서 볼 수 있어요"
                        className="block w-full rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <img src={imageSrc} alt={fileName} className="w-full max-h-72 object-cover" />
                      </button>
                    ) : (
                      <div
                        key={url}
                        className="w-24 aspect-square bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1.5"
                      >
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[9px] text-gray-400 truncate max-w-full px-1">{fileName}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {content.contentText && (
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">텍스트 / 카피</h3>
                <div className="border-l-2 border-gray-200 pl-3 py-0.5">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{content.contentText}</p>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Image lightbox */}
      {openImageIndex !== null && openImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8"
          onClick={() => setOpenImageIndex(null)}
        >
          <img
            src={openImageSrc}
            alt={content?.contentFilePaths[openImageIndex]?.split('/').pop() ?? ''}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpenImageIndex(null)}
            title="닫기"
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
