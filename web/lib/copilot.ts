import suggestedData from '@/data/json/suggested-questions.json';
import meetingsData from '@/data/json/meetings.json';
import projectsData from '@/data/json/projects.json';
import {
  formatDate,
  getOpportunityDetail,
  getOpportunityIds,
  SOURCE_LABEL,
} from '@/lib/crm';
import type { ChecklistItem } from '@/lib/report';

interface SuggestedSet {
  id: string;
  client_id: string;
  opportunity_id: string | null;
  objective: string;
  blocker: string;
  questions: {
    question: string;
    why: string;
    info_sought: ChecklistItem;
  }[];
}

interface Meeting {
  id: string;
  client_id: string;
  opportunity_id: string;
  objective: string;
  date: string;
  status: 'a_preparer' | 'realise';
}

export interface CopilotContext {
  client: { id: string; name: string; sector: string };
  opportunity: { id: string; title: string; category: string };
  plannedMeeting: { date: string; objective: string } | null;
  objective: string; // objectif recommandé
  blocker: string;
  known: string[];
  missing: string[];
  questions: SuggestedSet['questions'];
}

const suggested = suggestedData as SuggestedSet[];
const meetings = meetingsData as Meeting[];

export function getCopilotIds(): string[] {
  const withQuestions = new Set(suggested.map((set) => set.opportunity_id));
  return getOpportunityIds().filter((id) => withQuestions.has(id));
}

// Tout le contexte est repris des JSON : opportunité, signaux, projets, questions.
export function getCopilotContext(
  opportunityId: string,
): CopilotContext | null {
  const detail = getOpportunityDetail(opportunityId);
  const set = suggested.find((item) => item.opportunity_id === opportunityId);
  if (!detail || !set) return null;

  const { opportunity, client, signals, justification } = detail;
  const projects = projectsData
    .filter(
      (project) =>
        project.client_id === client.id && project.status === 'actif',
    )
    .map((project) => project.name);
  const planned = meetings.find(
    (meeting) =>
      meeting.opportunity_id === opportunityId &&
      meeting.status === 'a_preparer',
  );

  const known = [
    opportunity.description,
    ...signals
      .filter((signal) => signal.evidence_type === 'fait')
      .map(
        (signal) =>
          `${signal.description.replace(/\.$/, '')} (${SOURCE_LABEL[signal.source_type] ?? signal.source_type}, ${formatDate(signal.source_date)})`,
      ),
    ...(projects.length > 0
      ? [`Projets en cours : ${projects.join(', ')}`]
      : []),
  ];

  return {
    client: { id: client.id, name: client.name, sector: client.sector },
    opportunity: {
      id: opportunity.id,
      title: opportunity.title,
      category: opportunity.category,
    },
    plannedMeeting: planned
      ? { date: formatDate(planned.date), objective: planned.objective }
      : null,
    objective: set.objective,
    blocker: set.blocker,
    known,
    missing: justification?.to_verify ?? [],
    questions: set.questions,
  };
}