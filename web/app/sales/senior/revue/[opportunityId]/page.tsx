import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ReviewWorkspace from '@/components/senior/ReviewWorkspace';
import { getReviewContext, getReviewIds } from '@/lib/senior';

export function generateStaticParams() {
  return getReviewIds().map((opportunityId) => ({ opportunityId }));
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
      <div className="h-28 rounded-[28px] bg-white/60" />
      <div className="h-96 rounded-[28px] bg-white/60" />
    </div>
  );
}

export default function ReviewPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ReviewContent params={params} />
    </Suspense>
  );
}

async function ReviewContent({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  const context = getReviewContext(opportunityId);
  if (!context) notFound();

  return <ReviewWorkspace context={context} />;
}
