import Skeleton from '@/components/common/Skeleton';

export default function ContentTableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-10 px-4 py-3" />
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
              담당 자문가
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
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-4">
                <Skeleton className="w-3.5 h-3.5" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-16" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-3/4" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-12" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-14" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-14" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-3 w-20" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-5 w-14 rounded-full" />
              </td>
              <td className="pl-1 pr-4 py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
