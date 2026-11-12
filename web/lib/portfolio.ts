import clientsData from '@/data/json/clients.json';
import meetingsData from '@/data/json/meetings.json';
import type { Client } from '@/lib/crm';
import { getClientStats, type ClientStats } from '@/lib/stats';

interface Meeting {
  id: string;
  client_id: string;
  opportunity_id: string;
  status: 'a_preparer' | 'realise';
}

export interface PortfolioClient {
  id: string;
  name: string;
  sector: string;
  country: string;
  account_manager: string;
  relationship_status: string;
  stats: ClientStats;
}

export interface PortfolioKpis {
  clients: number;
  opportunitiesDetected: number;
  opportunitiesToQualify: number;
  meetingsToPrepare: number;
}

export interface Portfolio {
  clients: PortfolioClient[];
  kpis: PortfolioKpis;
}

const clients = clientsData as Client[];
const meetings = meetingsData as Meeting[];

// Tout est calculé depuis les JSON : aucun chiffre saisi à la main.
export function getPortfolio(): Portfolio {
  const rows = clients.map((client) => ({
    id: client.id,
    name: client.name,
    sector: client.sector,
    country: client.country,
    account_manager: client.account_manager,
    relationship_status: client.relationship_status,
    stats: getClientStats(client),
  }));

  return {
    clients: rows,
    kpis: {
      clients: rows.length,
      opportunitiesDetected: rows.reduce(
        (total, row) => total + row.stats.opportunitiesDetected,
        0,
      ),
      opportunitiesToQualify: rows.reduce(
        (total, row) => total + row.stats.opportunitiesToQualify,
        0,
      ),
      meetingsToPrepare: meetings.filter(
        (meeting) => meeting.status === 'a_preparer',
      ).length,
    },
  };
}
