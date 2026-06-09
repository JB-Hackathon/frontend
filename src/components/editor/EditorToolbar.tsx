import type { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
}

type Level = 1 | 2 | 3;

const HEADINGS: { label: string; level: Level }[] = [
  { label: 'H1', level: 1 },
  { label: 'H2', level: 2 },
  { label: 'H3', level: 3 },
];

function ToolBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1 rounded text-sm transition-colors ${
        active
          ? 'bg-[#1B3A6B] text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const textStyleLabel = () => {
    for (const h of HEADINGS) {
      if (editor.isActive('heading', { level: h.level })) return h.label;
    }
    return '본문';
  };

  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-200 bg-white flex-wrap">
      {/* Text style dropdown (simple button cycle) */}
      <div className="relative group">
        <button
          className="flex items-center gap-1 px-2.5 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          title="텍스트 스타일"
        >
          {textStyleLabel()}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded-t-lg"
          >
            본문
          </button>
          {HEADINGS.map((h) => (
            <button
              key={h.level}
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: h.level }).run(); }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 last:rounded-b-lg"
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게">
        <strong>B</strong>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임">
        <em>I</em>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="취소선">
        <s>S</s>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄">
        <span className="underline">U</span>
      </ToolBtn>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {HEADINGS.map((h) => (
        <ToolBtn
          key={h.level}
          onClick={() => editor.chain().focus().toggleHeading({ level: h.level }).run()}
          active={editor.isActive('heading', { level: h.level })}
          title={`제목 ${h.level}`}
        >
          {h.label}
        </ToolBtn>
      ))}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Blockquote */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="인용">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </ToolBtn>

      {/* Code */}
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="코드">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </ToolBtn>

      {/* Link */}
      <ToolBtn
        onClick={() => {
          const url = window.prompt('URL 입력');
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        }}
        active={editor.isActive('link')}
        title="링크"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </ToolBtn>

      {/* Table */}
      <ToolBtn
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="표 삽입"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
        </svg>
      </ToolBtn>

      {/* Bullet list */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="목록">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </ToolBtn>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Undo */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="실행 취소">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </ToolBtn>

      {/* Redo */}
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="다시 실행">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
      </ToolBtn>
    </div>
  );
}
