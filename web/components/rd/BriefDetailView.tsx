'use client';

import { BadgeCheck, MessageSquareQuote } from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import {
  glowCardInk,
  LimeTag,
  pageTitle,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { BriefRow } from '@/lib/briefs';
import { useValidatedReports } from '@/lib/reports-store';

// Détail d'un brief : ce que le commercial a recueilli, et le compte rendu
// qu'il a validé lorsqu'il l'a produit pendant la démonstration.
export default function BriefDetailView({ brief }: { brief: BriefRow }) {
  const reports = useValidatedReports();
  const report = reports[brief.opportunity.id];
  const answered = brief.exchanges.filter((item) => item.answer.trim() !== '');

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. En-tête */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <LimeTag>Brief client</LimeTag>
          <SoftTag>Rendez-vous du {brief.date}</SoftTag>
          {report && <LimeTag>Compte rendu validé</LimeTag>}
        </div>
        <h1 className={pageTitle}>{brief.opportunity.title}</h1>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#667085] sm:text-base">
          <span className="text-[#172033]">{brief.client.name}</span>•
          {brief.client.sector} • {brief.client.country}
          <StatusBadge status={brief.opportunity.status} />
        </p>
      </section>

      {/* B. Objectif du rendez-vous */}
      <section className={`${glowCardInk} glow-pink`}>
        <p className="text-sm">Objectif du rendez-vous</p>
        <p className="mt-6 max-w-3xl text-xl font-normal tracking-tight sm:text-2xl">
          {brief.objective}
        </p>
      </section>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-4 sm:gap-5 xl:col-span-2">
          {/* C. Compte rendu validé, sinon résumé du jeu de données */}
          {report ? (
            <section className={softCard}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
                <h2 className={sectionTitle}>Compte rendu du commercial</h2>
                <span className="flex items-center gap-1.5 text-sm text-[#667085]">
                  <BadgeCheck size={16} className="shrink-0 text-[#172033]" />
                  Validé le {report.validated_at}
                </span>
              </div>
              <ol className="flex flex-col gap-3">
                {report.sections.map((section, index) => (
                  <li key={section.id} className={`${softTile} p-5`}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm text-[#667085] tabular-nums">
                        {index + 1}.
                      </span>
                      <h3 className="text-lg font-normal tracking-tight text-[#172033]">
                        {section.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-line text-[#172033]">
                      {section.text.trim() === ''
                        ? 'Non renseigné.'
                        : section.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <section className={softCard}>
              <h2 className={`${sectionTitle} mb-4 sm:mb-5`}>
                Ce que le commercial a retenu
              </h2>
              <div className={`${softTile} p-5`}>
                <p className="text-base text-[#172033]">
                  {brief.summary || 'Aucun résumé enregistré.'}
                </p>
              </div>
              {brief.notes && (
                <div className={`${softTile} mt-3 p-5`}>
                  <p className="text-xs text-[#667085]">Notes du rendez-vous</p>
                  <p className="mt-1 text-sm text-[#172033]">{brief.notes}</p>
                </div>
              )}
            </section>
          )}

          {/* D. Échanges avec le client */}
          {answered.length > 0 && (
            <section className={softCard}>
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <h2 className={sectionTitle}>Ce que le client a répondu</h2>
                <LimeTag>{answered.length}</LimeTag>
              </div>
              <ul className="flex flex-col gap-3">
                {answered.map((item, index) => (
                  <li
                    key={`${index}-${item.question}`}
                    className={`${softTile} p-5`}
                  >
                    <p className="flex items-start gap-2 text-sm text-[#667085]">
                      <MessageSquareQuote
                        size={16}
                        className="mt-0.5 shrink-0 text-[#172033]"
                      />
                      {item.question}
                    </p>
                    <p className="mt-2 text-base text-[#172033]">
                      {item.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* E. Équipes concernées */}
          <section className={softCard}>
            <h2 className={`${sectionTitle} mb-4`}>Équipes concernées</h2>
            <ul className="flex flex-col gap-2">
              {brief.teams.map((team) => (
                <li
                  key={team}
                  className={`${softTile} p-4 text-sm text-[#172033]`}
                >
                  {team}
                </li>
              ))}
            </ul>
          </section>

          {/* F. Prochaines actions */}
          <section className={softCard}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className={sectionTitle}>Actions</h2>
              <LimeTag>{brief.nextActions.length}</LimeTag>
            </div>
            {brief.nextActions.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {brief.nextActions.map((action) => (
                  <li
                    key={action}
                    className={`${softTile} p-4 text-sm text-[#172033]`}
                  >
                    {action}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#667085]">Aucune action indiquée.</p>
            )}
          </section>

          {/* G. Sujet */}
          <section className={softCard}>
            <h2 className={`${sectionTitle} mb-4`}>Sujet</h2>
            <div className={`${softTile} p-4`}>
              <p className="text-xs text-[#667085]">
                {brief.opportunity.category}
              </p>
              <p className="mt-1 text-sm text-[#172033]">
                {brief.opportunity.description}
              </p>
            </div>
          </section>
        </div>
      </div>

      <p className="text-xs text-[#667085]">
        Prototype : brief fictif. Les informations non confirmées par le client
        restent à vérifier avant tout développement.
      </p>
    </div>
  );
}
