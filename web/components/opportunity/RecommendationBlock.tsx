'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarCheck, Pencil } from 'lucide-react';
import {
  ghostButton,
  LimeTag,
  primaryButton,
  softTile,
} from '@/components/ui/Soft';
import { formatDate } from '@/lib/crm';
import { useReviews, VERDICT_LABEL } from '@/lib/review';
import { routes, type Role } from '@/lib/roles';

// Recommandation de l'IA, remplacée par celle du senior après relecture.
// Le senior accède d'ici à son espace de relecture.
export default function RecommendationBlock({
  opportunityId,
  recommendation,
  role,
}: {
  opportunityId: string;
  recommendation: string;
  role: Role;
}) {
  const reviews = useReviews();
  const review = reviews[opportunityId];
  const r = routes(role);
  const discarded = review?.verdict === 'ecartee';

  return (
    <>
      {review && (
        <p className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
          <LimeTag>
            <span className="inline-flex items-center gap-1">
              <BadgeCheck size={12} />
              {VERDICT_LABEL[review.verdict]}
            </span>
          </LimeTag>
          le {formatDate(review.reviewed_at)}
        </p>
      )}

      <p className="text-sm text-[#667085] sm:text-base">
        {discarded
          ? review.reason || 'Piste écartée par un senior.'
          : (review?.recommendation ?? recommendation)}
      </p>

      {review && !discarded && review.recommendation !== recommendation && (
        <details className="mt-3 text-sm text-[#667085]">
          <summary className="cursor-pointer text-[#172033]">
            Voir la version initiale de l&apos;IA
          </summary>
          <p className={`${softTile} mt-2 p-4`}>{recommendation}</p>
        </details>
      )}

      {!discarded && (
        <Link
          href={r.prepare(opportunityId)}
          className={`${primaryButton} mt-5 w-full`}
        >
          <CalendarCheck size={16} />
          Préparer mon rendez-vous
          <ArrowRight size={16} />
        </Link>
      )}

      {role === 'senior' && (
        <Link
          href={r.reviewItem(opportunityId)}
          className={`${ghostButton} mt-3 w-full`}
        >
          <Pencil size={16} />
          {review ? 'Revoir ma relecture' : 'Relire et corriger'}
        </Link>
      )}
    </>
  );
}
