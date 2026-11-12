import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Building2 } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import {
  formatDate,
  getClientDetail,
  getClientIds,
  LEVEL_LABEL,
} from '@/lib/crm';

export function generateStaticParams() {
  return getClientIds().map((clientId) => ({ clientId }));
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F6F7F9] p-4">
      <dt className="text-xs text-[#667085]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[#172033]">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-5 sm:flex-col sm:items-start sm:gap-3 sm:p-6">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${className}`}
      >
        {label}
      </span>
      <p className="ml-auto text-4xl font-semibold tracking-tight text-[#172033] sm:ml-0 sm:text-5xl">
        {value}
      </p>
    </div>
  );
}

type PageProps = { params: Promise<{ clientId: string }> };

// Squelette affiché pendant la lecture de l'identifiant dans l'URL
function DetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-32 rounded-[10px] bg-white/60" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-[10px] bg-white/60" />
        <div className="h-24 rounded-[10px] bg-white/60" />
        <div className="h-24 rounded-[10px] bg-white/60" />
      </div>
      <div className="h-56 rounded-[10px] bg-white/60" />
    </div>
  );
}

// La page ne lit pas params : elle le passe, sans l'attendre, à un enfant
// placé dans <Suspense>, pour garder le reste de la page dans le prefetch.
export default function ClientDetailPage({ params }: PageProps) {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <BackButton />
      <Suspense fallback={<DetailSkeleton />}>
        <ClientDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function ClientDetailContent({ params }: PageProps) {
  const { clientId } = await params;
  const detail = getClientDetail(clientId);
  if (!detail) notFound();

  const { client, stats, summary, history, opportunities } = detail;

  const summaryGroups = summary
    ? [
        { label: 'Projets importants', items: summary.important_projects },
        {
          label: 'Besoins précédemment exprimés',
          items: summary.expressed_needs,
        },
        {
          label: 'Évolutions ou signaux récents',
          items: summary.recent_signals,
        },
        {
          label: 'Sujets méritant une attention particulière',
          items: summary.attention_points,
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      {/* A. En-tête client */}
      <Card>
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
              {client.name}
            </h1>
            <p className="text-sm text-[#667085]">
              {client.sector} • {client.country}
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3">
          <Fact label="Responsable commercial" value={client.account_manager} />
          <Fact
            label="Statut de la relation"
            value={client.relationship_status}
          />
          <Fact label="Dernière mise à jour" value={client.last_updated} />
        </dl>
      </Card>

      {/* B. Indicateurs client */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat
          label="Projets actifs"
          value={stats.projects}
          className="bg-[#2686C9]/10 text-[#2686C9]"
        />
        <Stat
          label="Opportunités détectées"
          value={stats.opportunitiesDetected}
          className="bg-[#EFE9FC] text-[#6542C2]"
        />
        <Stat
          label="Opportunités à qualifier"
          value={stats.opportunitiesToQualify}
          className="bg-[#F4A340]/10 text-[#F4A340]"
        />
      </div>

      {/* C. Synthèse intelligente du client */}
      <Card
        title="Ce qu'il faut savoir sur ce client"
        className="bg-linear-to-br from-white via-white/50 to-transparent"
      >
        {summary ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/70 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-[#172033]">
                Situation commerciale
              </h3>
              <p className="mt-1 text-sm text-[#667085]">{summary.situation}</p>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {summaryGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl bg-white/70 p-4 sm:p-5"
                >
                  <h3 className="text-sm font-semibold text-[#172033]">
                    {group.label}
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#667085]">
            Aucune synthèse disponible pour ce client dans le jeu de données de
            démonstration.
          </p>
        )}
      </Card>

      {/* E et F. Opportunités commerciales */}
      <Card title="Opportunités commerciales">
        {opportunities.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="flex flex-col gap-3 rounded-2xl bg-[#F6F7F9] p-4 sm:p-5"
              >
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={opportunity.status} />
                  <PriorityBadge priority={opportunity.priority} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#172033]">
                    {opportunity.title}
                  </h3>
                  <p className="text-sm text-[#667085]">
                    {opportunity.category}
                  </p>
                </div>
                <dl className="space-y-1 text-sm text-[#667085]">
                  <div className="flex gap-1">
                    <dt>Potentiel indicatif :</dt>
                    <dd className="text-[#172033]">
                      {opportunity.estimated_potential
                        ? LEVEL_LABEL[opportunity.estimated_potential]
                        : 'Non renseigné'}
                    </dd>
                  </div>
                  <div className="flex gap-1">
                    <dt>Dernier signal :</dt>
                    <dd className="text-[#172033]">
                      {opportunity.lastSignalDate
                        ? formatDate(opportunity.lastSignalDate)
                        : 'Aucun'}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/sales/junior/opportunites/${opportunity.id}`}
                  className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#6542C2] px-5 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90 sm:w-fit"
                >
                  Analyser l&apos;opportunité
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#667085]">
            Aucune opportunité détectée pour ce client.
          </p>
        )}
      </Card>

      {/* D. Historique et contexte */}
      <Card title="Historique et contexte">
        {history.length > 0 ? (
          <ol className="space-y-4 border-l border-[#E6E9EF] pl-5">
            {history.map((item) => (
              <li
                key={`${item.date}-${item.event}`}
                className="relative flex flex-col gap-1 sm:flex-row sm:gap-4"
              >
                <span className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-[#6542C2]" />
                <span className="shrink-0 text-sm font-medium text-[#172033] sm:w-24">
                  {formatDate(item.date)}
                </span>
                <span className="text-sm text-[#667085]">{item.event}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-[#667085]">
            Aucun événement enregistré pour ce client.
          </p>
        )}
      </Card>
    </div>
  );
}
