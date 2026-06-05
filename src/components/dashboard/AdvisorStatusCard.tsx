type BadgeVariant = 'amber' | 'green' | 'slate';

interface Props {
  label: string;
  value: number | string;
  unit?: string;
  badge?: { text: string; variant: BadgeVariant };
  sub?: string;
  hint?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  amber: 'bg-amber-50 text-amber-500',
  green: 'bg-emerald-50 text-emerald-500',
  slate: 'bg-slate-100 text-slate-500',
};

export default function AdvisorStatusCard({ label, value, unit, badge, sub, hint }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-lg font-normal text-gray-500 ml-0.5">{unit}</span>}
        </p>
        {badge && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyles[badge.variant]}`}>
            {badge.text}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
