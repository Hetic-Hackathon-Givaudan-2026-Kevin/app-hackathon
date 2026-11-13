'use client';

import { useState } from 'react';
import { CLIENT_LOGOS } from '@/lib/logos';

// Pastille d'identité d'un client.
//
// Par défaut : un monogramme (initiales + teinte stable tirée du nom).
// Pour afficher un vrai logo, déposez le fichier dans public/logos/ et
// ajoutez son chemin dans lib/logos.ts : le composant le prend alors, et
// retombe sur le monogramme si l'image ne charge pas.

// Teintes douces, accordées à la charte (fond clair, texte foncé)
const TONES = [
  'bg-[#E8EDF5] text-[#2F4A6B]',
  'bg-[#EAF2E8] text-[#3A5A3A]',
  'bg-[#F6EDE4] text-[#6B4A2F]',
  'bg-[#EFEAF5] text-[#4C3A6B]',
  'bg-[#FBEDEF] text-[#6B3A45]',
  'bg-[#E8F1F3] text-[#2F5A63]',
  'bg-[#F3F1E4] text-[#5A552F]',
  'bg-[#ECEEF2] text-[#3B4454]',
];

function toneFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return TONES[hash % TONES.length];
}

// « Maison Nova Drinks » → MN • « Nestlé » → NE • « L'Occitane » → LO
function initialsFor(name: string): string {
  const words = name
    .replace(/[''`-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 || /\d/.test(word));

  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const SIZES = {
  xs: { box: 'size-6 rounded-lg text-[9px]', img: 'p-1' },
  sm: { box: 'size-9 rounded-xl text-[11px]', img: 'p-1.5' },
  md: { box: 'size-11 rounded-2xl text-xs', img: 'p-2' },
  lg: { box: 'size-14 rounded-2xl text-sm', img: 'p-2.5' },
};

export default function ClientLogo({
  clientId,
  name,
  size = 'md',
  className = '',
}: {
  clientId: string;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const source = CLIENT_LOGOS[clientId];
  const style = SIZES[size];

  if (source && !failed) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center bg-white shadow-[0_1px_2px_rgba(23,32,51,0.06)] ${style.box} ${style.img} ${className}`}
      >
        {/* Logo fourni par l'équipe : image simple, pas d'optimisation requise */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={source}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center font-semibold tracking-wide ${toneFor(name)} ${style.box} ${className}`}
    >
      {initialsFor(name)}
    </span>
  );
}
