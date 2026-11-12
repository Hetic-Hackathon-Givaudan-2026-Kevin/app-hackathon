// web/app/sales/senior/nav.ts
import {
  BookOpen,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const seniorNav: NavItem[] = [
  { href: '/sales/senior', label: 'Tableau de bord', icon: LayoutDashboard },
  {
    href: '/sales/junior/clients',
    label: 'Portefeuille clients',
    icon: Building2,
  },
  {
    href: '/sales/senior/rendez-vous',
    label: 'Rendez-vous',
    icon: CalendarCheck,
  },
  {
    href: '/sales/senior/bonnes-pratiques',
    label: 'Bonnes pratiques',
    icon: BookOpen,
  },
];
