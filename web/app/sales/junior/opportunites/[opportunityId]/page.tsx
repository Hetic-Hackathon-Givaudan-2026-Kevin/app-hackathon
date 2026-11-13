import OpportunityDetailView from '@/components/opportunity/OpportunityDetailView';
import { getOpportunityIds } from '@/lib/crm';

export function generateStaticParams() {
  return getOpportunityIds().map((opportunityId) => ({ opportunityId }));
}

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  return <OpportunityDetailView params={params} role="junior" />;
}
