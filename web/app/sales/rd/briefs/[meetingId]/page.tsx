import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import BriefDetailView from '@/components/rd/BriefDetailView';
import { getBrief, getBriefIds } from '@/lib/briefs';

type PageProps = { params: Promise<{ meetingId: string }> };

export function generateStaticParams() {
  return getBriefIds().map((meetingId) => ({ meetingId }));
}

function BriefSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
      <div className="h-32 rounded-[28px] bg-white/60" />
      <div className="h-96 rounded-[28px] bg-white/60" />
    </div>
  );
}

export default function BriefPage({ params }: PageProps) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<BriefSkeleton />}>
        <BriefContent params={params} />
      </Suspense>
    </>
  );
}

async function BriefContent({ params }: PageProps) {
  const { meetingId } = await params;
  const brief = getBrief(meetingId);
  if (!brief) notFound();

  return <BriefDetailView brief={brief} />;
}
