import type { OpportunityStatus, Priority } from '@/lib/crm';

const STATUS: Record<OpportunityStatus, { label: string; className: string }> =
  {
    detectee: { label: 'Détectée', className: 'bg-[#EFE9FC] text-[#6542C2]' },
    a_qualifier: {
      label: 'À qualifier',
      className: 'bg-[#F4A340]/10 text-[#F4A340]',
    },
    confirmee: {
      label: 'Confirmée',
      className: 'bg-[#2FA66A]/10 text-[#2FA66A]',
    },
  };

const PRIORITY: Record<Priority, { label: string; className: string }> = {
  haute: {
    label: 'Priorité haute',
    className: 'bg-[#D94848]/10 text-[#D94848]',
  },
  moyenne: {
    label: 'Priorité moyenne',
    className: 'bg-[#2686C9]/10 text-[#2686C9]',
  },
  basse: { label: 'Priorité basse', className: 'bg-slate-100 text-[#667085]' },
};

const base = 'rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap';

export function StatusBadge({ status }: { status: OpportunityStatus }) {
  const { label, className } = STATUS[status];
  return <span className={`${base} ${className}`}>{label}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = PRIORITY[priority];
  return <span className={`${base} ${className}`}>{label}</span>;
}
