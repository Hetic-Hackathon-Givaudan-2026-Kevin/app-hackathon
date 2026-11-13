'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Download } from 'lucide-react';
import {
  doneButton,
  DotNumber,
  ghostButton,
  glowCard,
  glowCardInk,
  LimeTag,
  pageTitle,
  primaryButton,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { CopilotContext } from '@/lib/copilot';
import { useDebriefDraft, type DebriefDraft } from '@/lib/debrief-draft';
import { saveValidatedReport } from '@/lib/reports-store';
import { downloadReportPdf } from '@/lib/pdf';
import type { Practice } from '@/lib/practices';
import { buildReport, CHECKLIST, type ReportSection } from '@/lib/report';
import { useRoutes } from '@/lib/use-role';

type ReportProps = Pick<
  CopilotContext,
  'client' | 'opportunity' | 'objective' | 'questions'
> & { practice: Practice | null };

// Écran du compte rendu : brouillon en 7 parties, modifiable puis validé.
export default function MeetingReport(props: ReportProps) {
  const routes = useRoutes();
  const draft = useDebriefDraft(props.opportunity.id);

  if (draft === undefined) {
    return (
      <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
        <div className="h-40 rounded-[28px] bg-white/60" />
        <div className="h-96 rounded-[28px] bg-white/60" />
      </div>
    );
  }

  // Arrivée directe sur la page, sans être passé par l'écran de notes
  if (draft === null) {
    return (
      <section className={softCard}>
        <h1 className={pageTitle}>Aucun compte rendu à afficher</h1>
        <p className="mt-2 text-sm text-[#667085] sm:text-base">
          Le compte rendu est généré à partir de la checklist et de vos notes.
          Commencez par les renseigner.
        </p>
        <Link
          href={routes.debrief(props.opportunity.id)}
          className={`${primaryButton} mt-5 w-fit`}
        >
          Renseigner mes notes
        </Link>
      </section>
    );
  }

  return <ReportEditor {...props} draft={draft} />;
}

function ReportEditor({
  client,
  opportunity,
  objective,
  questions,
  practice,
  draft,
}: ReportProps & { draft: DebriefDraft }) {
  const [sections, setSections] = useState<ReportSection[]>(() =>
    buildReport({
      clientName: client.name,
      clientSector: client.sector,
      opportunity,
      objective,
      questions,
      answers: draft.answers,
      checked: draft.checked,
      notes: draft.notes,
    }),
  );
  const [isValidated, setIsValidated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  function updateSection(id: string, text: string) {
    setIsValidated(false);
    setSections((current) =>
      current.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  }

  async function handleDownload() {
    setIsExporting(true);
    setExportError(false);
    try {
      await downloadReportPdf({
        clientName: client.name,
        opportunityTitle: opportunity.title,
        objective,
        sections,
      });
    } catch {
      setExportError(true);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. En-tête et action principale */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <LimeTag>{isValidated ? 'Validé' : 'Brouillon'}</LimeTag>
            <SoftTag>Généré à partir de vos notes</SoftTag>
          </div>
          <h1 className={pageTitle}>Compte rendu • {client.name}</h1>
          <p className="text-sm text-[#667085] sm:text-base">
            {opportunity.title}. Relisez et corrigez chaque partie avant de
            valider.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className={ghostButton}
          >
            <Download size={16} />
            {isExporting ? 'Génération...' : 'PDF'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsValidated(true);
              // Le brief part vers l'espace Recherche & Développement
              saveValidatedReport({
                opportunity_id: opportunity.id,
                client_name: client.name,
                opportunity_title: opportunity.title,
                sections,
              });
            }}
            disabled={isValidated}
            className={isValidated ? doneButton : primaryButton}
          >
            {isValidated && <Check size={16} />}
            {isValidated ? 'Validé' : 'Valider'}
          </button>
        </div>
      </section>

      <div aria-live="polite" className="empty:hidden">
        {isValidated && (
          <p
            className={`${softTile} flex items-start gap-3 p-4 text-sm text-[#172033]`}
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E6F03C]">
              <Check size={13} strokeWidth={3} />
            </span>
            <span>
              Compte rendu validé. Dans la version cible, il serait enregistré
              dans l&apos;outil de suivi commercial et transmis aux équipes
              concernées, sans double saisie. Simulation : rien n&apos;est
              envoyé dans ce prototype.
            </span>
          </p>
        )}
        {exportError && (
          <p className="mt-3 text-sm text-[#D94848]">
            Le PDF n&apos;a pas pu être généré. Réessayez.
          </p>
        )}
      </div>

      {/* B. Repères : informations collectées et bonne pratique */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <section
          className={`${glowCard} glow-green flex min-h-52 flex-col justify-between gap-4`}
        >
          <p className="text-sm text-[#172033]">Informations collectées</p>
          <div className="flex flex-col items-center gap-2 text-center">
            <DotNumber light className="text-7xl">
              {draft.checked.length}
            </DotNumber>
            <p className="text-sm">sur {CHECKLIST.length}</p>
          </div>
        </section>
        <section
          className={`${glowCard} glow-orange flex min-h-52 flex-col justify-between gap-4`}
        >
          <p className="text-sm text-[#172033]">Encore à confirmer</p>
          <div className="flex flex-col items-center gap-2 text-center">
            <DotNumber light className="text-7xl">
              {CHECKLIST.length - draft.checked.length}
            </DotNumber>
            <p className="text-sm text-[#172033]">
              information{CHECKLIST.length - draft.checked.length > 1 && 's'}
            </p>
          </div>
        </section>
        {practice && (
          <section
            className={`${glowCardInk} glow-pink flex min-h-52 flex-col justify-between gap-4`}
          >
            <p className="text-sm">Bonne pratique</p>
            <p className="text-base">{practice.advice}</p>
          </section>
        )}
      </div>

      {/* C. Les 7 parties modifiables */}
      <section aria-label="Compte rendu" className={softCard}>
        <div className="grid gap-3 lg:grid-cols-2">
          {sections.map((section, index) => (
            <label
              key={section.id}
              className={`${softTile} block p-5 ${
                section.id === 'resume' ? 'lg:col-span-2' : ''
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-3">
                  <DotNumber className="text-3xl">{index + 1}</DotNumber>
                  <span className="text-base text-[#172033]">
                    {section.title}
                  </span>
                </span>
                <SoftTag>modifiable</SoftTag>
              </span>
              <textarea
                value={section.text}
                rows={Math.max(
                  3,
                  section.text.split('\n').length +
                    Math.floor(section.text.length / 90),
                )}
                onChange={(event) =>
                  updateSection(section.id, event.target.value)
                }
                className="mt-3 w-full resize-y rounded-[18px] bg-[#F3F4F6] p-4 text-sm text-[#172033] outline-none transition-shadow focus:shadow-[0_0_0_2px_#172033]"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
