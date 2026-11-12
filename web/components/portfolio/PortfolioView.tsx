'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Search, X } from 'lucide-react';
import ClientPills from '@/components/clients/ClientPills';
import Pagination from '@/components/ui/Pagination';
import type { Portfolio } from '@/lib/portfolio';
import { normalize } from '@/lib/text';

const PAGE_SIZE = 6;

const noopSubscribe = () => () => {};

// Date du jour côté navigateur uniquement (vide pendant le rendu serveur)
function ConsultationDate() {
  const today = useSyncExternalStore(
    noopSubscribe,
    () =>
      new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    () => '',
  );

  return (
    <p className="min-h-7 rounded-full bg-[#F6F7F9] px-4 py-1.5 text-sm text-[#667085] first-letter:uppercase">
      {today && `Consulté le ${today}`}
    </p>
  );
}

function Kpi({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl bg-white p-4 sm:p-6">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
      >
        {label}
      </span>
      <p className="text-4xl font-semibold tracking-tight text-[#172033] sm:text-5xl">
        {value}
      </p>
    </div>
  );
}

export default function PortfolioView({ clients, kpis }: Portfolio) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLElement>(null);

  const search = normalize(query.trim());
  const filtered = search
    ? clients.filter((client) => normalize(client.name).includes(search))
    : clients;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Une nouvelle recherche revient toujours à la première page
  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* B. En-tête principal */}
      <section className="rounded-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-[#667085] sm:text-base">
              Vue consolidée de vos comptes et opportunités commerciales.
            </p>
          </div>
          <ConsultationDate />
        </div>
      </section>

      {/* C. Indicateurs synthétiques */}
      <section
        aria-label="Indicateurs"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <Kpi
          label="Clients suivis"
          value={kpis.clients}
          className="bg-slate-100 text-[#667085]"
        />
        <Kpi
          label="Opportunités détectées"
          value={kpis.opportunitiesDetected}
          className="bg-[#EFE9FC] text-[#6542C2]"
        />
        <Kpi
          label="Opportunités à qualifier"
          value={kpis.opportunitiesToQualify}
          className="bg-[#F4A340]/10 text-[#F4A340]"
        />
        <Kpi
          label="Rendez-vous à préparer"
          value={kpis.meetingsToPrepare}
          className="bg-[#2FA66A]/10 text-[#2FA66A]"
        />
      </section>

      {/* D. Liste des clients */}
      <section
        ref={listRef}
        className="scroll-mt-4 rounded-3xl bg-white p-5 sm:p-6 lg:p-7"
      >
        <div className="mb-4 flex items-baseline justify-between gap-3 sm:mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-[#172033] sm:text-2xl">
            Mes clients
          </h2>
          <p aria-live="polite" className="text-sm text-[#667085]">
            {filtered.length} / {clients.length} clients
          </p>
        </div>

        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-3 rounded-full bg-[#F6F7F9] px-4 py-2.5 sm:max-w-md">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Rechercher un client par son nom..."
              aria-label="Rechercher un client par son nom"
              className="w-full bg-transparent text-sm text-[#172033] outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery('')}
                aria-label="Effacer la recherche"
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {visible.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {visible.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/sales/clients/${client.id}`}
                  className="group flex flex-col gap-3 rounded-2xl bg-[#F6F7F9] p-4 transition-colors duration-300 ease-out hover:bg-[#EFE9FC] sm:p-5 lg:flex-row lg:items-center lg:gap-6"
                >
                  <div className="flex min-w-0 items-center gap-3 lg:w-[30%]">
                    <div className="shrink-0 rounded-2xl bg-white p-2.5 text-slate-600">
                      <Building2 size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#172033]">
                        {client.name}
                      </p>
                      <p className="truncate text-sm text-[#667085]">
                        {client.sector} • {client.country}
                      </p>
                    </div>
                  </div>

                  <ClientPills stats={client.stats} className="lg:flex-1" />

                  <div className="flex items-center justify-between gap-3 lg:w-[22%]">
                    <p className="text-sm text-[#667085]">
                      <span className="lg:block">Responsable</span>{' '}
                      <span className="font-medium text-[#172033]">
                        {client.account_manager}
                      </span>
                    </p>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-[#F6F7F9] p-6 text-center text-sm text-[#667085]">
            Aucun client trouvé pour &quot;{query}&quot;.
          </p>
        )}

        <div className="mt-5">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            from={start + 1}
            to={start + visible.length}
            total={filtered.length}
            onPageChange={goToPage}
          />
        </div>
      </section>
    </div>
  );
}