type TagType = 'regulation' | 'guide' | 'ai';

interface Tag {
  label?: string;
  type: TagType;
}

interface FeedbackItemProps {
  number: number;
  title: string;
  tags: Tag[];
  status: 'approved' | 'pending';
  description: string;
  showActions?: boolean;
}

const statusConfig = {
  approved: { label: '승인', cls: 'bg-green-50 text-green-700 border-green-200' },
  pending:  { label: '대기', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function TagBadge({ tag }: { tag: Tag }) {
  if (tag.type === 'ai') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
        ✦ AI 제안
      </span>
    );
  }
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      {tag.label}
    </span>
  );
}

export default function FeedbackItem({ number, title, tags, status, description, showActions }: FeedbackItemProps) {
  const { label, cls } = statusConfig[status];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {number}
          </span>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {tags.map((tag, i) => <TagBadge key={i} tag={tag} />)}
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
          {label}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

      {showActions && (
        <div className="flex gap-2 mt-3">
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors">
            ✓ 수정 승인
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            ↶ 되돌리기
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            ✎ 직접 수정
          </button>
        </div>
      )}
    </div>
  );
}
