import {
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  FlaskConical,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';
import { routes, type Role } from '@/lib/roles';

export interface NavItem {
  href: string; // sert aussi de clé React
  label: string;
  icon: LucideIcon;
  exact?: boolean; // actif seulement sur l'URL exacte
  alsoActiveOn?: string[]; // routes qui allument aussi cet onglet
}

// Une seule source pour les trois barres latérales.
export function navFor(role: Role): NavItem[] {
  const r = routes(role);

  if (role === 'rd') {
    return [
      {
        href: r.home,
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        exact: true,
      },
      { href: r.briefs, label: 'Briefs reçus', icon: FlaskConical },
    ];
  }

  const common: NavItem[] = [
    {
      href: r.home,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: r.clients,
      label: 'Portefeuille clients',
      icon: Building2,
      alsoActiveOn: [`${r.home}/opportunites`],
    },
    { href: r.appointments, label: 'Rendez-vous', icon: CalendarCheck },
  ];

  if (role === 'senior') {
    common.push({
      href: r.review,
      label: 'Relecture IA',
      icon: ClipboardCheck,
    });
  }

  common.push({
    href: r.practices,
    label: 'Bonnes pratiques',
    icon: BookOpen,
  });

  return common;
}
