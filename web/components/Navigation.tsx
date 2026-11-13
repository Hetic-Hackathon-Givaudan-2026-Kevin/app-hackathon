'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import type { NotificationContext } from '@/lib/notifications';
import { ROLE_LABEL, ROLE_PERSON, ROLE_PHOTO, type Role } from '@/lib/roles';
import SearchBar from './SearchBar';

export default function Navigation({
  role,
  notificationContext,
}: {
  role: Role;
  notificationContext: NotificationContext;
}) {
  // La recherche porte sur le portefeuille clients : elle n'a pas de sens
  // dans l'espace Recherche & Développement, qui ne suit pas de comptes.
  const showSearch = role !== 'rd';

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-4 lg:p-3.5">
        {/* Profil connecté */}
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={ROLE_PHOTO[role]}
            alt=""
            width={72}
            height={72}
            priority
            className="size-9 shrink-0 rounded-full bg-white object-cover"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium text-[#172033]">
              {ROLE_PERSON[role]}
            </span>
            <span className="block truncate text-xs text-[#667085]">
              {ROLE_LABEL[role]}
            </span>
          </span>
        </div>

        {showSearch && <SearchBar />}

        <div className="flex shrink-0 items-center gap-2">
          <NotificationBell role={role} context={notificationContext} />
          <Link
            href="/"
            aria-label="Changer de profil"
            className="bg-foreground flex items-center gap-2 rounded-full p-2 text-sm font-medium text-white transition-opacity hover:opacity-90 lg:px-3"
          >
            <LogOut size={16} strokeWidth={1.6} />
            <span className="max-lg:hidden">Déconnexion</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
