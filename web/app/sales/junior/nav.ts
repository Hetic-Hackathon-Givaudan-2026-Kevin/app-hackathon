import {
  BookOpen,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string; // sert aussi de key React
  label: string;
  icon: LucideIcon;
  exact?: boolean; // actif seulement sur l'URL exacte
}

export const juniorNav: NavItem[] = [
  {
    href: '/sales/junior',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/sales/junior/clients',
    label: 'Portefeuille clients',
    icon: Building2,
  },
  {
    href: '/sales/junior/rendez-vous',
    label: 'Rendez-vous',
    icon: CalendarCheck,
  },
  {
    href: '/sales/junior/bonnes-pratiques',
    label: 'Bonnes pratiques',
    icon: BookOpen,
  },
];
