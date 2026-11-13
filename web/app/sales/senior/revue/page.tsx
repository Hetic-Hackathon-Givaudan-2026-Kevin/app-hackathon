import ReviewQueue from '@/components/senior/ReviewQueue';
import { getSeniorDashboard } from '@/lib/senior';

export default function ReviewListPage() {
  const { toReview } = getSeniorDashboard();

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <section className="rounded-3xl">
        <h1 className="text-3xl font-normal tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
          Relecture des recommandations
        </h1>
        <p className="mt-1 text-sm text-[#667085] sm:text-base">
          Vous n&apos;arbitrez que ce qui le mérite : une recommandation appuyée
          sur un fait documenté part directement chez le junior, une hypothèse
          passe par vous.
        </p>
      </section>

      <ReviewQueue
        items={toReview}
        title="File de relecture"
        showFilter
        note="Les plus prioritaires d'abord. Chaque relecture garde votre verdict, vos questions et votre conseil."
      />
    </div>
  );
}
