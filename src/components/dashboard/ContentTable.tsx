import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ContentItem, UserRole } from "@/types/dashboard";
import StatusBadge from "./StatusBadge";

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

  const advisorColumnLabel = "담당 자문가";

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
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">
              관리번호
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B]">
              제목
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-32">
              유형
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">
              제작자
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">
              {advisorColumnLabel}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-28">
              제출일
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#1B3A6B] w-24">
              상태
            </th>
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
              <td className="px-4 py-4 font-mono text-gray-400 text-xs">
                {item.id}
              </td>
              <td className="px-4 py-4 font-medium text-gray-800">
                <button
                  onClick={() => navigate(`/content/${item.id}`)}
                  className="hover:text-[#1B3A6B] hover:underline text-left"
                >
                  {item.title}
                </button>
              </td>
              <td className="px-4 py-4 text-gray-500">{item.typeLabel}</td>
              <td className="px-4 py-4 text-gray-600">{item.creator}</td>
              <td className="px-4 py-4 text-gray-600">
                {item.advisor ?? (
                  <span className="text-gray-400 text-xs">배정 대기</span>
                )}
              </td>
              <td className="px-4 py-4 text-gray-500 tabular-nums whitespace-nowrap">
                {item.submittedAt}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="pl-1 pr-4 py-4">
                {role === "creator" && item.status === "rejected" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full whitespace-nowrap">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    재제출 필요
                  </span>
                )}
                {role === "advisor" &&
                  (item.status === "pending" ? (
                    <button
                      onClick={() => navigate(`/review/${item.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#152d55] transition-colors whitespace-nowrap"
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      검토
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 whitespace-nowrap pl-2.5">
                      검토 완료
                    </span>
                  ))}
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="py-16 text-center text-sm text-gray-400"
              >
                해당하는 콘텐츠가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
