// web/app/sales/senior/nav.ts
import {
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const seniorNav: NavItem[] = [
  {
    href: '/sales/senior',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/sales/senior/clients',
    label: 'Portefeuille clients',
    icon: Building2,
  },
  {
    href: '/sales/senior/appointment',
    label: 'Rendez-vous',
    icon: CalendarCheck,
  },
  { href: '/sales/senior/revue', label: 'Relecture IA', icon: ClipboardCheck },
  {
    href: '/sales/senior/good-practices',
    label: 'Bonnes pratiques',
    icon: BookOpen,
  },
];
