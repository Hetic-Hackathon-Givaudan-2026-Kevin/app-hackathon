'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Search, Sparkles, X } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import Pagination from '@/components/ui/Pagination';
import { softCard } from '@/components/ui/Soft';
import { useReviews, VERDICT_CLASS, VERDICT_LABEL } from '@/lib/review';
import { routes } from '@/lib/roles';
import type { ReviewItem } from '@/lib/senior';
import { normalize } from '@/lib/text';
import ClientLogo from '@/components/clients/ClientLogo';
import Reveal from '@/components/ui/Reveal';

const senior = routes('senior');

const PAGE_SIZE = 6;

type Filter = 'a_relire' | 'relues' | 'auto' | 'toutes';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'a_relire', label: 'À relire' },
  { value: 'relues', label: 'Relues' },
  { value: 'auto', label: 'Publiées d’office' },
  { value: 'toutes', label: 'Toutes' },
];

export default function ReviewQueue({
  items,
  title = 'Recommandations à relire',
  note,
  showFilter = false,
}: {
  items: ReviewItem[];
  title?: string;
  note?: React.ReactNode;
  showFilter?: boolean;
}) {
  const reviews = useReviews();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>(
    showFilter ? 'a_relire' : 'toutes',
  );
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLElement>(null);

  const reviewedCount = items.filter((item) => reviews[item.id]).length;
  const toReview = items.filter(
    (item) => item.need === 'a_relire' && !reviews[item.id],
  ).length;

  const search = normalize(query.trim());
  const filtered = items
    .filter((item) => {
      if (filter === 'a_relire')
        return item.need === 'a_relire' && !reviews[item.id];
      if (filter === 'relues') return Boolean(reviews[item.id]);
      if (filter === 'auto') return item.need === 'auto' && !reviews[item.id];
      return true;
    })
    .filter(
      (item) =>
        search === '' ||
        normalize(`${item.title} ${item.clientName}`).includes(search),
    );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Une nouvelle recherche ou un nouveau filtre revient à la première page
  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilter(value: Filter) {
    setFilter(value);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section ref={listRef} className={`scroll-mt-4 ${softCard} min-w-0`}>
      <div className="mb-4 flex items-baseline justify-between gap-3 sm:mb-5">
        <h2 className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl">
          {title}
        </h2>
        <p aria-live="polite" className="text-sm text-[#667085]">
          {toReview} en attente de votre avis • {reviewedCount} relue
          {reviewedCount > 1 ? 's' : ''}
        </p>
      </div>

      {note && (
        <p className="mb-4 flex items-start gap-2 rounded-[22px] bg-white/90 p-4 text-sm text-[#667085] shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-[#6542C2]" />
          <span>{note}</span>
        </p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(23,32,51,0.05)] sm:max-w-md sm:flex-1">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Rechercher une opportunité ou un client..."
            aria-label="Rechercher une opportunité ou un client"
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

        {showFilter && (
          <div
            role="group"
            aria-label="Filtrer les recommandations"
            className="flex gap-2"
          >
            {FILTERS.map((item) => {
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateFilter(item.value)}
                  className={`h-10 rounded-full px-4 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#6542C2] text-white'
                      : 'bg-white/90 text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {visible.map((item, position) => {
            const review = reviews[item.id];
            return (
              <Reveal key={item.id} index={position} className="min-w-0">
                <Link
                  href={senior.reviewItem(item.id)}
                  className="group flex flex-col gap-3 rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)] transition-colors duration-300 ease-out hover:bg-white sm:p-5 lg:flex-row lg:items-center lg:gap-6"
                >
                  <div className="flex min-w-0 items-center gap-3 lg:w-[34%]">
                    <ClientLogo
                      clientId={item.clientId}
                      name={item.clientName}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#172033]">
                        {item.title}
                      </p>
                      <p className="truncate text-sm text-[#667085]">
                        {item.clientName} • {item.sector}
                      </p>
                    </div>
                  </div>

                  <p className="min-w-0 text-sm text-[#667085] lg:flex-1">
                    <span className="lg:line-clamp-2">
                      {review?.verdict === 'ecartee'
                        ? review.reason || 'Piste écartée par un senior.'
                        : (review?.recommendation ?? item.recommendation)}
                    </span>
                  </p>

                  <div className="flex items-center justify-between gap-3 lg:w-[26%] lg:justify-end">
                    <div className="flex flex-wrap gap-2">
                      {review ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${VERDICT_CLASS[review.verdict]}`}
                        >
                          <BadgeCheck size={14} />
                          {VERDICT_LABEL[review.verdict]}
                        </span>
                      ) : item.need === 'auto' ? (
                        <span
                          title={item.needReason}
                          className="rounded-full bg-[#E6F03C] px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#172033]"
                        >
                          Publiée d’office
                        </span>
                      ) : (
                        <>
                          <StatusBadge status={item.status} />
                          <PriorityBadge priority={item.priority} />
                        </>
                      )}
                    </div>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl bg-[#F6F7F9] p-6 text-center text-sm text-[#667085]">
          {filter === 'a_relire' && search === ''
            ? 'Rien n’attend votre avis : les recommandations restantes sont appuyées sur des faits documentés.'
            : 'Aucune recommandation ne correspond à cette recherche.'}
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
