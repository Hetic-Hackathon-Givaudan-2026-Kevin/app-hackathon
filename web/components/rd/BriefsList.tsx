'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import {
  DotNumber,
  LimeTag,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { BriefRow } from '@/lib/briefs';
import { useValidatedReports } from '@/lib/reports-store';
import { routes } from '@/lib/roles';
import { normalize } from '@/lib/text';
import Reveal from '@/components/ui/Reveal';

const rd = routes('rd');
const PAGE_SIZE = 6;

export function BriefCard({
  brief,
  isNew,
}: {
  brief: BriefRow;
  isNew: boolean;
}) {
  return (
    <Link
      href={rd.brief(brief.id)}
      className={`${softTile} group flex h-full flex-col gap-4 p-4 transition-colors duration-300 hover:bg-white`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          title={brief.date}
          className="flex w-16 shrink-0 flex-col items-center gap-1 rounded-[18px] bg-[#F3F4F6] px-2 py-2.5"
        >
          <DotNumber className="text-2xl">{brief.day}</DotNumber>
          <span className="text-[11px] text-[#667085]">{brief.month}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-[#172033]">{brief.client.name}</p>
            {isNew && <LimeTag>Nouveau</LimeTag>}
          </div>
          <p className="truncate text-sm text-[#172033]">
            {brief.opportunity.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
            {brief.summary || 'Aucun résumé enregistré.'}
          </p>
        </div>
        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {brief.teams.map((team) => (
          <SoftTag key={team}>{team}</SoftTag>
        ))}
      </div>
    </Link>
  );
}

export default function BriefsList({
  briefs,
  title = 'Briefs reçus',
}: {
  briefs: BriefRow[];
  title?: string;
}) {
  const reports = useValidatedReports();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLElement>(null);

  const search = normalize(query.trim());
  const filtered = search
    ? briefs.filter((brief) =>
        normalize(
          `${brief.client.name} ${brief.opportunity.title} ${brief.teams.join(' ')}`,
        ).includes(search),
      )
    : briefs;

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
    <section ref={topRef} className={`scroll-mt-4 ${softCard} min-w-0`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
        <div className="flex items-center gap-3">
          <h2 className={sectionTitle}>{title}</h2>
          <LimeTag>{briefs.length}</LimeTag>
        </div>
        <p aria-live="polite" className="text-sm text-[#667085]">
          {filtered.length} affiché{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(23,32,51,0.05)] sm:mb-5 sm:max-w-md">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Rechercher un client, un sujet, une équipe..."
          aria-label="Rechercher un brief"
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

      {visible.length > 0 ? (
        <ul className="grid gap-3 xl:grid-cols-2">
          {visible.map((brief, position) => (
            <Reveal key={brief.id} index={position} className="min-w-0">
              <BriefCard
                brief={brief}
                isNew={reports[brief.opportunity.id] !== undefined}
              />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className={`${softTile} p-6 text-center text-sm text-[#667085]`}>
          Aucun brief ne correspond à cette recherche.
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
  );
}
