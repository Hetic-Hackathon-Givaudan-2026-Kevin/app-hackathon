'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowLeft, Building2 } from 'lucide-react';
import clientsData from '@/data/json/clients.json';
import { getClientStats } from '@/lib/stats';

interface Client {
  id: string;
  name: string;
  sector: string;
  country: string;
  account_manager: string;
  relationship_status: string;
  last_updated: string;
  projectsCount: number;
  opportunitiesDetected: number;
  opportunitiesToQualify: number;
}

const clients = clientsData as Client[];
const SEARCH_DELAY_MS = 300;

// Ignore la casse et les accents : « nestle » trouve « Nestlé »
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function SearchBar() {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isDesktopOpen, setIsDesktopOpen] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const hasQuery = query.trim() !== '';

  // Petit délai avant de filtrer, pour afficher le squelette de chargement
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(query),
      hasQuery ? SEARCH_DELAY_MS : 0,
    );
    return () => clearTimeout(timer);
  }, [query, hasQuery]);

  const isLoading = hasQuery && query !== debouncedQuery;

  const results = useMemo(() => {
    const search = normalize(debouncedQuery.trim());
    if (!search) return [];
    return clients
      .filter(
        (client) =>
          normalize(client.name).includes(search) ||
          normalize(client.sector).includes(search) ||
          normalize(client.country).includes(search),
      )
      .map((client) => ({ ...client, stats: getClientStats(client) }));
  }, [debouncedQuery]);

  // Fermer le menu desktop en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopRef.current &&
        !desktopRef.current.contains(event.target as Node)
      ) {
        setIsDesktopOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={desktopRef}>
      {/* 1. Mobile et tablette (< lg) : bouton + modale plein écran */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Ouvrir la recherche"
          className="flex items-center justify-center rounded-full border border-slate-100 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Search size={18} />
        </button>

        {isMobileOpen && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex flex-col bg-white p-4 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  setQuery('');
                }}
                aria-label="Fermer"
                className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex flex-1 items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  autoFocus
                  className="w-full bg-transparent text-sm outline-none"
                  type="text"
                  placeholder="Rechercher un client, secteur, pays..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Effacer la recherche"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-4">
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex animate-pulse items-center gap-3 p-3"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200"></div>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                        <div className="h-3 w-1/2 rounded bg-slate-100"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasQuery && results.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {results.map((client) => (
                    <li key={client.id}>
                      <Link
                        href={`/sales/clients/${client.id}`}
                        onClick={() => {
                          setIsMobileOpen(false);
                          setQuery('');
                        }}
                        className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 rounded-full bg-slate-100 p-2.5 text-slate-600">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-slate-900">
                              {client.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {client.sector} • {client.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="rounded-full bg-[#EFE9FC] px-2 py-0.5 text-xs font-medium text-[#6542C2]">
                            {client.stats.opportunitiesDetected} détectées
                          </span>
                          <span className="rounded-full bg-[#F4A340]/10 px-2 py-0.5 text-xs font-medium text-[#F4A340]">
                            {client.stats.opportunitiesToQualify} à qualifier
                          </span>
                          <span className="rounded-full bg-[#2686C9]/10 px-2 py-0.5 text-xs font-medium text-[#2686C9]">
                            {client.stats.projects} projets
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : hasQuery ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Aucun client trouvé pour &quot;{query}&quot;
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-400">
                  Commencez à taper pour rechercher un compte Givaudan...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Desktop (lg et +) : barre complète + liste déroulante */}
      <div className="relative hidden w-full max-w-2xl lg:flex">
        <div className="flex w-full items-center bg-white gap-4 rounded-full p-1 px-2 pl-3.5">
          <input
            className="w-full lg:w-70 bg-transparent text-sm outline-none"
            type="text"
            placeholder="Rechercher un client..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDesktopOpen(true);
            }}
            onFocus={() => setIsDesktopOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsDesktopOpen(false);
              if (e.key === 'Enter' && !isLoading && results[0]) {
                router.push(`/sales/clients/${results[0].id}`);
                setIsDesktopOpen(false);
                setQuery('');
              }
            }}
          />
          <button
            type="button"
            aria-label="Lancer la recherche"
            className="shrink-0 rounded-full bg-foreground p-1.5 text-white transition-opacity hover:opacity-90"
          >
            <Search size={18} />
          </button>
        </div>

        {isDesktopOpen && hasQuery && (
          <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-2">
                <div className="flex animate-pulse items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200"></div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="h-3 w-3/4 rounded bg-slate-200"></div>
                    <div className="h-2 w-1/2 rounded bg-slate-100"></div>
                  </div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                {results.map((client) => (
                  <li key={client.id}>
                    <Link
                      href={`/sales/clients/${client.id}`}
                      onClick={() => setIsDesktopOpen(false)}
                      className="flex items-center justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-600">
                          <Building2 size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {client.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {client.sector} • {client.country}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-1">
                        <span
                          className="rounded bg-[#EFE9FC] px-1.5 py-0.5 text-[10px] font-medium text-[#6542C2]"
                          title="Opportunités détectées"
                        >
                          {client.stats.opportunitiesDetected} dét.
                        </span>
                        <span
                          className="rounded bg-[#F4A340]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#F4A340]"
                          title="À qualifier"
                        >
                          {client.stats.opportunitiesToQualify} qual.
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                Aucun client trouvé pour &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
