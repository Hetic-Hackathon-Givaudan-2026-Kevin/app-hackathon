import SeniorDashboardView from '@/components/portfolio/SeniorDashboardView';
import { getSeniorDashboard } from '@/lib/senior';

export default function IndexSenior() {
  const { toReview, kpis } = getSeniorDashboard();

  return <SeniorDashboardView toReview={toReview} kpis={kpis} />;
}
