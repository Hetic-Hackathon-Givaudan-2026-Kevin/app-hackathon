import clientsData from '@/data/json/clients.json';
import opportunitiesData from '@/data/json/opportunities.json';
import practicesData from '@/data/json/good-practices.json';
import signalsData from '@/data/json/signals.json';
import suggestedData from '@/data/json/suggested-questions.json';
import {
  getOpportunityDetail,
  type Client,
  type Opportunity,
  type OpportunityDetail,
  type Priority,
  type Signal,
} from '@/lib/crm';
import type { ChecklistItem } from '@/lib/report';

export type ReviewNeed = 'a_relire' | 'auto';

export interface ReviewItem {
  need: ReviewNeed;
  needReason: string;
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  sector: string;
  priority: Priority;
  status: Opportunity['status'];
  recommendation: string;
}

export interface SeniorDashboard {
  toReview: ReviewItem[];
  kpis: {
    clients: number;
    opportunities: number;
    toReview: number; // seulement celles qui demandent un avis humain
    autoPublished: number;
    practices: number;
  };
}

export interface SuggestedQuestion {
  question: string;
  why: string;
  info_sought: ChecklistItem;
}

export interface ReviewContext {
  detail: OpportunityDetail;
  need: ReviewNeed;
  needReason: string;
  objective: string;
  blocker: string;
  questions: SuggestedQuestion[];
  position: number; // rang dans la file de relecture, à partir de 1
  total: number;
  previousId: string | null;
  nextId: string | null;
}

interface SuggestedSet {
  opportunity_id: string | null;
  objective: string;
  blocker: string;
  questions: SuggestedQuestion[];
}

const clients = clientsData as Client[];
const signals = signalsData as Signal[];
const opportunities = opportunitiesData as Opportunity[];
const suggested = suggestedData as SuggestedSet[];

const PRIORITY_RANK: Record<Priority, number> = {
  haute: 0,
  moyenne: 1,
  basse: 2,
};

// Une recommandation appuyée sur un fait documenté et fiable est publiée
// telle quelle : le senior n'est sollicité que lorsque l'IA s'avance sur une
// hypothèse ou sur un signal peu fiable. C'est ce qui garde sa file courte.
function assess(opportunityId: string): {
  need: ReviewNeed;
  needReason: string;
} {
  const related = signals.filter(
    (signal) => signal.opportunity_id === opportunityId,
  );

  const solid = related.some(
    (signal) =>
      signal.evidence_type === 'fait' && signal.confidence !== 'faible',
  );
  if (solid) {
    return {
      need: 'auto',
      needReason: 'Appuyée sur un fait documenté',
    };
  }

  const weak = related.find((signal) => signal.confidence === 'faible');
  if (weak) {
    return { need: 'a_relire', needReason: 'Signal de fiabilité faible' };
  }

  const hypothesis = related.find((signal) => signal.evidence_type !== 'fait');
  if (hypothesis) {
    return { need: 'a_relire', needReason: 'Fondée sur une hypothèse' };
  }

  return { need: 'a_relire', needReason: 'Fiabilité à confirmer' };
}

// Le senior relit les recommandations de l'IA : seules les opportunités
// non encore confirmées lui sont proposées, les plus prioritaires d'abord.
function queue(): ReviewItem[] {
  return opportunities
    .filter((opportunity) => opportunity.status !== 'confirmee')
    .map((opportunity) => {
      const client = clients.find((item) => item.id === opportunity.client_id);
      return {
        ...assess(opportunity.id),
        id: opportunity.id,
        title: opportunity.title,
        clientId: opportunity.client_id,
        clientName: client?.name ?? '',
        sector: client?.sector ?? '',
        priority: opportunity.priority,
        status: opportunity.status,
        recommendation: opportunity.next_action,
      };
    })
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
}

export function getSeniorDashboard(): SeniorDashboard {
  const toReview = queue();

  return {
    toReview,
    kpis: {
      clients: clients.length,
      opportunities: opportunities.length,
      toReview: toReview.filter((item) => item.need === 'a_relire').length,
      autoPublished: toReview.filter((item) => item.need === 'auto').length,
      practices: practicesData.length,
    },
  };
}

export function getReviewIds(): string[] {
  return queue().map((item) => item.id);
}

// Tout ce qu'il faut pour relire une recommandation : les signaux et le
// raisonnement sur lesquels l'IA s'appuie, et les questions qu'elle propose.
export function getReviewContext(opportunityId: string): ReviewContext | null {
  const detail = getOpportunityDetail(opportunityId);
  if (!detail) return null;

  const list = queue();
  const index = list.findIndex((item) => item.id === opportunityId);
  if (index === -1) return null;

  const set = suggested.find((item) => item.opportunity_id === opportunityId);

  return {
    detail,
    ...assess(opportunityId),
    objective: set?.objective ?? '',
    blocker: set?.blocker ?? '',
    questions: set?.questions ?? [],
    position: index + 1,
    total: list.length,
    previousId: index > 0 ? list[index - 1].id : null,
    nextId: index < list.length - 1 ? list[index + 1].id : null,
  };
}
