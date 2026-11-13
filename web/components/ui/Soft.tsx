// Briques visuelles communes aux écrans Rendez-vous, Bonnes pratiques et
// Meeting Copilot : cartes translucides, pastilles, grands chiffres.

export const softCard =
  'rounded-[28px] border border-white/80 bg-white/55 p-5 shadow-[0_18px_40px_-28px_rgba(23,32,51,0.35)] backdrop-blur-xl sm:p-6';

export const softTile =
  'rounded-[22px] bg-white/90 shadow-[0_1px_2px_rgba(23,32,51,0.05)]';

export const glowCard =
  'relative overflow-hidden rounded-[28px] p-5 text-white shadow-[0_24px_50px_-30px_rgba(23,32,51,0.55)] sm:p-6';

// Même carte, texte foncé : pour les dégradés clairs (rose)
export const glowCardInk =
  'relative overflow-hidden rounded-[28px] p-5 text-[#172033] shadow-[0_24px_50px_-30px_rgba(23,32,51,0.55)] sm:p-6';

export const primaryButton =
  'flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#172033] px-6 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-85 disabled:opacity-60';

export const ghostButton =
  'flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.08)] transition-colors duration-300 hover:bg-[#F3F4F6] disabled:opacity-60';

export const mutedButton =
  'flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#F3F4F6] px-5 text-sm font-medium text-[#172033] transition-colors duration-300 hover:bg-[#E9EBEF]';

// État « fait » d'un bouton principal (ex. compte rendu validé)
export const doneButton =
  'flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#E6F03C] px-6 text-sm font-medium text-[#172033]';

export const pageTitle =
  'text-3xl font-normal tracking-tight text-[#172033] sm:text-4xl lg:text-5xl';

export const sectionTitle =
  'text-xl font-normal tracking-tight text-[#172033] sm:text-2xl';

export function LimeTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-[#E6F03C] px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-[#172033]">
      {children}
    </span>
  );
}

export function SoftTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-white px-2.5 py-0.5 text-[11px] whitespace-nowrap text-[#667085] shadow-[0_1px_2px_rgba(23,32,51,0.06)]">
      {children}
    </span>
  );
}

// Grand chiffre (police de l'app). light : blanc, pour les cartes à dégradé.
export function DotNumber({
  children,
  light = false,
  className = 'text-4xl',
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`leading-none font-medium tracking-tight tabular-nums ${light ? 'text-white' : 'text-[#172033]'} ${className}`}
    >
      {children}
    </span>
  );
}

// Chiffre + pastille, comme une ligne d'indicateurs
export function Stat({
  value,
  label,
  highlight = false,
}: {
  value: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-1">
      <DotNumber className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
        {value}
      </DotNumber>
      {highlight ? <LimeTag>{label}</LimeTag> : <SoftTag>{label}</SoftTag>}
    </div>
  );
}
