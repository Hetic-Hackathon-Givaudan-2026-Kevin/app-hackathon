'use client';

import {
  DotNumber,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { CopilotContext } from '@/lib/copilot';
import { useReviews } from '@/lib/review';

// Les questions retenues par un senior remplacent celles de l'IA.
// Sans relecture, la liste reste celle proposée par l'IA.
export default function CopilotQuestions({
  opportunityId,
  questions: suggested,
}: {
  opportunityId: string;
  questions: CopilotContext['questions'];
}) {
  const reviews = useReviews();
  const review = reviews[opportunityId];
  const reviewed = review !== undefined && review.verdict !== 'ecartee';

  const questions = reviewed
    ? review.questions.filter((question) => question.kept)
    : suggested;

  return (
    <section className={softCard}>
      <div className="mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <h2 className={sectionTitle}>{questions.length} questions à poser</h2>
        <p className="text-sm text-[#667085]">
          {reviewed
            ? 'Retenues et classées par un senior.'
            : 'À répartir dans l’échange, pas à réciter.'}
        </p>
      </div>

      {questions.length > 0 ? (
        <ol className="grid gap-3 lg:grid-cols-3">
          {questions.map((item, index) => (
            <li
              key={`${index}-${item.question}`}
              className={`${softTile} flex flex-col gap-3 p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <DotNumber className="text-4xl">{index + 1}</DotNumber>
                <SoftTag>{item.info_sought}</SoftTag>
              </div>
              <p className="text-base text-[#172033]">« {item.question} »</p>
              {item.why !== '' && (
                <p className="mt-auto rounded-[18px] bg-[#F3F4F6] p-3 text-sm text-[#667085]">
                  <span className="text-[#172033]">Pourquoi ?</span> {item.why}
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className={`${softTile} p-5 text-sm text-[#667085]`}>
          Aucune question retenue pour ce rendez-vous.
        </p>
      )}
    </section>
  );
}
