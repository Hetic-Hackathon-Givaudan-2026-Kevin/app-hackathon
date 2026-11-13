import Navigation from '@/components/Navigation';
import NavLink from '@/components/NavLink';
import { navFor } from '@/lib/nav';
import { getNotificationContext } from '@/lib/notification-context';
import type { Role } from '@/lib/roles';

// Mise en page commune aux trois espaces : en-tête, barre latérale, contenu.
export default function RoleLayout({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation role={role} notificationContext={getNotificationContext()} />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-start gap-6 p-3 md:flex-row">
        <aside
          className={`w-full shrink-0 overflow-y-auto rounded-2xl md:sticky md:top-6 md:h-[calc(100vh-7rem)] md:w-[280px] ${
            role === 'junior' ? 'lg:w-60' : ''
          }`}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1 md:gap-3">
            {navFor(role).map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                exact={item.exact}
                alsoActiveOn={item.alsoActiveOn}
              >
                <item.icon size={18} strokeWidth={1.3} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </aside>

        <section className="flex w-full min-w-0 flex-1 flex-col gap-6">
          {children}
        </section>
      </main>
    </div>
  );
}
