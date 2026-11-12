import practicesData from '@/data/json/good-practices.json';
import type { ChecklistItem } from '@/lib/report';

export type PracticeMoment = 'avant' | 'pendant' | 'apres';

export interface Practice {
  id: string;
  moment: PracticeMoment;
  topic: ChecklistItem; // information de la checklist concernée
  title: string;
  advice: string;
  why: string;
}

export const MOMENT_LABEL: Record<PracticeMoment, string> = {
  avant: 'Avant le rendez-vous',
  pendant: 'Pendant le rendez-vous',
  apres: 'Après le rendez-vous',
};

const practices = practicesData as Practice[];

// Bonnes pratiques de démonstration (fictives), regroupées par moment
export function getPractices(): Practice[] {
  return practices;
}

// Bonne pratique affichée avec le compte rendu
export function getFollowUpPractice(): Practice | null {
  return practices.find((practice) => practice.moment === 'apres') ?? null;
}
