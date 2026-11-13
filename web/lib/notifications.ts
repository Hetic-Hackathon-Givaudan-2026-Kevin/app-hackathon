'use client';

import { useSyncExternalStore } from 'react';
import { useReviews, VERDICT_LABEL } from '@/lib/review';
import { useValidatedReports } from '@/lib/reports-store';
import { routes, type Role } from '@/lib/roles';

// Notifications dérivées de l'état réel de l'application : une relecture
// enregistrée, un compte rendu validé. Rien n'est inventé pour la démonstration.
// Seul l'état « lu » est stocké, dans le navigateur.

export interface Notification {
  id: string;
  title: string;
  text: string;
  href: string;
  date: string; // AAAA-MM-JJ
  highlight?: boolean; // mise en avant (pastille lime)
}

// Ce que le serveur fournit pour nommer les notifications
export interface NotificationContext {
  opportunities: Record<
    string,
    { title: string; clientName: string; needsReview?: boolean }
  >;
  briefByOpportunity: Record<string, string>; // opportunité → rendez-vous
}

const KEY = 'radar.notifications-read.v1';
const EMPTY: Record<string, true> = {};

let cache: Record<string, true> | null = null;
const listeners = new Set<() => void>();

function load(): Record<string, true> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Record<string, true>;
  } catch {
    // stockage indisponible : tout est considéré comme non lu
  }
  return EMPTY;
}

function getSnapshot(): Record<string, true> {
  if (cache === null) cache = load();
  return cache;
}

function getServerSnapshot(): Record<string, true> {
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

function commit(next: Record<string, true>) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // sans stockage, la notification repassera non lue au rechargement
  }
  listeners.forEach((listener) => listener());
}

export function markRead(ids: string[]): void {
  const current = getSnapshot();
  const next = { ...current };
  for (const id of ids) next[id] = true;
  commit(next);
}

export function resetNotifications(): void {
  commit(EMPTY);
}

export interface NotificationFeed {
  items: Notification[];
  unread: Notification[];
}

export function useNotifications(
  role: Role,
  context: NotificationContext,
): NotificationFeed {
  const read = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reviews = useReviews();
  const reports = useValidatedReports();
  const r = routes(role);

  const label = (opportunityId: string) =>
    context.opportunities[opportunityId] ?? {
      title: 'Opportunité',
      clientName: '',
    };

  const items: Notification[] = [];

  if (role === 'junior') {
    // Une recommandation relue par un senior change la préparation du junior
    for (const review of Object.values(reviews)) {
      const { title, clientName } = label(review.opportunity_id);
      items.push({
        id: `review:${review.opportunity_id}:${review.reviewed_at}`,
        title: VERDICT_LABEL[review.verdict],
        text: `${clientName} • ${title}`,
        href: r.opportunity(review.opportunity_id),
        date: review.reviewed_at,
        highlight: review.verdict === 'ecartee',
      });
    }
  }

  if (role === 'senior') {
    // Les comptes rendus validés par les juniors sur ses relectures
    for (const report of Object.values(reports)) {
      if (!reviews[report.opportunity_id]) continue;
      items.push({
        id: `report:${report.opportunity_id}:${report.validated_at}`,
        title: 'Compte rendu validé par le commercial',
        text: `${report.client_name} • ${report.opportunity_title}`,
        href: r.reviewItem(report.opportunity_id),
        date: report.validated_at,
      });
    }

    // Rappel groupé : ce qui attend encore une relecture
    const pending = Object.entries(context.opportunities).filter(
      ([id, item]) => item.needsReview && !reviews[id],
    ).length;
    if (pending > 0) {
      items.push({
        id: `pending:${pending}`,
        title: `${pending} recommandation${pending > 1 ? 's' : ''} à relire`,
        text: 'Validez ou corrigez ce que l’IA propose aux juniors.',
        href: r.review,
        date: '',
        highlight: true,
      });
    }
  }

  if (role === 'rd') {
    // Un brief arrive dès qu'un commercial valide son compte rendu
    for (const report of Object.values(reports)) {
      const meetingId = context.briefByOpportunity[report.opportunity_id];
      items.push({
        id: `brief:${report.opportunity_id}:${report.validated_at}`,
        title: 'Nouveau brief reçu',
        text: `${report.client_name} • ${report.opportunity_title}`,
        href: meetingId ? r.brief(meetingId) : r.briefs,
        date: report.validated_at,
        highlight: true,
      });
    }
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  return { items, unread: items.filter((item) => !read[item.id]) };
}
