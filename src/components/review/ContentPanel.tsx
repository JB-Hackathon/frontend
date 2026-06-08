import { useState } from 'react';
import type { ReviewVersionItem } from '@/types/api';
import { resolveContentImageSrc } from '@/utils/localImages';

interface ContentPanelProps {
  onCollapse: () => void;
  version: ReviewVersionItem | null;
}

const CHANNEL_LABELS: Record<ReviewVersionItem['channelType'], string> = {
  homepage: '홈페이지',
  messenger: '메신저',
  sns: 'SNS',
  other: '기타',
};

const CONTENT_TYPE_LABELS: Record<ReviewVersionItem['contentType'], string> = {
  text: '텍스트',
  file: '파일',
  file_with_text: '파일+텍스트',
};

const CONTENT_CATEGORY_LABELS: Record<ReviewVersionItem['contentCategory'], string> = {
  product_ad: '상품 광고',
  brand_service_ad: '브랜드/서비스 광고',
  information: '정보 제공',
  other: '기타',
};

const PRODUCT_CATEGORY_LABELS: Record<ReviewVersionItem['productCategory'], string> = {
  deposit: '예금성',
  loan: '대출성',
  card_benefit: '카드/혜택',
  auto_finance: '자동차금융',
  investment: '투자성',
  other: '기타',
};

export default function ContentPanel({ onCollapse, version }: ContentPanelProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const imageSrc = resolveContentImageSrc(version?.contentFilePath);

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
        {!version ? (
          <p className="text-xs text-gray-400 text-center mt-6">콘텐츠를 불러오는 중…</p>
        ) : (
          <>
            {/* Content type tags */}
            <div className="flex flex-wrap gap-1.5">
              {[
                CHANNEL_LABELS[version.channelType],
                CONTENT_TYPE_LABELS[version.contentType],
                CONTENT_CATEGORY_LABELS[version.contentCategory],
                PRODUCT_CATEGORY_LABELS[version.productCategory],
              ].map((label) => (
                <span key={label} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                  {label}
                </span>
              ))}
            </div>

            {/* Attached file */}
            {version.contentFilePath && (
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">첨부 파일</h3>
                {imageSrc ? (
                  <button
                    type="button"
                    onClick={() => setIsImageOpen(true)}
                    title="클릭하면 확대해서 볼 수 있어요"
                    className="block w-full rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <img src={imageSrc} alt={version.contentFilePath} className="w-full max-h-72 object-cover" />
                  </button>
                ) : (
                  <div className="w-24 aspect-square bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1.5">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[9px] text-gray-400 truncate max-w-full px-1">{version.contentFilePath}</span>
                  </div>
                )}
              </section>
            )}

            <section>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">텍스트 / 카피</h3>
              <div className="border-l-2 border-gray-200 pl-3 py-0.5">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{version.contentText}</p>
              </div>
            </section>

            {version.contentDescription && (
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">제작자 메모</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {version.contentDescription}
                </p>
              </section>
            )}
          </>
        )}
      </div>

      {/* Image lightbox */}
      {isImageOpen && imageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={imageSrc}
            alt={version?.contentFilePath ?? ''}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setIsImageOpen(false)}
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
