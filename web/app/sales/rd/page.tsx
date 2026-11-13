import RdDashboard from '@/components/rd/RdDashboard';
import { getBriefs, getBriefStats } from '@/lib/briefs';

export default function IndexRd() {
  const briefs = getBriefs();

  return <RdDashboard briefs={briefs} stats={getBriefStats(briefs)} />;
}
