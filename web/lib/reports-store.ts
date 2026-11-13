'use client';

import { useSyncExternalStore } from 'react';
import type { ReportSection } from '@/lib/report';

// Comptes rendus validés par le commercial, relus par l'espace R&D.
// Prototype : gardés dans le navigateur, sans serveur.

export interface ValidatedReport {
  opportunity_id: string;
  client_name: string;
  opportunity_title: string;
  sections: ReportSection[];
  validated_at: string; // AAAA-MM-JJ
}

export type ValidatedReports = Record<string, ValidatedReport>;

const KEY = 'radar.reports.v1';
const EMPTY: ValidatedReports = {};

let cache: ValidatedReports | null = null;
const listeners = new Set<() => void>();

function load(): ValidatedReports {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ValidatedReports;
  } catch {
    // stockage indisponible ou contenu illisible
  }
  return EMPTY;
}

function getSnapshot(): ValidatedReports {
  if (cache === null) cache = load();
  return cache;
}

function getServerSnapshot(): ValidatedReports {
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

export function useValidatedReports(): ValidatedReports {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveValidatedReport(
  report: Omit<ValidatedReport, 'validated_at'>,
): void {
  const current = getSnapshot();
  const next: ValidatedReports = {
    ...current,
    [report.opportunity_id]: {
      ...report,
      validated_at: new Date().toLocaleDateString('sv-SE'),
    },
  };
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // le compte rendu reste affiché, il ne sera simplement pas transmis
  }
  listeners.forEach((listener) => listener());
}
