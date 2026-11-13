import meetingsData from '@/data/json/meetings.json';
import {
  formatDate,
  getOpportunityDetail,
  type OpportunityStatus,
} from '@/lib/crm';

// Briefs transmis aux équipes internes après un rendez-vous.
// Source : les rendez-vous réalisés du jeu de démonstration. Les comptes
// rendus validés pendant la démonstration s'y ajoutent côté navigateur.

interface Meeting {
  id: string;
  client_id: string;
  opportunity_id: string;
  objective: string;
  questions: string[];
  answers: string[];
  notes: string;
  summary: string;
  next_actions: string[];
  date: string; // AAAA-MM-JJ
  status: 'a_preparer' | 'realise';
}

export interface BriefExchange {
  question: string;
  answer: string;
}

export interface BriefRow {
  id: string;
  iso: string; // AAAA-MM-JJ, pour trier
  date: string; // JJ/MM/AAAA
  day: string;
  month: string;
  objective: string;
  summary: string;
  notes: string;
  nextActions: string[];
  exchanges: BriefExchange[];
  teams: string[];
  client: { id: string; name: string; sector: string; country: string };
  opportunity: {
    id: string;
    title: string;
    category: string;
    status: OpportunityStatus;
    description: string;
  };
}

export interface BriefStats {
  briefs: number;
  clients: number;
  actions: number;
  teams: number;
}

const meetings = meetingsData as Meeting[];

// Équipes concernées, déduites du secteur et du sujet (règles simples :
// le prototype ne fait pas appel à un modèle).
function teamsFor(sector: string, subject: string, text: string): string[] {
  const teams = new Set<string>();
  teams.add(
    /cosm|parfum|hygi/i.test(sector)
      ? 'Parfumerie : créateurs et évaluateurs'
      : 'Arômes : créateurs et évaluateurs',
  );
  if (/formulation|technique|textur|stabilit|process|masquage/i.test(text)) {
    teams.add('Application technique et R&D');
  }
  if (/budget|prix|coût|cout|marge/i.test(text)) {
    teams.add('Pricing et finance');
  }
  if (
    /certif|naturel|sucre|sel\b|réglement|reglement|clean label/i.test(
      subject + ' ' + text,
    )
  ) {
    teams.add('Réglementaire');
  }
  return [...teams];
}

function toRow(meeting: Meeting): BriefRow | null {
  const detail = getOpportunityDetail(meeting.opportunity_id);
  if (!detail) return null;

  const date = new Date(meeting.date);
  const text = [
    meeting.summary,
    meeting.notes,
    ...meeting.answers,
    ...meeting.next_actions,
  ].join(' ');

  return {
    id: meeting.id,
    iso: meeting.date,
    date: formatDate(meeting.date),
    day: date.toLocaleDateString('fr-FR', { day: '2-digit', timeZone: 'UTC' }),
    month: date.toLocaleDateString('fr-FR', {
      month: 'short',
      timeZone: 'UTC',
    }),
    objective: meeting.objective,
    summary: meeting.summary,
    notes: meeting.notes,
    nextActions: meeting.next_actions,
    exchanges: meeting.questions.map((question, index) => ({
      question,
      answer: meeting.answers[index] ?? '',
    })),
    teams: teamsFor(
      detail.client.sector,
      `${detail.opportunity.title} ${detail.opportunity.category}`,
      text,
    ),
    client: {
      id: detail.client.id,
      name: detail.client.name,
      sector: detail.client.sector,
      country: detail.client.country,
    },
    opportunity: {
      id: detail.opportunity.id,
      title: detail.opportunity.title,
      category: detail.opportunity.category,
      status: detail.opportunity.status,
      description: detail.opportunity.description,
    },
  };
}

// Du plus récent au plus ancien
export function getBriefs(): BriefRow[] {
  return meetings
    .filter((meeting) => meeting.status === 'realise')
    .flatMap((meeting) => toRow(meeting) ?? [])
    .sort((a, b) => b.iso.localeCompare(a.iso));
}

export function getBriefIds(): string[] {
  return getBriefs().map((brief) => brief.id);
}

export function getBrief(id: string): BriefRow | null {
  return getBriefs().find((brief) => brief.id === id) ?? null;
}

export function getBriefStats(briefs: BriefRow[]): BriefStats {
  return {
    briefs: briefs.length,
    clients: new Set(briefs.map((brief) => brief.client.id)).size,
    actions: briefs.reduce(
      (total, brief) => total + brief.nextActions.length,
      0,
    ),
    teams: new Set(briefs.flatMap((brief) => brief.teams)).size,
  };
}
