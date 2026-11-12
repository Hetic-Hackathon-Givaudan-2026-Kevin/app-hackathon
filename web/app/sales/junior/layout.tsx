import Navigation from '@/components/Navigation';
import { commonFeatures } from '@/data/data';
import { juniorNav } from './nav';
import Link from 'next/link';
import NavLink from '@/components/NavLink';

export default function LayoutJunior({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto p-3 gap-6 items-start">
        <aside className="w-full md:w-[280px] lg:w-60 shrink-0 rounded-2xl md:sticky md:top-6 md:h-[calc(100vh-7rem)] overflow-y-auto">
          <div className=" space-y-3">
           {juniorNav.map((item) => (
              <NavLink key={item.href} href={item.href} exact={item.exact}>
                <item.icon size={18} strokeWidth={1.3} />
                <span>{item.label}</span>
              </NavLink>
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
