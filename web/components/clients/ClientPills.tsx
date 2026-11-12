import type { ClientStats } from '@/lib/stats';

function Pill({
  count,
  label,
  title,
  className,
}: {
  count: number;
  label: string;
  title: string;
  className: string;
}) {
  return (
    <li
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <span className="text-sm font-semibold">{count}</span>
      {label}
    </li>
  );
}

// Pastilles : violette = détectées, orange = à qualifier, bleue = projets actifs
export default function ClientPills({
  stats,
  className = '',
}: {
  stats: ClientStats;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      <Pill
        count={stats.opportunitiesDetected}
        label={stats.opportunitiesDetected > 1 ? 'détectées' : 'détectée'}
        title="Opportunités détectées"
        className="bg-[#EFE9FC] text-[#6542C2] group-hover:bg-white"
      />
      <Pill
        count={stats.opportunitiesToQualify}
        label="à qualifier"
        title="Opportunités à qualifier"
        className="bg-[#F4A340]/10 text-[#F4A340]"
      />
      <Pill
        count={stats.projects}
        label={stats.projects > 1 ? 'projets actifs' : 'projet actif'}
        title="Projets actifs"
        className="bg-[#2686C9]/10 text-[#2686C9]"
      />
    </ul>
  );
}