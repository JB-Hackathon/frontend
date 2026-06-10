import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { saveReport, requestPublish } from "@/services/editorService";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import {
  Table,
  TableRow,
  TableCell as BaseTableCell,
  TableHeader as BaseTableHeader,
} from "@tiptap/extension-table";
import EditorToolbar from "@/components/editor/EditorToolbar";
import { submittedContentText } from "@/utils/reviewDummyData";
import JBImage from "@/assets/JB_image.png";
import { C0144_TIPTAP_HTML } from "@/utils/editorDummyData";

const cardImages = [JBImage];

const cellAttributes = {
  addAttributes(this: { parent?: () => Record<string, unknown> }) {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.cssText || null,
        renderHTML: (attributes: { style?: string | null }) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
};

const TableCell = BaseTableCell.extend(cellAttributes);
const TableHeader = BaseTableHeader.extend(cellAttributes);

const INITIAL_CONTENT = `<h1>준법 자문 검토 보고서</h1>
<p><em>담당자: 백승효 자문가 &nbsp;&nbsp;심의 번호: JB-2026-C0144</em></p>
<h2>1. 종합 심의 결과(심의필 번호 : JB-2026-C0144)</h2>
<p><strong>[최종 승인]</strong><br/>
이전 차수에서 제시된 준법감시실의 권고 사항이 100% 반영 완료되었기에 최종 배포 및 발행을 승인함. 금융소비자보호법 및 표시광고법 위반 소지가 모두 해소되었으므로, 해당 수정본 시안대로 마케팅을 진행하고 최종본 파일은 아카이빙할 것.</p>
<h2>2. 심의 개요</h2>
<p>본 검토는 마케팅팀에서 배포 요청한 신규 금융상품(C0144)의 인스타그램 등 SNS 채널 게시용 카드뉴스 시안(총 3종) 및 관련 텍스트 카피에 대한 최종 준법 심의 결과입니다. 관련 법령인 '금융소비자보호법 제32조(부당광고행위 금지)' 및 '표시·광고의 공정화에 관한 법률 제3조'를 기준으로 금융소비자 오인 유발 가능성을 판단했습니다.</p>
<h2>3. 종합 심의 의견 (최종 승인)</h2>
<p>제출하신 텍스트 및 이미지는 금융소비자보호법 및 표시·광고의 공정화 법률 위반 요소가 모두 해소되었습니다. 발행하셔도 됩니다. 특히 헤드라인의 우대금리 표기 옆에 구체적인 우대조건이 명확히 추가되었으며, "누구나", "놓치면 손해" 등 소비자의 불안감을 조성하거나 단정적인 표현이 수정되어 표시 요건을 안정적으로 충족하고 있습니다.</p>
<h2>4. 검토 및 수정 의견</h2>
<p>먼저 전체 텍스트 및 기본 카피 영역의 경우, 객관적인 비교 기준 없이 경쟁 금융상품 대비 우월성을 단정하던 "국내 최고", "무조건 유리" 표현이 가이드라인에 맞춰 수정되었습니다. 또한 기본금리와 우대금리의 조건부 구조를 감추고 오인을 유발할 수 있었던 "고정 금리", "무조건 보장" 문구가 올바르게 시정되었으며, 안전성 확보 절차 생략 및 예금자보호 범위 과장 표현도 법적 기준에 맞게 보완 완료되었습니다.</p>
<p>1번 카드(헤드라인 페이지)의 이미지 내 "국내 최고 적금" 문구 옆에 비교 출처 및 명확한 산출 기준이 명시되어 위반 소지를 해소했습니다. 아울러 우대금리 표기 옆에 앱 가입 및 자동이체라는 필수 우대조건이 누락 없이 병기되어 금융소비자보호법을 충족하며, JB은행 공식 CI 색상 및 로고 가이드라인도 철저히 준수하고 있습니다.</p>
<p>2번 카드(혜택 안내 페이지)의 경우, 기존 시안에서 단서 없이 강조되었던 "최고 11.0% 고정 금리" 문구 주변에 '100일간 100회 납입 시'라는 필수 우대조건 단서가 동등한 위치와 크기로 병기되어 오인 소지를 차단했습니다. 복잡한 절차를 생략할 수 있는 것처럼 표현되었던 본인인증 문구 역시 실제 필수 인증 절차가 필요함을 안내하는 문구로 시정되었으며, 배경과 텍스트의 명암 대비(WCAG AA 기준) 등 시각적 가독성 요건도 훌륭히 만족합니다.</p>
<p>마지막으로 3번 카드(CTA 페이지)는 디지털 광고 가이드라인 요구사항에 맞춰 앱스토어 및 구글플레이 다운로드 경로가 정상적으로 표기되었습니다. 특히 기존의 "정부가 원금과 이자를 전액 보장"이라는 표현은 무제한 보장으로 오인될 리스크가 컸으나, 예금보험공사의 법정 보호한도(원금과 이자 합산 1인당 5천만 원) 및 보호 주체를 명확히 밝히는 문구로 전면 수정되어 최종 통과 판정을 내렸습니다.</p>`;

interface DragState {
  side: "left" | "right";
  startX: number;
  startWidth: number;
}

const MIN_W = 180;
const DEFAULT_LEFT = 260;
const DEFAULT_RIGHT = 280;

export default function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const contentId = id ?? "C-0143";
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const handleLightboxPrev = useCallback(
    () => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const handleLightboxNext = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null && i < cardImages.length - 1 ? i + 1 : i,
      ),
    [],
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") handleLightboxPrev();
      if (e.key === "ArrowRight") handleLightboxNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, handleLightboxPrev, handleLightboxNext]);
  const dragRef = useRef<DragState | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapLink.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: C0144_TIPTAP_HTML,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveReport(contentId, editor.getHTML()).then(() =>
          setSaveStatus("saved"),
        );
      }, 1200);
    },
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { side, startX, startWidth } = dragRef.current;
      const delta = e.clientX - startX;
      if (side === "left") {
        setLeftWidth(Math.max(MIN_W, Math.min(520, startWidth + delta)));
      } else {
        setRightWidth(Math.max(MIN_W, Math.min(480, startWidth - delta)));
      }
    };
    const onMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startDrag = (side: "left" | "right") => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      side,
      startX: e.clientX,
      startWidth: side === "left" ? leftWidth : rightWidth,
    };
    setIsDragging(true);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gray-50 ${
        isDragging ? "cursor-col-resize select-none" : ""
      }`}
    >
      {/* ── HEADER ── */}
      <header className="flex items-center gap-3 px-5 h-14 bg-white border-b border-gray-200 shrink-0 min-w-0">
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0"
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
            메인
          </Link>
          <span className="text-gray-300 shrink-0">|</span>
          <span className="text-sm font-mono text-gray-500 shrink-0">
            C-0143
          </span>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            주거래 우대 통장 · SNS 카드뉴스 (3종)
          </h1>

          {/* Step indicators */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-[#1B3A6B] text-white rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              1차 AI 검토
            </span>
            <svg
              className="w-3 h-3 text-gray-400"
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
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B] inline-block" />
              2차 편집
            </span>
            <svg
              className="w-3 h-3 text-gray-400"
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
            <span className="text-xs text-gray-400 px-2.5 py-0.5">Publish</span>
          </div>

          {/* Auto-save status */}
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
            {saveStatus === "saving" ? (
              <>
                <svg
                  className="w-3 h-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3 text-green-500"
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
                자동저장됨 · 14:06
              </>
            )}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            원본 보기
          </button>
          <button
            onClick={() => navigate("/review")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
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
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            1차 검토 페이지로 이동
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            내보내기
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={async () => {
              setIsPublishing(true);
              try {
                await requestPublish(contentId);
                setShowPublishSuccess(true);
              } finally {
                setIsPublishing(false);
              }
            }}
            disabled={isPublishing}
            className="px-4 py-1.5 text-sm font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Publish 요청
          </button>
        </div>
      </header>

      {/* ── PANELS ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: source content */}
        {leftCollapsed ? (
          <div className="w-10 shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-3">
            <button
              onClick={() => setLeftCollapsed(false)}
              title="원본 콘텐츠 펼치기"
              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <span
              className="text-[10px] text-gray-400 leading-tight"
              style={{ writingMode: "vertical-rl" }}
            >
              원본 콘텐츠
            </span>
          </div>
        ) : (
          <div
            style={{ width: leftWidth }}
            className="shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Left panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  원본 콘텐츠
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                  v2
                </span>
              </div>
              <button
                onClick={() => setLeftCollapsed(true)}
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

            {/* Left panel content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Attached images */}
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  첨부 이미지
                </h3>
                <div className="flex gap-2">
                  {cardImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className="group flex-1 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 relative cursor-zoom-in"
                    >
                      <img
                        src={src}
                        alt={`Card ${i + 1}`}
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

              {/* Text / copy */}
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  텍스트
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {submittedContentText}
                </p>
              </section>
            </div>
          </div>
        )}

        {/* Drag divider — left */}
        {!leftCollapsed && (
          <div
            onMouseDown={startDrag("left")}
            className="w-1 shrink-0 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{
              backgroundColor:
                isDragging && dragRef.current?.side === "left"
                  ? "#60a5fa"
                  : "#e5e7eb",
            }}
          />
        )}

        {/* CENTER: editor area */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          <div className="w-7 shrink-0 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
            <span
              className="text-[10px] font-semibold text-gray-400 tracking-widest select-none"
              style={{ writingMode: "vertical-rl" }}
            >
              콘텐츠 에디터
            </span>
          </div>

          {/* Editor with toolbar */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <EditorToolbar editor={editor} />
            <div className="flex-1 overflow-y-auto px-10 py-8">
              <div className="max-w-2xl mx-auto">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Drag divider — right */}
        <div
          onMouseDown={startDrag("right")}
          className="w-1 shrink-0 hover:bg-blue-400 cursor-col-resize transition-colors"
          style={{
            backgroundColor:
              isDragging && dragRef.current?.side === "right"
                ? "#60a5fa"
                : "#e5e7eb",
          }}
        />

        {/* RIGHT: author notes */}
        {/* <div style={{ width: rightWidth }} className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">작성자 메모</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
              SNS 채널 노출용으로 임팩트 강하게 작성했습니다. 우대조건은 수정 사항 반영하여 Card 3 하단에 작게 표기되어 있습니다.
            </p>
          </div>
        </div> */}
      </div>

      {/* Publishing loading overlay */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-12 py-10 flex flex-col items-center gap-5">
            <svg
              className="w-10 h-10 animate-spin text-[#1B3A6B]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-base font-semibold text-gray-800">
              Publish 요청 중...
            </p>
            <p className="text-sm text-gray-500">잠시만 기다려 주세요.</p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxPrev();
            }}
            disabled={lightboxIdx === 0}
            className="absolute left-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
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
          <div
            className="relative max-w-lg w-full mx-16 flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cardImages[lightboxIdx]}
              alt={`Card ${lightboxIdx + 1}`}
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="flex items-center gap-2">
              {cardImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === lightboxIdx ? "bg-white w-4" : "bg-white/40 w-1.5"
                  }`}
                />
              ))}
            </div>
            <span className="text-white/50 text-xs">
              Card {lightboxIdx + 1} · {lightboxIdx + 1} / {cardImages.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxNext();
            }}
            disabled={lightboxIdx === cardImages.length - 1}
            className="absolute right-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
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
      )}

      {/* Publish success modal */}
      {showPublishSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-9 flex flex-col items-center gap-5 min-w-[320px]">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900 mb-1">
                Publish 완료!
              </p>
              <p className="text-sm text-gray-500">
                보고서가 성공적으로 발행되었습니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-1 w-full py-2.5 text-sm font-semibold bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152d55] transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
