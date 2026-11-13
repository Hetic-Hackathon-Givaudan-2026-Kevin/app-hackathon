'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import ClientPills from '@/components/clients/ClientPills';
import Pagination from '@/components/ui/Pagination';
import type { PortfolioClient } from '@/lib/portfolio';
import { useRoutes } from '@/lib/use-role';
import { normalize } from '@/lib/text';
import ClientLogo from '@/components/clients/ClientLogo';
import Reveal from '@/components/ui/Reveal';

const PAGE_SIZE = 6;

export default function ClientsGrid({
  clients,
}: {
  clients: PortfolioClient[];
}) {
  const routes = useRoutes();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLElement>(null);

  const search = normalize(query.trim());
  const filtered = search
    ? clients.filter((client) => normalize(client.name).includes(search))
    : clients;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <section ref={topRef} className="scroll-mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-normal tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
              Portefeuille clients
            </h1>
            <p className="mt-1 text-sm text-[#667085] sm:text-base">
              Tous vos comptes. Ouvrez une fiche pour voir le détail.
            </p>
          </div>
          <p
            aria-live="polite"
            className="w-fit rounded-full bg-[#F6F7F9] px-4 py-1.5 text-sm text-[#667085]"
          >
            {filtered.length} / {clients.length} clients
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(23,32,51,0.05)] sm:max-w-md">
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
      </section>

      {visible.length > 0 ? (
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((client, position) => (
            <Reveal key={client.id} index={position}>
              <Link
                href={routes.client(client.id)}
                className="group flex h-full flex-col gap-4 rounded-[28px] border border-white/80 bg-white/55 p-5 shadow-[0_18px_40px_-28px_rgba(23,32,51,0.35)] backdrop-blur-xl transition-colors duration-300 ease-out hover:bg-white/90 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <ClientLogo clientId={client.id} name={client.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold tracking-tight text-[#172033]">
                      {client.name}
                    </p>
                    <p className="truncate text-sm text-[#667085]">
                      {client.sector} • {client.country}
                    </p>
                  </div>
                </div>

                <ClientPills stats={client.stats} />

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E6E9EF] pt-4 group-hover:border-white">
                  <div className="min-w-0 text-sm text-[#667085]">
                    <p>Responsable</p>
                    <p className="truncate font-medium text-[#172033]">
                      {client.account_manager}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#172033]">
                    Voir la fiche
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-[#667085]">
          Aucun client trouvé pour &quot;{query}&quot;.
        </p>
      )}

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        from={start + 1}
        to={start + visible.length}
        total={filtered.length}
        onPageChange={goToPage}
      />
    </div>
  );
}
