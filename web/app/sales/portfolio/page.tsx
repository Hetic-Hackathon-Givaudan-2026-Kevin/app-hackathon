import ClientsGrid from '@/components/clients/ClientsGrid';
import { getPortfolio } from '@/lib/portfolio';

export default function PortfolioPage() {
  const { clients } = getPortfolio();

  return <ClientsGrid clients={clients} />;
}