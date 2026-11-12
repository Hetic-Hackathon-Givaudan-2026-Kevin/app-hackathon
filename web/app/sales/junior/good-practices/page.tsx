import {
  glowCardInk,
  LimeTag,
  pageTitle,
  sectionTitle,
  softCard,
  softTile,
  Stat,
} from '@/components/ui/Soft';
import {
  getPractices,
  MOMENT_LABEL,
  type PracticeMoment,
} from '@/lib/practices';

const MOMENTS: PracticeMoment[] = ['avant', 'pendant', 'apres'];

export default function GoodPracticesPage() {
  const practices = getPractices();
  const count = (moment: PracticeMoment) =>
    practices.filter((practice) => practice.moment === moment).length;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Titre et indicateurs */}
      <section className="flex flex-col gap-5">
        <div>
          <h1 className={pageTitle}>Bonnes pratiques</h1>
          <p className="mt-2 text-sm text-[#667085] sm:text-base">
            Des repères courts pour obtenir les bonnes informations sans
            alourdir l&apos;échange avec le client.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <Stat value={practices.length} label="Total" highlight />
          {MOMENTS.map((moment) => (
            <Stat
              key={moment}
              value={count(moment)}
              label={MOMENT_LABEL[moment]}
            />
          ))}
        </div>
      </section>

      {/* B. Rappel du principe */}
      <section className={`${glowCardInk} glow-pink`}>
        <p className="text-sm">Le principe</p>
        <p className="mt-6 max-w-2xl text-2xl font-normal tracking-tight sm:text-3xl">
          Rien devant le client. Tout se prépare avant, tout se note juste
          après.
        </p>
      </section>

      {/* C. Bonnes pratiques par moment */}
      {MOMENTS.map((moment) => {
        const items = practices.filter(
          (practice) => practice.moment === moment,
        );
        if (items.length === 0) return null;

        return (
          <section key={moment} className={softCard}>
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <h2 className={sectionTitle}>{MOMENT_LABEL[moment]}</h2>
              <LimeTag>{items.length}</LimeTag>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((practice) => (
                <li
                  key={practice.id}
                  className={`${softTile} flex flex-col gap-3 p-5`}
                >
                  <LimeTag>{practice.topic}</LimeTag>
                  <h3 className="text-lg font-normal tracking-tight text-[#172033]">
                    {practice.title}
                  </h3>
                  <p className="text-sm text-[#172033]">{practice.advice}</p>
                  <p className="mt-auto rounded-[18px] bg-[#F3F4F6] p-3 text-sm text-[#667085]">
                    <span className="text-[#172033]">Pourquoi ?</span>{' '}
                    {practice.why}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-xs text-[#667085]">
        Prototype : exemples de démonstration. Dans une version ultérieure, les
        bonnes pratiques seront proposées par les commerciaux seniors et
        validées avant d&apos;être partagées.
      </p>
    </div>
  );
}
