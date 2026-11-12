'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  // true : actif seulement sur l'URL exacte (ex. le tableau de bord)
  exact?: boolean;
  children: React.ReactNode;
  alsoActiveOn?: string[]; // nouveau
}

export default function NavLink({
  href,
  exact = false,
  alsoActiveOn = [],
  children,
}: NavLinkProps) {
  const pathname = usePathname();
  const matches = (base: string) =>
    pathname === base || pathname.startsWith(`${base}/`);

  const isActive = exact
    ? pathname === href
    : matches(href) || alsoActiveOn.some(matches);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-full p-5.5 px-7 text-sm transition-all duration-300 ease-out ${
        isActive
          ? 'bg-violet-500 font-medium text-white'
          : 'bg-white/50 text-[#172033] hover:bg-white'
      }`}
    >
      {children}
    </Link>
  );
}
