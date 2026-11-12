import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import MeetingDebrief from '@/components/copilot/MeetingDebrief';
import { getCopilotContext, getCopilotIds } from '@/lib/copilot';

type PageProps = { params: Promise<{ opportunityId: string }> };

export function generateStaticParams() {
  return getCopilotIds().map((opportunityId) => ({ opportunityId }));
}

function DebriefSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-40 rounded-3xl bg-white/60" />
      <div className="h-80 rounded-3xl bg-white/60" />
    </div>
  );
}

export default function DebriefMeetingPage({ params }: PageProps) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<DebriefSkeleton />}>
        <DebriefMeetingContent params={params} />
      </Suspense>
    </>
  );
}

async function DebriefMeetingContent({ params }: PageProps) {
  const { opportunityId } = await params;
  const context = getCopilotContext(opportunityId);
  if (!context) notFound();

  return (
    <MeetingDebrief
      client={context.client}
      opportunity={context.opportunity}
      questions={context.questions}
    />
  );
}
