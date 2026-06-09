import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  getEditorContent,
  saveReport,
  requestPublish,
} from "@/services/editorService";
import {
  getReviewOriginalContent,
  getReviewComments,
} from "@/services/reviewService";
import type {
  EditorContent as EditorContentData,
  ReviewOriginalContent,
} from "@/types/api";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import EditorToolbar from "@/components/editor/EditorToolbar";
import { resolveContentImageSrc } from "@/utils/localImages";

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
  const [editorContent, setEditorContent] = useState<EditorContentData | null>(
    null,
  );
  const [originalContent, setOriginalContent] =
    useState<ReviewOriginalContent | null>(null);
  // undefined = 아직 미조회, null = 조회했지만 없음, string = 실제 코멘트
  const [reviewComments, setReviewComments] = useState<
    string | null | undefined
  >(undefined);
  const dragRef = useRef<DragState | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedIdRef = useRef<string | null>(null);

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
    content: "",
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

  // 에디터 진입: 콘텐츠 정보 + 기존 보고서 초안 로드
  useEffect(() => {
    let cancelled = false;
    setEditorContent(null);
    //loadedReportRef.current = null;
    getEditorContent(contentId).then((data) => {
      if (!cancelled) setEditorContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  // 좌측 패널 + 헤더: 제출된 원본 콘텐츠 조회
  useEffect(() => {
    let cancelled = false;
    setOriginalContent(null);
    setReviewComments(undefined);
    getReviewOriginalContent(contentId)
      .then((data) => {
        if (!cancelled) setOriginalContent(data);
      })
      .catch(() => {
        if (!cancelled) setReviewComments(null);
      });
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  // 원본 콘텐츠 로드 후 심의 코멘트 조회
  useEffect(() => {
    if (!originalContent?.reviewId) return;
    let cancelled = false;
    getReviewComments(originalContent.reviewId)
      .then((comments) => {
        setReviewComments(comments);
      })
      .catch(() => {
        if (!cancelled) setReviewComments(null);
      });
    return () => {
      cancelled = true;
    };
  }, [originalContent?.reviewId]);

  useEffect(() => {
    // 1. 에디터가 없거나 파괴된 상태면 무시
    if (!editor || editor.isDestroyed) return;

    // 2. [핵심] 두 API 데이터가 모두 '응답 완료' 상태인지 확인
    // editorContent는 null이 초기값(대기), reviewComments는 undefined가 초기값(대기)
    if (editorContent === null || reviewComments === undefined) {
      return; // 둘 중 하나라도 로딩 중이면 무조건 대기
    }

    // 3. 이미 현재 contentId로 에디터 세팅을 1회 완료했다면 중복 실행 방지
    if (initializedIdRef.current === contentId) return;

    // 4. 에디터에 넣을 최종 HTML 내용 결정
    let finalHtml = "";
    if (editorContent.reportHtml) {
      // 1순위: 저장된 초안이 있으면 그것을 사용
      finalHtml = editorContent.reportHtml;
    } else if (reviewComments) {
      // 2순위: 초안이 없고 코멘트가 있으면 HTML 텍스트로 파싱해서 사용
      finalHtml = "<p>" + reviewComments.replace(/\n/g, "<br>") + "</p>";
    }

    // 5. 에디터에 내용 삽입
    // focus() 체인을 제거하여 DOM 마운트 전 발생하는 에러 원천 차단
    // setTimeout으로 React의 렌더링 사이클이 끝난 직후 안전하게 실행
    setTimeout(() => {
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(finalHtml, { emitUpdate: false });
      }
    }, 0);

    // 6. 현재 contentId에 대한 초기화 성공 마킹
    initializedIdRef.current = contentId;
  }, [editor, editorContent, reviewComments, contentId]);

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
            {originalContent?.managementNumber ?? contentId}
          </span>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            {originalContent?.title ?? "제목을 불러오는 중…"}
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
                자동저장됨 · {editorContent?.lastSavedAt ?? "-"}
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
            onClick={() => navigate(`/review/${contentId}`)}
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
            onClick={() =>
              requestPublish(contentId).then(() => navigate("/dashboard"))
            }
            className="px-4 py-1.5 text-sm font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap"
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
              {!originalContent ? (
                <p className="text-xs text-gray-400 text-center mt-6">
                  콘텐츠를 불러오는 중…
                </p>
              ) : (
                <>
                  {/* Attached images */}
                  {originalContent.contentFileUrls.length > 0 && (
                    <section>
                      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                        첨부 이미지
                      </h3>
                      <div className="flex gap-2">
                        {originalContent.contentFileUrls.map((url, index) => {
                          const imageSrc = resolveContentImageSrc(url);
                          const fileName =
                            originalContent.contentFilePaths[index]
                              ?.split("/")
                              .pop() ?? url;
                          return (
                            <div
                              key={url}
                              className="flex-1 aspect-square bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1.5 overflow-hidden"
                            >
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={fileName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <>
                                  <svg
                                    className="w-6 h-6 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-[9px] text-gray-400">
                                    {fileName}
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Text / copy */}
                  {originalContent.contentText && (
                    <section>
                      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                        텍스트
                      </h3>
                      <div className="border-l-2 border-gray-200 pl-3 py-0.5">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {originalContent.contentText}
                        </p>
                      </div>
                    </section>
                  )}
                </>
              )}
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
        <div
          style={{ width: rightWidth }}
          className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-800">
                작성자 메모
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {editorContent ? (
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                {editorContent.creatorNote}
              </p>
            ) : (
              <p className="text-xs text-gray-400 text-center mt-6">
                메모를 불러오는 중…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
