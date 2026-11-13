import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import MeetingReport from '@/components/copilot/MeetingReport';
import { getCopilotContext, getCopilotIds } from '@/lib/copilot';
import { getFollowUpPractice } from '@/lib/practices';

type PageProps = { params: Promise<{ opportunityId: string }> };

export function generateStaticParams() {
  return getCopilotIds().map((opportunityId) => ({ opportunityId }));
}

function ReportSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-40 rounded-3xl bg-white/60" />
      <div className="h-96 rounded-3xl bg-white/60" />
    </div>
  );
}

export default function ReportMeetingPage({ params }: PageProps) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<ReportSkeleton />}>
        <ReportMeetingContent params={params} />
      </Suspense>
    </>
  );
}

async function ReportMeetingContent({ params }: PageProps) {
  const { opportunityId } = await params;
  const context = getCopilotContext(opportunityId);
  if (!context) notFound();

  return (
    <MeetingReport
      client={context.client}
      opportunity={context.opportunity}
      objective={context.objective}
      questions={context.questions}
      practice={getFollowUpPractice()}
    />
  );
}
