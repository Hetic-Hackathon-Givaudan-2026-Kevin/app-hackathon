import meetingsData from '@/data/json/meetings.json';
import {
  getOpportunityDetail,
  type OpportunityStatus,
  type Priority,
} from '@/lib/crm';

interface Meeting {
  id: string;
  client_id: string;
  opportunity_id: string;
  objective: string;
  date: string; // AAAA-MM-JJ
  status: 'a_preparer' | 'realise';
}

export interface UpcomingMeeting {
  id: string;
  date: string; // AAAA-MM-JJ
  objective: string;
  client: { id: string; name: string; sector: string };
  opportunity: {
    id: string;
    title: string;
    status: OpportunityStatus;
    priority: Priority;
  };
}

const meetings = meetingsData as Meeting[];

// Rendez-vous prévus, du plus proche au plus lointain.
// Le client et l'opportunité sont repris des autres JSON via leurs identifiants.
export function getUpcomingMeetings(): UpcomingMeeting[] {
  return meetings
    .filter((meeting) => meeting.status === 'a_preparer')
    .flatMap((meeting) => {
      const detail = getOpportunityDetail(meeting.opportunity_id);
      if (!detail) return [];
      return [
        {
          id: meeting.id,
          date: meeting.date,
          objective: meeting.objective,
          client: {
            id: detail.client.id,
            name: detail.client.name,
            sector: detail.client.sector,
          },
          opportunity: {
            id: detail.opportunity.id,
            title: detail.opportunity.title,
            status: detail.opportunity.status,
            priority: detail.opportunity.priority,
          },
        },
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}