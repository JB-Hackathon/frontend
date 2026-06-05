import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '@/components/layout/AppNavbar';
import Dropdown from '@/components/common/Dropdown';
import { JB_AFFILIATES } from '@/utils/constants/JB';
import {
  CHANNELS,
  LANGUAGES,
  CONTENT_CATEGORIES,
  FINANCIAL_SUBCATEGORIES,
  ADVISORS,
} from '@/utils/constants/upload';
import { useAuth } from '@/contexts/AuthContext';

type Composition = 'image' | 'text' | 'both';

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [affiliate, setAffiliate] = useState(user?.affiliate ?? '');
  const [language, setLanguage] = useState('ko');
  const [category, setCategory] = useState('');
  const [financialSub, setFinancialSub] = useState('');
  const [channel, setChannel] = useState('');
  const [advisor, setAdvisor] = useState('auto');
  const [composition, setComposition] = useState<Composition>('both');
  const [title, setTitle] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [campaign, setCampaign] = useState('');
  const [caption, setCaption] = useState('');
  const [note, setNote] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const affiliatePlaceholder =
    JB_AFFILIATES.find((a) => a.value === user?.affiliate)?.label ?? '소속 업권을 선택하세요';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            메인으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">콘텐츠 업로드</h1>
          <p className="text-sm text-gray-400 mt-0.5">심의 요청을 작성합니다</p>
        </div>

        {/* 2-column layout */}
        <div className="flex gap-6 items-start">
          {/* 좌측: 폼 */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* 기본 정보 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1B3A6B]">기본 정보</h2>

              {/* 업권 + 언어 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    업권 <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={JB_AFFILIATES}
                    value={affiliate}
                    onChange={setAffiliate}
                    placeholder={affiliatePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    언어 <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={LANGUAGES}
                    value={language}
                    onChange={setLanguage}
                    placeholder="언어 선택"
                  />
                </div>
              </div>

              {/* 콘텐츠 유형 (법적 분류) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  콘텐츠 유형 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CONTENT_CATEGORIES.map((cat) => (
                    <label
                      key={cat.value}
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        category === cat.value
                          ? 'border-[#1B3A6B] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={category === cat.value}
                          onChange={() => {
                            setCategory(cat.value);
                            if (cat.value !== 'financial') setFinancialSub('');
                          }}
                          className="accent-[#1B3A6B] shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-900">{cat.label}</span>
                      </div>
                      {cat.desc && (
                        <p className="text-xs text-gray-400 mt-0.5 pl-5">{cat.desc}</p>
                      )}
                    </label>
                  ))}
                </div>

                {/* 금융 상품 광고 세부 분류 */}
                {category === 'financial' && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-medium text-gray-600 mb-2.5">
                      세부 분류 <span className="text-red-500">*</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FINANCIAL_SUBCATEGORIES.map((sub) => (
                        <label
                          key={sub.value}
                          className={`flex items-center px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm font-medium ${
                            financialSub === sub.value
                              ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-[#1B3A6B]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="financialSub"
                            value={sub.value}
                            checked={financialSub === sub.value}
                            onChange={() => setFinancialSub(sub.value)}
                            className="sr-only"
                          />
                          {sub.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 채널 + 담당 자문가 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    채널 <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={CHANNELS}
                    value={channel}
                    onChange={setChannel}
                    placeholder="채널을 선택하세요"
                  />
                  <p className="text-xs text-gray-400 mt-1">홈페이지 / SNS / 문자 / 카카오톡 / 기타</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">담당 자문가</label>
                  <Dropdown
                    options={ADVISORS}
                    value={advisor}
                    onChange={setAdvisor}
                    placeholder="자동 배정"
                  />
                </div>
              </div>

              {/* 콘텐츠 구성 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  콘텐츠 구성 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { value: 'image', label: '이미지만', desc: 'PNG · JPG · GIF' },
                      { value: 'text', label: '텍스트만', desc: '카피 · 본문 · 스크립트' },
                      { value: 'both', label: '이미지 + 텍스트', desc: '카드뉴스 · 배너 카피' },
                    ] as { value: Composition; label: string; desc: string }[]
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col p-3.5 border-2 rounded-lg cursor-pointer transition-colors ${
                        composition === opt.value
                          ? 'border-[#1B3A6B] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="composition"
                          value={opt.value}
                          checked={composition === opt.value}
                          onChange={() => setComposition(opt.value)}
                          className="accent-[#1B3A6B]"
                        />
                        <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 pl-5">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 신규 적금 상품 런칭 SNS 카드뉴스"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                />
              </div>

              {/* 발행 예정일 + 캠페인 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">발행 예정일</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">캠페인</label>
                  <input
                    type="text"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="예: 2026 Q2 적금"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 콘텐츠 본문 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1B3A6B]">콘텐츠 본문</h2>

              {/* 텍스트/카피 - 이미지만 선택 시 숨김 */}
              {composition !== 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    텍스트 / 카피 (필수) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={6}
                    placeholder={`심의가 필요한 카피, 헤드라인, 본문을 모두 작성하세요.\n— 헤드라인: ...\n— 서브 카피: ...\n— 본문: ...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent resize-none"
                  />
                  {composition === 'text' && (
                    <p className="text-xs text-gray-400 mt-1">
                      ※ "텍스트만" 선택 시 이미지 첨부 영역은 숨겨집니다.
                    </p>
                  )}
                </div>
              )}

              {/* 첨부 이미지 - 텍스트만 선택 시 숨김 */}
              {composition !== 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    첨부 이미지
                    {composition === 'image' ? (
                      <span className="text-red-500"> *</span>
                    ) : (
                      <span className="text-gray-400 font-normal"> (선택)</span>
                    )}
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {images.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center justify-center w-32 h-20 bg-gray-50 border border-gray-200 rounded-lg group overflow-hidden"
                      >
                        <span className="text-xs text-gray-500 truncate px-2 text-center">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-gray-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-32 h-20 border-2 border-dashed border-[#1B3A6B] rounded-lg text-sm text-[#1B3A6B] hover:bg-blue-50 transition-colors font-medium"
                    >
                      + 파일 추가
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF 형식 지원</p>
                </div>
              )}

              {/* 제작자 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  제작자 메모{' '}
                  <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="심의관에게 전달할 참고사항이 있으면 작성하세요."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* 우측 사이드바 */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 sticky top-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">심의 요청</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  작성한 콘텐츠를 준법자문가에게 전달하여 심의를 요청합니다.
                </p>
              </div>
              <button
                type="button"
                className="w-full bg-[#1B3A6B] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d55] transition-colors"
              >
                심의 요청 제출
              </button>
              <button
                type="button"
                className="w-full bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                임시 저장
              </button>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  제출 후 평균 1.5영업일 내 1차 피드백이 제공됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
