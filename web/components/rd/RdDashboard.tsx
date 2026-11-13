'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BriefCard } from '@/components/rd/BriefsList';
import {
  DotNumber,
  ghostButton,
  glowCard,
  LimeTag,
  pageTitle,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
  Stat,
} from '@/components/ui/Soft';
import type { BriefRow, BriefStats } from '@/lib/briefs';
import { useValidatedReports } from '@/lib/reports-store';
import { routes } from '@/lib/roles';

const rd = routes('rd');
const LATEST = 4;

export default function RdDashboard({
  briefs,
  stats,
}: {
  briefs: BriefRow[];
  stats: BriefStats;
}) {
  const reports = useValidatedReports();
  const newCount = briefs.filter(
    (brief) => reports[brief.opportunity.id] !== undefined,
  ).length;
  const last = briefs[0] ?? null;

  // Répartition des briefs par équipe concernée
  const byTeam = new Map<string, number>();
  for (const brief of briefs) {
    for (const team of brief.teams) {
      byTeam.set(team, (byTeam.get(team) ?? 0) + 1);
    }
  }
  const teams = [...byTeam.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Titre et indicateurs */}
      <section className="flex flex-col gap-5">
        <div>
          <h1 className={pageTitle}>Briefs clients</h1>
          <p className="mt-2 text-sm text-[#667085] sm:text-base">
            Ce que les commerciaux ont recueilli en rendez-vous, structuré pour
            les équipes de développement.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <Stat value={stats.briefs} label="Briefs reçus" highlight />
          <Stat value={stats.clients} label="Clients" />
          <Stat value={stats.actions} label="Actions à traiter" />
          <Stat value={stats.teams} label="Équipes mobilisées" />
        </div>
      </section>

      {/* B. Dernier brief et briefs validés pendant la démonstration */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {last && (
          <section
            className={`${glowCard} glow-orange flex min-h-64 flex-col justify-between gap-6`}
          >
            <p className="text-sm text-[#172033]">Dernier brief reçu</p>
            <div className="flex flex-col items-center gap-2 text-center">
              <DotNumber light className="text-7xl">
                {last.day}
              </DotNumber>
              <p className="text-sm">
                {last.month} • {last.client.name}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-[#172033]">{last.opportunity.title}</p>
              <Link href={rd.brief(last.id)} className={ghostButton}>
                Ouvrir
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        <section
          className={`${glowCard} glow-green flex min-h-64 flex-col justify-between gap-6`}
        >
          <p className="text-sm text-[#172033]">Validés par le commercial</p>
          <div className="flex flex-col items-center gap-2 text-center">
            <DotNumber light className="text-7xl">
              {newCount}
            </DotNumber>
            <p className="text-sm">
              {newCount === 0
                ? 'Aucun compte rendu validé pour le moment'
                : `sur ${briefs.length} briefs`}
            </p>
          </div>
          <p className="text-sm text-[#172033]">
            Un compte rendu validé après un rendez-vous arrive ici
            automatiquement.
          </p>
        </section>
      </div>

      {/* C. Équipes concernées */}
      {teams.length > 0 && (
        <section className={softCard}>
          <h2 className={`${sectionTitle} mb-4 sm:mb-5`}>Équipes concernées</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {teams.map(([team, count]) => (
              <li
                key={team}
                className={`${softTile} flex items-center justify-between gap-3 p-4`}
              >
                <span className="min-w-0 text-sm text-[#172033]">{team}</span>
                <SoftTag>
                  {count} brief{count > 1 ? 's' : ''}
                </SoftTag>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* D. Derniers briefs */}
      <section className={softCard}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <div className="flex items-center gap-3">
            <h2 className={sectionTitle}>Derniers briefs</h2>
            <LimeTag>{Math.min(LATEST, briefs.length)}</LimeTag>
          </div>
          <Link href={rd.briefs} className={ghostButton}>
            Tout voir
            <ArrowRight size={16} />
          </Link>
        </div>
        {briefs.length > 0 ? (
          <ul className="grid gap-3 xl:grid-cols-2">
            {briefs.slice(0, LATEST).map((brief) => (
              <li key={brief.id} className="min-w-0">
                <BriefCard
                  brief={brief}
                  isNew={reports[brief.opportunity.id] !== undefined}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#667085]">Aucun brief reçu.</p>
        )}
      </section>

      <p className="text-xs text-[#667085]">
        Prototype : briefs fictifs, repris du jeu de données de démonstration.
      </p>
    </div>
  );
}
