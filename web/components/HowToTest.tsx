'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Compass, RotateCcw, X } from 'lucide-react';
import { resetNotifications } from '@/lib/notifications';
import { resetValidatedReports } from '@/lib/reports-store';
import { resetReviews } from '@/lib/review';
import { ROLE_PERSON, type Role } from '@/lib/roles';

interface Step {
  role: Role;
  title: string;
  detail: string;
  path: string;
}

const STEPS: Step[] = [
  {
    role: 'junior',
    title: 'Partez du portefeuille',
    detail:
      'Ouvrez un client, puis une opportunité. Les signaux portent leur source, leur date et leur statut : fait, hypothèse ou à confirmer. Notez la recommandation.',
    path: 'Portefeuille clients → un client → une opportunité',
  },
  {
    role: 'senior',
    title: 'Arbitrez la recommandation',
    detail:
      'Sur la même opportunité, corrigez le texte, retirez une question, réordonnez les autres, ajoutez un conseil. L’aperçu montre en direct ce que verra le junior. Enregistrez.',
    path: 'Une opportunité → Relire et corriger',
  },
  {
    role: 'junior',
    title: 'Préparez, puis complétez',
    detail:
      'La préparation a changé : consigne corrigée, questions retenues, conseil du senior. Après le rendez-vous, cochez les informations obtenues, prenez des notes, générez le compte rendu et validez-le.',
    path: 'Rendez-vous → Préparer → Le rendez-vous a eu lieu',
  },
  {
    role: 'rd',
    title: 'Recevez le brief',
    detail:
      'Le brief arrive marqué « Nouveau », avec les sept sections validées, les prochaines actions et les équipes concernées. La cloche le signale aussi.',
    path: 'Tableau de bord → Briefs reçus',
  },
];

const ROLE_TONE: Record<Role, string> = {
  junior: 'bg-[#E8EDF5] text-[#2F4A6B]',
  senior: 'bg-[#EFEAF5] text-[#4C3A6B]',
  rd: 'bg-[#EAF2E8] text-[#3A5A3A]',
};

export default function HowToTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const reduced = useReducedMotion();

  // Fermeture à la touche Échap, et blocage du défilement de la page
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  function reset() {
    resetReviews();
    resetValidatedReports();
    resetNotifications();
    setIsReset(true);
    window.setTimeout(() => setIsReset(false), 2600);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(23,32,51,0.4)]"
      >
        <Compass size={16} strokeWidth={1.8} />
        Comment tester le parcours
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#172033]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="how-to-test-title"
              onClick={(event) => event.stopPropagation()}
              initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-[#F4F4F4] shadow-[0_24px_60px_-20px_rgba(23,32,51,0.5)] sm:rounded-[28px]"
            >
              <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
                <div>
                  <h2
                    id="how-to-test-title"
                    className="text-2xl font-normal tracking-tight text-[#172033] sm:text-3xl"
                  >
                    Comment tester le parcours
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Trois profils, une seule information qui circule. Suivez les
                    quatre étapes dans l’ordre.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer"
                  className="shrink-0 rounded-full bg-white p-2 text-[#667085] transition-colors hover:text-[#172033]"
                >
                  <X size={18} />
                </button>
              </header>

              <ol className="flex-1 space-y-3 overflow-y-auto px-6 pb-2">
                {STEPS.map((step, index) => (
                  <motion.li
                    key={`${step.role}-${index}`}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduced ? 0 : 0.08 + index * 0.07,
                      duration: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex gap-4 rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)] sm:p-5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#172033] text-sm font-medium text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_TONE[step.role]}`}
                        >
                          {ROLE_PERSON[step.role]}
                        </span>
                        <h3 className="text-base font-medium text-[#172033]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm text-[#667085]">
                        {step.detail}
                      </p>
                      <p className="mt-2 rounded-[14px] bg-[#F3F4F6] px-3 py-1.5 text-xs text-[#172033]">
                        {step.path}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <footer className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#667085]">
                  Relectures et comptes rendus sont gardés dans ce navigateur.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.08)] transition-colors hover:bg-[#EDEEF0]"
                >
                  <RotateCcw size={15} />
                  {isReset
                    ? 'Démonstration réinitialisée'
                    : 'Réinitialiser la démonstration'}
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
