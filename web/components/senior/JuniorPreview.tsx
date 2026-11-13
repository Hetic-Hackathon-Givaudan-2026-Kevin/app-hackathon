'use client';

import { BadgeCheck, Eye, MessageSquareQuote, Sparkles } from 'lucide-react';
import { softCard } from '@/components/ui/Soft';
import {
  VERDICT_CLASS,
  VERDICT_LABEL,
  type QuestionDraft,
  type Verdict,
} from '@/lib/review';

// Aperçu, mis à jour en direct, de ce que le commercial junior verra dans
// « Préparer mon rendez-vous » une fois la relecture enregistrée.
export default function JuniorPreview({
  verdict,
  recommendation,
  reason,
  questions,
  coaching,
  objective,
}: {
  verdict: Verdict;
  recommendation: string;
  reason: string;
  questions: QuestionDraft[];
  coaching: string;
  objective: string;
}) {
  const kept = questions.filter((question) => question.kept);

  return (
    <section
      aria-labelledby="junior-preview-title"
      className={`${softCard} min-w-0`}
    >
      <h2
        id="junior-preview-title"
        className="flex items-center gap-2 text-xl font-normal tracking-tight text-[#172033]"
      >
        <Eye size={20} className="shrink-0 text-[#6542C2]" />
        Ce que verra le junior
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
        Votre relecture remplace les suggestions de l&apos;IA dans sa
        préparation de rendez-vous.
      </p>

      <div className="mt-4 space-y-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${VERDICT_CLASS[verdict]}`}
        >
          <BadgeCheck size={14} />
          {VERDICT_LABEL[verdict]}
        </span>

        {verdict === 'ecartee' ? (
          <div className="rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
            <p className="text-sm font-medium text-[#172033]">
              Cette piste n&apos;est pas à travailler pour le moment.
            </p>
            <p className="mt-1 text-sm text-[#667085]">
              {reason.trim() === ''
                ? 'Motif à préciser par le senior.'
                : reason}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
              <p className="text-xs font-medium text-[#667085]">
                Objectif du rendez-vous
              </p>
              <p className="mt-1 text-sm text-[#172033]">
                {objective === '' ? recommendation : objective}
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#667085]">
                <MessageSquareQuote size={14} className="text-[#6542C2]" />
                Questions à poser ({kept.length})
              </p>
              {kept.length > 0 ? (
                <ol className="mt-2 space-y-2">
                  {kept.map((question, index) => (
                    <li key={question.id} className="text-sm text-[#172033]">
                      <span className="font-medium text-[#6542C2]">
                        {index + 1}.
                      </span>{' '}
                      {question.question.trim() === ''
                        ? 'Question à compléter'
                        : question.question}
                      <span className="mt-0.5 block text-xs text-[#667085]">
                        Information recherchée : {question.info_sought}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm text-[#D94848]">
                  Aucune question retenue : le junior arrivera sans trame.
                </p>
              )}
            </div>
          </>
        )}

        {coaching.trim() !== '' && (
          <div className="rounded-[22px] bg-[#EFE9FC] p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[#6542C2]">
              <Sparkles size={14} />
              Conseil d&apos;un senior
            </p>
            <p className="mt-1 text-sm text-[#172033]">{coaching}</p>
          </div>
        )}
      </div>
    </section>
  );
}
