'use client'

import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { commonFeatures } from '@/data/data'; // Sans l'extension .js en TS (ajuste le chemin si besoin)
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

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  return (
    <header className="w-full">
      <div className="flex justify-between items-center p-4 lg:p-3.5 max-w-7xl mx-auto">
        
        {/* Section Gauche : Bouton Menu (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Ouvrir le menu de navigation"
            className="p-1.5 rounded-full bg-white shadow-sm hover:bg-slate-100 transition-colors lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-bold tracking-wide">GIVAUDAN</span>
        </div>

        <SearchBar/>

        {/* Section Droite : Bouton Déconnexion (desktop) */}
        <button
          type="button"
          className="max-lg:hidden bg-foreground p-1.5 px-3 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Déconnexion
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <nav className="lg:hidden bg-white mx-4 mb-4 p-4 rounded-2xl shadow-lg border border-slate-100">
          <ul className="flex flex-col gap-2">
            {(commonFeatures as FeatureItem[]).map((item) => (
              <li key={item.id}>
                <a
                  href={item.route}
                  onClick={closeMenu}
                  className="block p-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
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