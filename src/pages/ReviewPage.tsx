import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ContentPanel from "@/components/review/ContentPanel";
import ReviewPanel from "@/components/review/ReviewPanel";
import ChatPanel from "@/components/review/ChatPanel";
import { updateContentStatus } from "@/services/reviewService";
import { freeChatCards, feedbackVersions } from "@/utils/reviewDummyData";

const DEMO_CONFIGS: Record<
  string,
  { title: string; contentId: string; mode: "scripted" | "free" }
> = {
  "C-0143": {
    title: "주거래 우대 통장 · SNS 카드뉴스 (3종)",
    contentId: "C-0143",
    mode: "scripted",
  },
  "C-0144": {
    title: "JB체크카드 혜택 안내 · 온라인 배너 (2종)",
    contentId: "C-0144",
    mode: "free",
  },
};

const MIN_PANEL_WIDTH = 200;
const DEFAULT_LEFT_WIDTH = 300;
const DEFAULT_RIGHT_WIDTH = 380;

interface DragState {
  side: "left" | "right";
  startX: number;
  startWidth: number;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const demo = DEMO_CONFIGS[id ?? ""] ?? DEMO_CONFIGS["C-0143"];
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 데모 상태: 초기 로드 시 스켈레톤 → v1, 채팅 단계마다 재분석 후 버전 업
  const [reviewVersion, setReviewVersion] = useState<1 | 2 | 3>(1);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsRefreshing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const currentStatus = isRefreshing
    ? null
    : feedbackVersions[`v${reviewVersion}`].overallStatus;

  const handlePrimaryAction = () => {
    if (currentStatus === "approved") {
      navigate(`/editor/${demo.contentId}`);
    } else if (currentStatus === "rejected") {
      if (id) updateContentStatus(id, "rejected").then(() => navigate("/"));
      else navigate("/");
    }
  };

  const handleAdvanceStep = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setReviewVersion((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3));
      setIsRefreshing(false);
    }, 2200);
  };

  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { side, startX, startWidth } = dragRef.current;
      const delta = e.clientX - startX;
      if (side === "left") {
        setLeftWidth(
          Math.max(MIN_PANEL_WIDTH, Math.min(560, startWidth + delta)),
        );
      } else {
        setRightWidth(
          Math.max(MIN_PANEL_WIDTH, Math.min(560, startWidth - delta)),
        );
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

  const onDividerMouseDown =
    (side: "left" | "right") => (e: React.MouseEvent) => {
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
      {/* ── TOP HEADER ── */}
      <header className="flex items-center gap-3 px-5 h-14 bg-white border-b border-gray-200 shrink-0 min-w-0">
        {/* Left meta */}
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
            {demo.contentId}
          </span>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            {demo.title}
          </h1>
          <span className="text-sm text-gray-400 shrink-0">자동저장 14:08</span>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 border border-amber-200 text-amber-600 bg-amber-50 rounded-full">
            대기
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              id &&
              updateContentStatus(id, "rejected").then(() =>
                navigate("/dashboard"),
              )
            }
            className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            반려로 처리
          </button>
          <button
            onClick={() =>
              id &&
              updateContentStatus(id, "pending").then(() =>
                navigate("/dashboard"),
              )
            }
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            초안으로 되돌리기
          </button>
          <button
            onClick={() => navigate(`/editor/${demo.contentId}`)}
            className="px-4 py-1.5 text-sm font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap"
          >
            에디터로 이동하기
          </button>
        </div>
      </header>

      {/* ── THREE PANELS ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: collapsed stub */}
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
          /* LEFT: expanded panel */
          <div
            style={{ width: leftWidth }}
            className="shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          >
            <ContentPanel
              onCollapse={() => setLeftCollapsed(true)}
              cards={demo.mode === "free" ? freeChatCards : undefined}
            />
          </div>
        )}

        {/* Divider — left */}
        {!leftCollapsed && (
          <div
            onMouseDown={onDividerMouseDown("left")}
            className="w-1 shrink-0 bg-gray-150 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{
              backgroundColor:
                isDragging && dragRef.current?.side === "left"
                  ? "#60a5fa"
                  : undefined,
            }}
          />
        )}

        {/* CENTER */}
        <div className="flex-1 overflow-y-auto">
          <ReviewPanel version={reviewVersion} isRefreshing={isRefreshing} />
        </div>

        {/* Divider — right */}
        {!rightCollapsed && (
          <div
            onMouseDown={onDividerMouseDown("right")}
            className="w-1 shrink-0 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{
              backgroundColor:
                isDragging && dragRef.current?.side === "right"
                  ? "#60a5fa"
                  : undefined,
            }}
          />
        )}

        {rightCollapsed ? (
          <div className="w-10 shrink-0 bg-white border-l border-gray-200 flex flex-col items-center py-3 gap-3">
            <button
              onClick={() => setRightCollapsed(false)}
              title="AI 자문 펼치기"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span
              className="text-[10px] text-gray-400"
              style={{ writingMode: "vertical-rl" }}
            >
              자문 채팅
            </span>
          </div>
        ) : (
          <div
            style={{ width: rightWidth }}
            className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
          >
            <ChatPanel
              onCollapse={() => setRightCollapsed(true)}
              onAdvanceStep={handleAdvanceStep}
              mode={demo.mode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
