import type { ContentStatus } from '@/types/dashboard';

const config: Record<ContentStatus, { label: string; className: string }> = {
  pending: {
    label: '대기',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  approved: {
    label: '승인',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  rejected: {
    label: '반려',
    className: 'bg-red-50 text-red-500 border border-red-200',
  },
};

interface Props {
  status: ContentStatus;
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
