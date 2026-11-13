'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, FileText } from 'lucide-react';
import {
  DotNumber,
  glowCard,
  LimeTag,
  pageTitle,
  primaryButton,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { CopilotContext } from '@/lib/copilot';
import {
  saveDebriefDraft,
  useDebriefDraft,
  type DebriefDraft,
} from '@/lib/debrief-draft';
import { CHECKLIST, type ChecklistItem } from '@/lib/report';
import { useRoutes } from '@/lib/use-role';

const fieldClass =
  'w-full resize-y rounded-[22px] bg-white/90 p-4 text-sm text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] outline-none transition-shadow placeholder:text-slate-400 focus:shadow-[0_0_0_2px_#172033]';

type DebriefProps = Pick<
  CopilotContext,
  'client' | 'opportunity' | 'questions'
>;

// Écran « après le rendez-vous » : checklist des informations et notes.
export default function MeetingDebrief(props: DebriefProps) {
  const draft = useDebriefDraft(props.opportunity.id);

  // Saisie précédente pas encore relue : on garde la place, sans formulaire
  if (draft === undefined) {
    return (
      <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
        <div className="h-40 rounded-[28px] bg-white/60" />
        <div className="h-80 rounded-[28px] bg-white/60" />
      </div>
    );
  }

  return <DebriefForm {...props} initial={draft} />;
}

function DebriefForm({
  client,
  opportunity,
  questions,
  initial,
}: DebriefProps & { initial: DebriefDraft | null }) {
  const router = useRouter();
  const routes = useRoutes();
  const [answers, setAnswers] = useState<string[]>(() =>
    questions.map((_, index) => initial?.answers[index] ?? ''),
  );
  const [checked, setChecked] = useState<ChecklistItem[]>(
    initial?.checked ?? [],
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function toggle(item: ChecklistItem) {
    setChecked((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  function generate() {
    saveDebriefDraft(opportunity.id, { answers, checked, notes });
    router.push(routes.report(opportunity.id));
  }

  const missingCount = CHECKLIST.length - checked.length;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Contexte */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <LimeTag>À remplir juste après le rendez-vous</LimeTag>
          <SoftTag>Meeting Copilot • Après le rendez-vous</SoftTag>
        </div>
        <h1 className={pageTitle}>
          Qu&apos;avez-vous appris chez {client.name} ?
        </h1>
        <p className="text-sm text-[#667085] sm:text-base">
          {opportunity.title}. Cochez les informations obtenues : ce qui reste
          décoché sera listé comme encore manquant.
        </p>
      </section>

      <div className="grid items-start gap-4 sm:gap-5 xl:grid-cols-3">
        {/* B. Avancement */}
        <section
          className={`${glowCard} glow-green flex min-h-64 flex-col justify-between gap-6 xl:min-h-[26rem]`}
        >
          <p className="text-sm text-[#172033]">Informations collectées</p>
          <div className="flex flex-col items-center gap-2 text-center">
            <DotNumber light className="text-8xl">
              {checked.length}
            </DotNumber>
            <p aria-live="polite" className="text-sm">
              sur {CHECKLIST.length}
            </p>
          </div>
          <p className="text-center text-sm">
            {missingCount === 0
              ? 'Tout est collecté.'
              : `${missingCount} encore à confirmer`}
          </p>
        </section>

        {/* C. Checklist des informations */}
        <section className={softCard}>
          <h2 className={`${sectionTitle} mb-4`}>Checklist</h2>
          <ul className="flex flex-col gap-2">
            {CHECKLIST.map((item) => {
              const isChecked = checked.includes(item);
              return (
                <li key={item}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-full bg-white/90 px-4 py-3 text-sm text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] transition-colors duration-300 hover:bg-white">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#172033] ${
                        isChecked
                          ? 'bg-[#E6F03C] text-[#172033]'
                          : 'bg-[#E9EBEF]'
                      }`}
                    >
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{item}</span>
                    {isChecked && <LimeTag>Obtenu</LimeTag>}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        {/* D. Notes et génération du compte rendu */}
        <section className={softCard}>
          <h2 className={`${sectionTitle} mb-4`}>Notes du rendez-vous</h2>
          <textarea
            rows={9}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notez ici ce que vous avez retenu, en style libre..."
            aria-label="Notes du rendez-vous"
            className={fieldClass}
          />
          <p className="mt-2 text-xs text-[#667085]">
            Aucun enregistrement audio : seules vos notes sont utilisées.
          </p>
          <button
            type="button"
            onClick={generate}
            className={`${primaryButton} mt-5 w-full`}
          >
            <FileText size={16} />
            Générer le compte rendu
          </button>
        </section>
      </div>

      {/* E. Réponses aux questions préparées (facultatif) */}
      <section className={softCard}>
        <div className="mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h2 className={sectionTitle}>Réponses aux questions préparées</h2>
          <p className="text-sm text-[#667085]">
            Facultatif. Reprises dans le compte rendu.
          </p>
        </div>
        <ol className="grid gap-3 lg:grid-cols-3">
          {questions.map((item, index) => (
            <li
              key={item.question}
              className={`${softTile} flex flex-col gap-3 p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <DotNumber className="text-4xl">{index + 1}</DotNumber>
                <SoftTag>{item.info_sought}</SoftTag>
              </div>
              <p className="text-sm text-[#172033]">« {item.question} »</p>
              <label className="mt-auto block">
                <span className="sr-only">
                  Réponse obtenue à la question {index + 1}
                </span>
                <textarea
                  rows={3}
                  value={answers[index]}
                  onChange={(event) =>
                    setAnswers((current) =>
                      current.map((value, position) =>
                        position === index ? event.target.value : value,
                      ),
                    )
                  }
                  placeholder="Réponse obtenue"
                  className="w-full resize-y rounded-[18px] bg-[#F3F4F6] p-4 text-sm text-[#172033] outline-none transition-shadow placeholder:text-slate-400 focus:shadow-[0_0_0_2px_#172033]"
                />
              </label>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
