'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ReviewQueue from '@/components/senior/ReviewQueue';
import { DotNumber, glowCard, softCard } from '@/components/ui/Soft';
import { useReviews } from '@/lib/review';
import { routes } from '@/lib/roles';
import type { SeniorDashboard } from '@/lib/senior';

const senior = routes('senior');

const noopSubscribe = () => () => {};

// Date du jour côté navigateur uniquement (vide pendant le rendu serveur)
function ConsultationDate() {
  const today = useSyncExternalStore(
    noopSubscribe,
    () =>
      new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    () => '',
  );

  return (
    <p className="min-h-7 rounded-full bg-[#F6F7F9] px-4 py-1.5 text-sm text-[#667085] first-letter:uppercase">
      {today && `Consulté le ${today}`}
    </p>
  );
}

function Kpi({
  label,
  value,
  className,
  glow,
}: {
  label: string;
  value: number;
  className: string;
  glow?: 'glow-green' | 'glow-orange'; // carte à dégradé, chiffre blanc
}) {
  if (glow) {
    return (
      <div
        className={`${glowCard} ${glow} flex min-h-40 flex-col justify-between gap-3`}
      >
        <span className="text-sm text-[#172033]">{label}</span>
        <p className="text-center">
          <DotNumber light className="text-6xl">
            {value}
          </DotNumber>
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${softCard} flex min-h-40 flex-col items-start justify-between gap-3`}
    >
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
      >
        {label}
      </span>
      <p>
        <DotNumber className="text-6xl">{value}</DotNumber>
      </p>
    </div>
  );
}

const SHORTCUTS = [
  {
    href: senior.review,
    title: 'Relecture des recommandations',
    text: "Passer en revue ce que l'IA propose aux juniors.",
  },
  {
    href: senior.clients,
    title: 'Portefeuille clients',
    text: "Consulter la fiche d'un client et ses opportunités.",
  },
  {
    href: senior.practices,
    title: 'Bonnes pratiques',
    text: 'Partager un réflexe utile aux commerciaux juniors.',
  },
];

export default function SeniorDashboardView({
  toReview,
  kpis,
}: SeniorDashboard) {
  const reviews = useReviews();
  const remaining = toReview.filter(
    (item) => item.need === 'a_relire' && !reviews[item.id],
  ).length;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* En-tête principal */}
      <section className="rounded-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:items-center sm:justify-between">
          <div className="pb-2">
            <h1 className="text-3xl font-normal tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
              Bonjour Yvan
            </h1>
          </div>
          <ConsultationDate />
        </div>
      </section>

      {/* Indicateurs synthétiques */}
      <section
        aria-label="Indicateurs"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <Kpi
          label="Clients de l'équipe"
          value={kpis.clients}
          className="bg-slate-100 text-[#667085]"
        />
        <Kpi
          label="Publiées sans relecture"
          value={kpis.autoPublished}
          className="bg-[#EFE9FC] text-[#6542C2]"
        />
        <Kpi
          label="Recommandations à relire"
          value={remaining}
          className="bg-[#F4A340]/10 text-[#F4A340]"
          glow="glow-orange"
        />
        <Kpi
          label="Bonnes pratiques partagées"
          value={kpis.practices}
          className="bg-[#2FA66A]/10 text-[#2FA66A]"
          glow="glow-green"
        />
      </section>

      <ReviewQueue
        items={toReview}
        note="Une recommandation appuyée sur un fait documenté part directement chez le junior. Vous n’arbitrez que les hypothèses et les signaux peu fiables."
      />

      {/* Raccourcis */}
      <section
        aria-label="Raccourcis"
        className="grid gap-3 sm:gap-4 lg:grid-cols-3"
      >
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className={`${softCard} group flex min-w-0 items-center justify-between gap-4 transition-colors duration-300 ease-out hover:bg-white/80`}
          >
            <span className="min-w-0">
              <span className="block text-lg font-normal tracking-tight text-[#172033]">
                {shortcut.title}
              </span>
              <span className="mt-1 block text-sm text-[#667085]">
                {shortcut.text}
              </span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        ))}
      </section>
    </div>
  );
}
