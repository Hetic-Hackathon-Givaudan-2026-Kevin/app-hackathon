import Navigation from '@/components/Navigation';
import { commonFeatures } from '@/data/data';

export default function LayoutJunior({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto p-3 gap-6 items-start">
        <aside className="w-full md:w-[280px] lg:w-[320px] shrink-0 rounded-2xl p-4 shadow-sm md:sticky md:top-6 md:h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="mb-4">
            {commonFeatures.map((c) => (
              <div className="" key={c.id}>
                <div></div>
                <p className="text-sm">{c.name}</p>
              </div>
            ))}
          </div>
          {/* Insère ici ta liste déroulante ou tes éléments de navigation latérale */}
        </aside>

        {/* Côté droit : Contenu principal (scrollable indépendamment si nécessaire) */}
        <section className="flex-1 flex flex-col gap-6 w-full min-w-0">
          {children}
        </section>
      </main>
    </div>
  );
}
