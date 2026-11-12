'use client';

import { useSyncExternalStore } from 'react';
import { CHECKLIST, type ChecklistItem } from '@/lib/report';

// Saisie de l'écran « après le rendez-vous », gardée dans l'onglet du
// navigateur (sessionStorage) pour être relue par l'écran du compte rendu.
// Prototype : rien n'est envoyé à un serveur.
export interface DebriefDraft {
  answers: string[]; // une réponse (éventuellement vide) par question
  checked: ChecklistItem[];
  notes: string;
}

const storageKey = (opportunityId: string) => `debrief:${opportunityId}`;

const noopSubscribe = () => () => {};

function parseDraft(raw: string | null): DebriefDraft | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<DebriefDraft>;
    return {
      answers: Array.isArray(value.answers) ? value.answers.map(String) : [],
      checked: CHECKLIST.filter((item) => value.checked?.includes(item)),
      notes: typeof value.notes === 'string' ? value.notes : '',
    };
  } catch {
    return null;
  }
}

export function saveDebriefDraft(opportunityId: string, draft: DebriefDraft) {
  try {
    sessionStorage.setItem(storageKey(opportunityId), JSON.stringify(draft));
  } catch {
    // Stockage indisponible (navigation privée) : la saisie reste à l'écran
  }
}

function readRaw(opportunityId: string): string | null {
  try {
    return sessionStorage.getItem(storageKey(opportunityId));
  } catch {
    return null;
  }
}

// undefined : pas encore lu (rendu serveur) • null : aucune saisie
export function useDebriefDraft(
  opportunityId: string,
): DebriefDraft | null | undefined {
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => readRaw(opportunityId),
    () => undefined,
  );
  return raw === undefined ? undefined : parseDraft(raw);
}
