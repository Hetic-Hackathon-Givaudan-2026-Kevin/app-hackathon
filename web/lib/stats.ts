import projectsData from '@/data/json/projects.json';
import opportunitiesData from '@/data/json/opportunities.json';
import type { Client, Opportunity, Project } from '@/lib/crm';

const projects = projectsData as Project[];
const opportunities = opportunitiesData as Opportunity[];

export interface ClientStats {
  projects: number;
  opportunitiesDetected: number;
  opportunitiesToQualify: number;
}

// Chiffres calculés depuis les tables projects et opportunities.
// À défaut de données détaillées, on garde le résumé de clients.json.
export function getClientStats(client: Client): ClientStats {
  const activeProjects = projects.filter(
    (project) => project.client_id === client.id && project.status === 'actif',
  );
  const clientOpportunities = opportunities.filter(
    (opportunity) => opportunity.client_id === client.id,
  );

  if (activeProjects.length === 0 && clientOpportunities.length === 0) {
    return {
      projects: client.projectsCount,
      opportunitiesDetected: client.opportunitiesDetected,
      opportunitiesToQualify: client.opportunitiesToQualify,
    };
  }

  return {
    projects: activeProjects.length,
    opportunitiesDetected: clientOpportunities.length,
    opportunitiesToQualify: clientOpportunities.filter(
      (opportunity) => opportunity.status === 'a_qualifier',
    ).length,
  };
}