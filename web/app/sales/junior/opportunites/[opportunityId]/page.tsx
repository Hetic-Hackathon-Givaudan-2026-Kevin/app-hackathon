import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Building2, CalendarCheck, Sparkles } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { EvidenceBadge, PriorityBadge, StatusBadge } from '@/components/Badges';
import {
  confidenceLabel,
  formatDate,
  getOpportunityDetail,
  getOpportunityIds,
  LEVEL_LABEL,
  LEVEL_LABEL_F,
  SOURCE_LABEL,
  type Opportunity,
} from '@/lib/crm';

// Routes de destination : à adapter si tes pages sont ailleurs
const clientHref = (clientId: string) => `/sales/junior/clients/${clientId}`;
const copilotHref = (opportunityId: string) =>
  `/sales/junior/appointment/prepare/${opportunityId}`;

type PageProps = { params: Promise<{ opportunityId: string }> };

export function generateStaticParams() {
  return getOpportunityIds().map((opportunityId) => ({ opportunityId }));
}

function Card({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl bg-white p-5 sm:p-6 lg:p-7 ${className}`}>
      {title && (
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#172033] sm:mb-5 sm:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F6F7F9] p-4">
      <dt className="text-xs text-[#667085]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[#172033]">{value}</dd>
    </div>
  );
}

function feasibilityLabel(value: Opportunity['feasibility']): string {
  return value === 'a_confirmer' ? 'À confirmer' : LEVEL_LABEL_F[value];
}

function DetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-36 rounded-3xl bg-white/60" />
      <div className="h-64 rounded-3xl bg-white/60" />
    </div>
  );
}

export default function OpportunityDetailPage({ params }: PageProps) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<DetailSkeleton />}>
        <OpportunityDetailContent params={params} />
      </Suspense>
    </>
  );
}

async function OpportunityDetailContent({ params }: PageProps) {
  const { opportunityId } = await params;
  const detail = getOpportunityDetail(opportunityId);
  if (!detail) notFound();

  const { opportunity, client, signals, justification } = detail;

  return (
    <>
      {/* A. Identification */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={opportunity.status} />
          <PriorityBadge priority={opportunity.priority} />
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
          {opportunity.title}
        </h1>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F6F7F9] p-4">
            <dt className="text-xs text-[#667085]">Client associé</dt>
            <dd className="mt-1">
              <Link
                href={clientHref(client.id)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6542C2] transition-opacity hover:opacity-80"
              >
                <Building2 size={16} />
                {client.name}
              </Link>
            </dd>
          </div>
          <Metric label="Catégorie" value={opportunity.category} />
        </dl>
      </Card>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-4 sm:gap-5 xl:col-span-2">
          {/* B. Description */}
          <Card title="Description">
            <p className="text-sm text-[#667085] sm:text-base">
              {opportunity.description}
            </p>
          </Card>

          {/* C. Signaux déclencheurs */}
          <Card title="Signaux déclencheurs">
            {signals.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {signals.map((signal) => (
                  <li
                    key={signal.id}
                    className="rounded-2xl bg-[#F6F7F9] p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <EvidenceBadge type={signal.evidence_type} />
                      <span className="text-sm text-[#667085]">
                        {formatDate(signal.source_date)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#172033]">
                      {signal.description}
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      Source :{' '}
                      {SOURCE_LABEL[signal.source_type] ?? signal.source_type}
                      {' • '}Fiabilité : {confidenceLabel(signal.confidence)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#667085]">
                Aucun signal enregistré pour cette opportunité.
              </p>
            )}
          </Card>

          {/* D. Justification IA */}
          <Card
            title="Pourquoi cette opportunité est-elle intéressante ?"
            className="bg-linear-to-br from-[#EFE9FC] via-[#F5EEFB] to-[#FDEBDD]"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6542C2]">
              <Sparkles size={14} />
              Analyse de l&apos;IA, à valider par le commercial
            </p>
            {justification ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Informations utilisées
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
                    {signals.map((signal) => (
                      <li key={signal.id}>
                        {signal.description.replace(/\.$/, '')} (
                        {SOURCE_LABEL[signal.source_type] ?? signal.source_type}
                        , {formatDate(signal.source_date)})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Raisonnement
                  </h3>
                  <p className="mt-1 text-sm text-[#667085]">
                    {justification.reasoning}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Reste à vérifier
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
                    {justification.to_verify.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#667085]">
                Aucune justification disponible pour cette opportunité.
              </p>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* E. Évaluation commerciale */}
          <Card title="Évaluation commerciale">
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Metric
                label="Potentiel estimé"
                value={
                  opportunity.estimated_potential
                    ? `Indicatif : ${LEVEL_LABEL[opportunity.estimated_potential]}`
                    : 'Non renseigné'
                }
              />
              <Metric
                label="Faisabilité"
                value={feasibilityLabel(opportunity.feasibility)}
              />
              <Metric
                label="Complexité technique"
                value={LEVEL_LABEL_F[opportunity.complexity]}
              />
              <Metric label="Urgence" value="À confirmer" />
            </dl>
            <p className="mt-4 text-xs text-[#667085]">
              Ces niveaux sont des indications, jamais un montant commercial.
            </p>
          </Card>

          {/* F. Recommandation et G. Bouton principal */}
          <Card title="Recommandation">
            <p className="text-sm text-[#667085] sm:text-base">
              {opportunity.next_action}
            </p>
            <Link
              href={copilotHref(opportunity.id)}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#6542C2] px-5 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90"
            >
              <CalendarCheck size={16} />
            <p className='text-xs'>  Préparer mon rendez-vous</p>
              <ArrowRight size={16} />
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}