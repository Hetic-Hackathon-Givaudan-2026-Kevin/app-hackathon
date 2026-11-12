import clientsData from '@/data/json/clients.json';
import opportunitiesData from '@/data/json/opportunities.json';
import signalsData from '@/data/json/signals.json';
import insightsData from '@/data/json/clients-insights.json';
import { getClientStats } from '@/lib/stats';

export type OpportunityStatus = 'detectee' | 'a_qualifier' | 'confirmee';
export type Priority = 'haute' | 'moyenne' | 'basse';
export type Level = 'faible' | 'moyenne' | 'elevee';
export type EvidenceType = 'fait' | 'hypothese' | 'a_confirmer';

export interface Client {
  id: string;
  name: string;
  sector: string;
  country: string;
  account_manager: string;
  relationship_status: string;
  last_updated: string;
  projectsCount: number;
  opportunitiesDetected: number;
  opportunitiesToQualify: number;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string;
  status: 'actif' | 'termine';
  start_date: string; // AAAA-MM-JJ
}

export interface Opportunity {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  status: OpportunityStatus;
  priority: Priority;
  estimated_potential: Level | null; // indicatif, jamais un montant
  feasibility: Level | 'a_confirmer';
  complexity: Level;
  next_action: string;
}

export interface Signal {
  id: string;
  opportunity_id: string;
  description: string;
  source_type: string;
  source_date: string; // AAAA-MM-JJ
  confidence: Level | 'haute';
  evidence_type: EvidenceType;
}

export interface ClientSummary {
  situation: string;
  important_projects: string[];
  expressed_needs: string[];
  recent_signals: string[];
  attention_points: string[];
}

export interface HistoryEvent {
  date: string; // AAAA-MM-JJ
  event: string;
}

export interface ClientInsight {
  client_id: string;
  summary: ClientSummary;
  history: HistoryEvent[];
}

export interface OpportunityCard extends Opportunity {
  lastSignalDate: string | null;
}

export interface ClientDetail {
  client: Client;
  stats: {
    projects: number;
    opportunitiesDetected: number;
    opportunitiesToQualify: number;
  };
  summary: ClientSummary | null;
  history: HistoryEvent[];
  opportunities: OpportunityCard[];
}

const clients = clientsData as Client[];
const opportunities = opportunitiesData as Opportunity[];
const signals = signalsData as Signal[];
const insights = insightsData as ClientInsight[];

export const LEVEL_LABEL: Record<Level, string> = {
  faible: 'Faible',
  moyenne: 'Moyen',
  elevee: 'Élevé',
};

export function getClientIds(): string[] {
  return clients.map((client) => client.id);
}

// Date AAAA-MM-JJ affichée en JJ/MM/AAAA
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

function lastSignalDate(opportunityId: string): string | null {
  const dates = signals
    .filter((signal) => signal.opportunity_id === opportunityId)
    .map((signal) => signal.source_date)
    .sort();
  return dates.at(-1) ?? null;
}

export function getClientDetail(id: string): ClientDetail | null {
  const client = clients.find((item) => item.id === id);
  if (!client) return null;

  const clientOpportunities = opportunities
    .filter((opportunity) => opportunity.client_id === id)
    .map((opportunity) => ({
      ...opportunity,
      lastSignalDate: lastSignalDate(opportunity.id),
    }));
  const insight = insights.find((item) => item.client_id === id);

  const stats = getClientStats(client);

  return {
    client,
    stats,
    summary: insight?.summary ?? null,
    history: [...(insight?.history ?? [])].sort((a, b) =>
      b.date.localeCompare(a.date),
    ),
    opportunities: clientOpportunities,
  };
}