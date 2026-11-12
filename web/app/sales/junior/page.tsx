import PortfolioView from '@/components/portfolio/PortfolioView';
import { getPortfolio } from '@/lib/portfolio';
 
export default function IndexJunior() {
  const { clients, kpis } = getPortfolio();
 
  return <PortfolioView clients={clients} kpis={kpis} />;
}
 