'use client';

import { BadgeCheck, CircleSlash, Sparkles } from 'lucide-react';
import {
  LimeTag,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import { formatDate } from '@/lib/crm';
import { useReviews, VERDICT_LABEL } from '@/lib/review';

// Ce qu'un commercial senior a retenu après relecture de la suggestion de
// l'IA. Tant que la recommandation n'est pas relue, on le dit simplement.
export default function SeniorGuidance({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const reviews = useReviews();
  const review = reviews[opportunityId];

  if (!review) {
    return (
      <section className={softCard}>
        <p className="flex items-start gap-3 text-sm text-[#667085]">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-[#172033]" />
          <span>
            <span className="text-[#172033]">
              Préparation proposée par l&apos;IA.
            </span>{' '}
            Elle n&apos;a pas encore été relue par un senior : vérifiez les
            questions avant votre rendez-vous.
          </span>
        </p>
      </section>
    );
  }

  const discarded = review.verdict === 'ecartee';

  return (
    <section className={softCard}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex shrink-0 flex-col gap-2 lg:w-56">
          <h2 className={sectionTitle}>Relu par un senior</h2>
          <span className="flex items-center gap-1.5 text-sm text-[#667085]">
            {discarded ? (
              <CircleSlash size={16} className="shrink-0 text-[#D94848]" />
            ) : (
              <BadgeCheck size={16} className="shrink-0 text-[#2FA66A]" />
            )}
            {VERDICT_LABEL[review.verdict]}
          </span>
          <SoftTag>Le {formatDate(review.reviewed_at)}</SoftTag>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {discarded ? (
            <div className={`${softTile} p-5`}>
              <p className="text-base text-[#172033] sm:text-lg">
                Cette piste a été écartée.
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                <LimeTag>Motif</LimeTag>
                {review.reason === ''
                  ? 'Rapprochez-vous de votre senior avant de préparer ce rendez-vous.'
                  : review.reason}
              </p>
            </div>
          ) : (
            <div className={`${softTile} p-5`}>
              <p className="text-base text-[#172033] sm:text-lg">
                {review.recommendation}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                <LimeTag>À faire</LimeTag>
                Consigne retenue par votre senior.
              </p>
            </div>
          )}

          {review.coaching !== '' && (
            <div className={`${softTile} p-5`}>
              <p className="text-base text-[#172033] sm:text-lg">
                {review.coaching}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                <LimeTag>Conseil d&apos;un senior</LimeTag>
                Ce qu&apos;aucune donnée ne contient.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
