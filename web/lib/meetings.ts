import meetingsData from '@/data/json/meetings.json';
import {
  formatDate,
  getOpportunityDetail,
  type OpportunityStatus,
} from '@/lib/crm';
import { getCopilotIds } from '@/lib/copilot';

interface Meeting {
  id: string;
  client_id: string;
  opportunity_id: string;
  objective: string;
  summary: string;
  next_actions: string[];
  date: string; // AAAA-MM-JJ
  status: 'a_preparer' | 'realise';
}

export interface MeetingRow {
  id: string;
  date: string; // JJ/MM/AAAA
  day: string; // « 17 »
  month: string; // « nov. »
  objective: string;
  summary: string;
  nextActions: string[];
  client: { id: string; name: string };
  opportunity: { id: string; title: string; status: OpportunityStatus };
  hasCopilot: boolean; // des questions existent pour cette opportunité
}

export interface MeetingList {
  toPrepare: MeetingRow[]; // du plus proche au plus lointain
  done: MeetingRow[]; // du plus récent au plus ancien
}

const meetings = meetingsData as Meeting[];

// Tout est repris des JSON : rendez-vous, client et opportunité associés.
export function getMeetings(): MeetingList {
  const copilotIds = new Set(getCopilotIds());

  const rows = meetings.flatMap((meeting) => {
    const detail = getOpportunityDetail(meeting.opportunity_id);
    if (!detail) return [];
    const date = new Date(meeting.date);
    const row: MeetingRow = {
      id: meeting.id,
      date: formatDate(meeting.date),
      day: date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        timeZone: 'UTC',
      }),
      month: date.toLocaleDateString('fr-FR', {
        month: 'short',
        timeZone: 'UTC',
      }),
      objective: meeting.objective,
      summary: meeting.summary,
      nextActions: meeting.next_actions,
      client: { id: detail.client.id, name: detail.client.name },
      opportunity: {
        id: detail.opportunity.id,
        title: detail.opportunity.title,
        status: detail.opportunity.status,
      },
      hasCopilot: copilotIds.has(meeting.opportunity_id),
    };
    return [{ row, isoDate: meeting.date, status: meeting.status }];
  });

  return {
    toPrepare: rows
      .filter((item) => item.status === 'a_preparer')
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
      .map((item) => item.row),
    done: rows
      .filter((item) => item.status === 'realise')
      .sort((a, b) => b.isoDate.localeCompare(a.isoDate))
      .map((item) => item.row),
  };
}
