import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { saveReport, requestPublish } from '@/services/editorService';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { cards } from '@/utils/reviewDummyData';

const INITIAL_CONTENT = `<h1>준법 자문 검토 보고서 — SNS 카드뉴스 (3종)</h1>
<p><em>담당자: 김준법 대리 &nbsp;&nbsp;심의 번호: JB-11111-11111</em></p>
<h2>1. 종합 심의 결과(심의필 번호 : JB-11111-11111)</h2>
<p><strong>[승인]</strong><br/>
아래 '4. 수정 및 권고사항'에 명시된 지적 사항을 100% 반영하여 수정하는 조건으로 배포를 승인함. 수정본에 대한 재검토는 생략하나, 최종본 파일은 준법감시실에 아카이빙할 것.</p>
<h2>2. 심의 개요</h2>
<p>본 검토는 마케팅팀에서 요청한 신제품 '간 건강 밀크씨슬 편'의 인스타그램 게시용 카드뉴스 초안(총 5장)에 대한 준법 심의 결과입니다. 관련 법령인 '표시·광고의 공정화에 관한 법률(표시광고법)' 및 '식품 등의 표시·광고에 관한 법률'을 기준으로 적법성을 판단했습니다.</p>
<h2>3. 종합 심의 의견 (조건부 승인)</h2>
<p>제출된 카드뉴스 시안은 전반적으로 브랜드 아이덴티티를 잘 녹여냈으나, 2번 카드와 4번 카드의 문구에서 소비자 오인의 소지가 있는 '거짓·과장 광고' 및 '의약품 오인 우려' 문구가 발견되었습니다. 해당 항목을 아래 수정 의견에 따라 보완하는 조건으로 최종 승인이 가능합니다.</p>
<h2>4. 검토 및 수정 의견</h2>
<p>먼저 1번 카드(인트로 페이지)의 "피로를 지친 당신을 위한 하나의 선택"이라는 문구는 통상적인 상업적 과장 표현(Puffery) 범위 내에 해당하므로 '적합' 판정을 내렸습니다.</p>
<p>문제가 되는 부분은 2번 카드(성분 성명 페이지)입니다. 시안 내 '타사 대비 5배 강력한 간세포 재생 효과'라는 문구는 표시광고법 제3조 제1항 제1호(거짓·과장의 표시·광고) 위반 소지가 매우 높습니다. 객관적이고 공인된 임상실험 데이터나 시험 성적서 등 실증 자료가 부재한 상태에서 '타사 대비', '5배 강력한 등의 절대적 비교 수치를 사용하는 것은 불법입니다.</p>`;

interface DragState {
  side: 'left' | 'right';
  startX: number;
  startWidth: number;
}

const MIN_W = 180;
const DEFAULT_LEFT = 260;
const DEFAULT_RIGHT = 280;

export default function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const contentId = id ?? 'C-0143';
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
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
    content: INITIAL_CONTENT,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] text-gray-800',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveReport(contentId, editor.getHTML()).then(() => setSaveStatus('saved'));
      }, 1200);
    },
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { side, startX, startWidth } = dragRef.current;
      const delta = e.clientX - startX;
      if (side === 'left') {
        setLeftWidth(Math.max(MIN_W, Math.min(520, startWidth + delta)));
      } else {
        setRightWidth(Math.max(MIN_W, Math.min(480, startWidth - delta)));
      }
    };
    const onMouseUp = () => { dragRef.current = null; setIsDragging(false); };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const startDrag = (side: 'left' | 'right') => (e: React.MouseEvent) => {
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

      {/* ── HEADER ── */}
      <header className="flex items-center gap-3 px-5 h-14 bg-white border-b border-gray-200 shrink-0 min-w-0">
        {/* Left */}
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
          <span className="text-sm font-mono text-gray-500 shrink-0">C-0143</span>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            주거래 우대 통장 · SNS 카드뉴스 (3종)
          </h1>

          {/* Step indicators */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-[#1B3A6B] text-white rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              1차 AI 검토
            </span>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B] inline-block" />
              2차 편집
            </span>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs text-gray-400 px-2.5 py-0.5">Publish</span>
          </div>

          {/* Auto-save status */}
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
            {saveStatus === 'saving' ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
            onClick={() => navigate('/review')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            1차 검토 페이지로 이동
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            내보내기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => requestPublish(contentId).then(() => navigate('/dashboard'))}
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-[10px] text-gray-400 leading-tight" style={{ writingMode: 'vertical-rl' }}>
              원본 콘텐츠
            </span>
          </div>
        ) : (
          <div style={{ width: leftWidth }} className="shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            {/* Left panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">원본 콘텐츠</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">v2</span>
              </div>
              <button
                onClick={() => setLeftCollapsed(true)}
                title="접기"
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Left panel content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
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

              {/* Text / copy */}
              <section>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">텍스트</h3>
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
            </div>
          </div>
        )}

        {/* Drag divider — left */}
        {!leftCollapsed && (
          <div
            onMouseDown={startDrag('left')}
            className="w-1 shrink-0 hover:bg-blue-400 cursor-col-resize transition-colors"
            style={{ backgroundColor: isDragging && dragRef.current?.side === 'left' ? '#60a5fa' : '#e5e7eb' }}
          />
        )}

        {/* CENTER: editor area */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          <div className="w-7 shrink-0 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
            <span
              className="text-[10px] font-semibold text-gray-400 tracking-widest select-none"
              style={{ writingMode: 'vertical-rl' }}
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
          onMouseDown={startDrag('right')}
          className="w-1 shrink-0 hover:bg-blue-400 cursor-col-resize transition-colors"
          style={{ backgroundColor: isDragging && dragRef.current?.side === 'right' ? '#60a5fa' : '#e5e7eb' }}
        />

        {/* RIGHT: author notes */}
        <div style={{ width: rightWidth }} className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
