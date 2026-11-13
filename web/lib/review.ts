import { useSyncExternalStore } from 'react';
import type { Priority } from '@/lib/crm';
import type { ChecklistItem } from '@/lib/report';

// Relectures des recommandations de l'IA par un commercial senior.
// Prototype : elles sont gardées dans le navigateur, sans serveur.

export const SENIOR_AUTHOR = 'Commercial senior';

export type Verdict = 'validee' | 'corrigee' | 'ecartee';

export interface QuestionDraft {
  id: string;
  question: string;
  why: string;
  info_sought: ChecklistItem;
  kept: boolean;
  origin: 'ia' | 'senior';
}

export interface Review {
  opportunity_id: string;
  verdict: Verdict;
  recommendation: string;
  priority: Priority;
  reason: string; // motif, lorsque l'opportunité est écartée
  questions: QuestionDraft[];
  coaching: string; // conseil adressé au commercial junior
  reviewed_by: string;
  reviewed_at: string; // AAAA-MM-JJ
}

export type Reviews = Record<string, Review>;

const KEY = 'radar.reviews.v1';
const EMPTY: Reviews = {};

let cache: Reviews | null = null;
const listeners = new Set<() => void>();

function load(): Reviews {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Reviews;
  } catch {
    // stockage indisponible ou contenu illisible : on repart de zéro
  }
  return EMPTY;
}

function getSnapshot(): Reviews {
  if (cache === null) cache = load();
  return cache;
}

function getServerSnapshot(): Reviews {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function commit(next: Reviews) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // la relecture reste valable tant que la page est ouverte
  }
  listeners.forEach((listener) => listener());
}

export function useReviews(): Reviews {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function today(): string {
  return new Date().toLocaleDateString('sv-SE'); // AAAA-MM-JJ, heure locale
}

export function saveReview(
  draft: Omit<Review, 'reviewed_by' | 'reviewed_at'>,
): void {
  const current = getSnapshot();
  commit({
    ...current,
    [draft.opportunity_id]: {
      ...draft,
      reviewed_by: SENIOR_AUTHOR,
      reviewed_at: today(),
    },
  });
}

export function removeReview(opportunityId: string): void {
  const current = getSnapshot();
  const next = { ...current };
  delete next[opportunityId];
  commit(next);
}

export function resetReviews(): void {
  commit(EMPTY);
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  validee: 'Validée telle quelle',
  corrigee: 'Corrigée par un senior',
  ecartee: 'Écartée par un senior',
};

export const VERDICT_CLASS: Record<Verdict, string> = {
  validee: 'bg-[#2FA66A]/10 text-[#2FA66A]',
  corrigee: 'bg-[#2686C9]/10 text-[#2686C9]',
  ecartee: 'bg-[#D94848]/10 text-[#D94848]',
};
