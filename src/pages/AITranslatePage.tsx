import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";
import { aiTranslateDummyData } from "@/data/featurePrototypeData";

export default function AITranslatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = aiTranslateDummyData;
  const [activeCode, setActiveCode] = useState(data.translations[0]?.code);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const active =
    data.translations.find((t) => t.code === activeCode) ??
    data.translations[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavbar />

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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {data.statusLabel}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-white">
                  {data.flowLabel}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                번역본 내보내기
              </button>
              <button
                onClick={() => navigate(`/content/${id}/publish`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors font-semibold"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">
            원본 콘텐츠 · 한국어
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {data.originalCopy}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div>
            <h2 className="text-sm font-bold text-gray-800">번역 언어</h2>
            <p className="text-xs text-gray-400 mt-0.5">칩을 눌러 추가/제거</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <span
                key={lang.code}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-default ${
                  lang.selected
                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {lang.selected ? "✓" : "+"} {lang.label}
              </span>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#152d55] transition-colors">
            <span>✦</span> {data.generateLabel}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100 px-3 overflow-x-auto">
            {data.translations.map((t) => (
              <button
                key={t.code}
                onClick={() => setActiveCode(t.code)}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCode === t.code
                    ? "border-[#1B3A6B] text-[#1B3A6B] font-semibold"
                    : "border-transparent text-gray-400 hover:text-gray-600 font-medium"
                }`}
              >
                {t.tabLabel}
              </button>
            ))}
          </div>

          {active && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {active.languageName}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {active.reviewBadge}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                {active.text}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
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
                  {active.backTranslationNote}
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    역번역 보기
                  </button>
                  <button className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <span>✦</span> 재생성
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
