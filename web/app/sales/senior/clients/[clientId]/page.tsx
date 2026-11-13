import ClientDetailView from '@/components/clients/ClientDetailView';
import { getClientIds } from '@/lib/crm';

export function generateStaticParams() {
  return getClientIds().map((clientId) => ({ clientId }));
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  return <ClientDetailView params={params} role="senior" />;
}
