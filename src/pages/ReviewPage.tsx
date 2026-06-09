import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ContentPanel from '@/components/review/ContentPanel';
import ReviewPanel from '@/components/review/ReviewPanel';
import ChatPanel from '@/components/review/ChatPanel';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { updateContentStatus, updateReviewStatus, getReviewOriginalContent } from '@/services/reviewService';
import type { ReviewOriginalContent } from '@/types/api';


const MIN_PANEL_WIDTH = 200;
const DEFAULT_LEFT_WIDTH = 300;
const DEFAULT_RIGHT_WIDTH = 380;

interface DragState {
  side: 'left' | 'right';
  startX: number;
  startWidth: number;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [originalContent, setOriginalContent] = useState<ReviewOriginalContent | null>(null);

  const dragRef = useRef<DragState | null>(null);

  // 원본 콘텐츠 조회
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setOriginalContent(null);
    getReviewOriginalContent(id).then((data) => {
      if (!cancelled) setOriginalContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { side, startX, startWidth } = dragRef.current;
      const delta = e.clientX - startX;
      if (side === 'left') {
        setLeftWidth(Math.max(MIN_PANEL_WIDTH, Math.min(560, startWidth + delta)));
      } else {
        setRightWidth(Math.max(MIN_PANEL_WIDTH, Math.min(560, startWidth - delta)));
      }
    };
    const onMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onDividerMouseDown = (side: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      side,
      startX: e.clientX,
      startWidth: side === 'left' ? leftWidth : rightWidth,
    };
    setIsDragging(true);
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${isDragging ? 'cursor-col-resize select-none' : ''}`}>

      {/* ── TOP HEADER ── */}
      <header className="flex items-center gap-3 px-5 h-14 bg-white border-b border-gray-200 shrink-0 min-w-0">
        {/* Left meta */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            메인
          </Link>

          <span className="text-gray-300 shrink-0">|</span>
          <span className="text-sm font-mono text-gray-500 shrink-0">{originalContent?.managementNumber ?? '-'}</span>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            {originalContent?.title ?? '제목을 불러오는 중…'}
          </h1>
          {originalContent && (
            <span className="shrink-0">
              <StatusBadge status={originalContent.reviewStatus} />
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => id && updateContentStatus(id, 'pending').then(() => navigate('/dashboard'))}
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            초안으로 되돌리기
          </button>
          <button
            onClick={() => {
              if (!id || !originalContent) return;
              if (originalContent.reviewStatus === 'approved') {
                navigate(`/editor/${id}`);
              } else {
                updateReviewStatus(originalContent.reviewId, 'rejected').then(() => navigate('/'));
              }
            }}
            className="px-4 py-1.5 text-sm font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap"
          >
            확인
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-[10px] text-gray-400 leading-tight" style={{ writingMode: 'vertical-rl' }}>
              원본 콘텐츠
            </span>
          </div>
        ) : (
          /* LEFT: expanded panel */
          <div
            style={{ width: leftWidth }}
            className="shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          >
            <ContentPanel onCollapse={() => setLeftCollapsed(true)} content={originalContent} />
          </div>
        )}

        {/* Divider — left */}
        {!leftCollapsed && (
          <div
            onMouseDown={onDividerMouseDown('left')}
            className="w-1 shrink-0 bg-gray-150 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{ backgroundColor: isDragging && dragRef.current?.side === 'left' ? '#60a5fa' : undefined }}
          />
        )}

        {/* CENTER */}
        <div className="flex-1 overflow-y-auto">
          <ReviewPanel reviewId={originalContent?.reviewId} />
        </div>

        {/* Divider — right */}
        {!rightCollapsed && (
          <div
            onMouseDown={onDividerMouseDown('right')}
            className="w-1 shrink-0 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{ backgroundColor: isDragging && dragRef.current?.side === 'right' ? '#60a5fa' : undefined }}
          />
        )}

        {rightCollapsed ? (
          <div className="w-10 shrink-0 bg-white border-l border-gray-200 flex flex-col items-center py-3 gap-3">
            <button
              onClick={() => setRightCollapsed(false)}
              title="AI 자문 펼치기"
              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[10px] text-gray-400" style={{ writingMode: 'vertical-rl'}}>
              자문 채팅
            </span>
          </div>
        ) : (
          <div
            style={{ width: rightWidth }}
            className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
          >
            <ChatPanel onCollapse={() => setRightCollapsed(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
