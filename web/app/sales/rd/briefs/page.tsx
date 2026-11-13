import BriefsList from '@/components/rd/BriefsList';
import { pageTitle } from '@/components/ui/Soft';
import { getBriefs } from '@/lib/briefs';

export default function BriefsPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <section>
        <h1 className={pageTitle}>Briefs reçus</h1>
        <p className="mt-2 text-sm text-[#667085] sm:text-base">
          Chaque rendez-vous commercial réalisé donne un brief : ce que le
          client a demandé, ce qui est confirmé et ce qui reste à vérifier.
        </p>
      </section>

      <BriefsList briefs={getBriefs()} title="Tous les briefs" />
    </div>
  );
}
