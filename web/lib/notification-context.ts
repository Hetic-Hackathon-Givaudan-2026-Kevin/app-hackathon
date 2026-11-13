import clientsData from '@/data/json/clients.json';
import opportunitiesData from '@/data/json/opportunities.json';
import { getBriefs } from '@/lib/briefs';
import type { Client, Opportunity } from '@/lib/crm';
import type { NotificationContext } from '@/lib/notifications';

// Libellés des opportunités et correspondance avec les briefs, préparés côté
// serveur : les notifications n'ont alors plus qu'à nommer ce qui a changé.
export function getNotificationContext(): NotificationContext {
  const clients = clientsData as Client[];
  const opportunities = opportunitiesData as Opportunity[];

  const names = new Map(clients.map((client) => [client.id, client.name]));

  return {
    opportunities: Object.fromEntries(
      opportunities.map((opportunity) => [
        opportunity.id,
        {
          title: opportunity.title,
          clientName: names.get(opportunity.client_id) ?? '',
        },
      ]),
    ),
    briefByOpportunity: Object.fromEntries(
      getBriefs().map((brief) => [brief.opportunity.id, brief.id]),
    ),
  };
}
