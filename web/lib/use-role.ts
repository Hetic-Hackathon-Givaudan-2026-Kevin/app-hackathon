'use client';

import { usePathname } from 'next/navigation';
import { roleFromPath, routes, type Role } from '@/lib/roles';

// Rôle de l'espace où le composant est affiché, déduit de l'URL.
export function useRole(): Role {
  return roleFromPath(usePathname());
}

// Raccourci : les routes du rôle courant
export function useRoutes() {
  return routes(useRole());
}
