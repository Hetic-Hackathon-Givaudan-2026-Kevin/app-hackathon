import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import MeetingCopilot from '@/components/copilot/MeetingCopilot';
import { getCopilotContext, getCopilotIds } from '@/lib/copilot';

type PageProps = { params: Promise<{ opportunityId: string }> };

export function generateStaticParams() {
  return getCopilotIds().map((opportunityId) => ({ opportunityId }));
}

function CopilotSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-64 rounded-3xl bg-white/60" />
      <div className="h-64 rounded-3xl bg-white/60" />
    </div>
  );
}

export default function PrepareMeetingPage({ params }: PageProps) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<CopilotSkeleton />}>
        <PrepareMeetingContent params={params} />
      </Suspense>
    </>
  );
}

async function PrepareMeetingContent({ params }: PageProps) {
  const { opportunityId } = await params;
  const context = getCopilotContext(opportunityId);
  if (!context) notFound();

  return <MeetingCopilot {...context} role="junior" />;
}
