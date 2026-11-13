'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { commonFeatures } from '@/data/data'; // Sans l'extension .js en TS (ajuste le chemin si besoin)
import { useRole } from '@/lib/use-role';
import SearchBar from './SearchBar';

// Définition du type correspondant à tes objets dans data.js
interface FeatureItem {
  id: string;
  name: string;
  pageName: string;
  route: string;
  description: string;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const role = useRole();

  // La recherche porte sur le portefeuille clients : elle n'a pas de sens
  // dans l'espace Recherche & Développement, qui ne suit pas de comptes.
  const showSearch = role !== 'rd';

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-3.5">
        {/* Section Gauche : Bouton Menu (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Ouvrir le menu de navigation"
            className="rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-slate-100 lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-bold tracking-wide">GIVAUDAN</span>
        </div>

        {showSearch && <SearchBar />}

        {/* Section Droite : Bouton Déconnexion (desktop) */}
        <Link href="/">
          <button
            type="button"
            className="bg-foreground rounded-full p-1.5 px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 max-lg:hidden"
          >
            Déconnexion
          </button>
        </Link>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <nav className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-2">
            {(commonFeatures as FeatureItem[]).map((item) => (
              <li key={item.id}>
                <a
                  href={item.route}
                  onClick={closeMenu}
                  className="block rounded-lg p-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-black"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
