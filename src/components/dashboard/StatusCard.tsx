import Skeleton from '@/components/common/Skeleton';

interface Props {
  label: string;
  count: number;
  description: string;
  tag?: string;
  accentColor: string;
  isLoading?: boolean;
}

export default function StatusCard({ label, count, description, tag, accentColor, isLoading }: Props) {
  return (
    <div className={`bg-white rounded-xl border-t-4 border border-gray-100 p-5 flex flex-col gap-1 shadow-sm ${accentColor}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isLoading ? (
        <Skeleton className="h-8 w-16 mt-0.5" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">
          {count} <span className="text-lg font-normal text-gray-500">건</span>
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1">{description}</p>
      {tag && (
        <span className="mt-1 self-start inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
          {tag}
        </span>
      )}
    </div>
  );
}
