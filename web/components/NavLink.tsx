'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  // true : actif seulement sur l'URL exacte (ex. le tableau de bord)
  exact?: boolean;
  children: React.ReactNode;
}

export default function NavLink({
  href,
  exact = false,
  children,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

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