import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContentItem, UserRole } from '@/types/dashboard';
import StatusBadge from './StatusBadge';

interface Props {
  items: ContentItem[];
  role: UserRole;
}

export default function ContentTable({ items, role }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(items.map((i) => i.id)) : new Set());
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const advisorColumnLabel = role === 'advisor' ? '제출자' : '담당 자문가';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded accent-[#1B3A6B]"
                checked={selected.size === items.length && items.length > 0}
                onChange={(e) => toggleAll(e.target.checked)}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">관리번호</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B]">제목</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-32">유형</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">{advisorColumnLabel}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">제출일</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-24">상태</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-[#1B3A6B]"
                  checked={selected.has(item.id)}
                  onChange={() => toggleOne(item.id)}
                />
              </td>
              <td className="px-4 py-4 font-mono text-gray-400 text-xs">{item.managementNumber}</td>
              <td className="px-4 py-4 font-medium text-gray-800">{item.title}</td>
              <td className="px-4 py-4 text-gray-500">{item.typeLabel}</td>
              <td className="px-4 py-4 text-gray-600">
                {role === 'advisor' ? item.creator : (
                  item.advisor ? (
                    item.advisor
                  ) : (
                    <span className="text-gray-400 text-xs">배정 대기</span>
                  )
                )}
              </td>
              <td className="px-4 py-4 text-gray-500 tabular-nums whitespace-nowrap">{item.submittedAt}</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/content/${item.id}`, { state: { item } })}
                    className="text-xs text-[#1B3A6B] font-medium hover:underline whitespace-nowrap"
                  >
                    상세 ›
                  </button>
                  {role === 'advisor' && (
                    <button
                      onClick={() => navigate(`/review/${item.id}`)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap"
                    >
                      검토
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={8} className="py-16 text-center text-sm text-gray-400">
                해당하는 콘텐츠가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
