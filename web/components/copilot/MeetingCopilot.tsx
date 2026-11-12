import Link from 'next/link';
import { ArrowRight, Building2, EyeOff } from 'lucide-react';
import {
  DotNumber,
  glowCard,
  LimeTag,
  pageTitle,
  primaryButton,
  sectionTitle,
  softCard,
  softTile,
  SoftTag,
} from '@/components/ui/Soft';
import type { CopilotContext } from '@/lib/copilot';

// Routes de destination : à adapter si tes pages sont ailleurs
const clientHref = (clientId: string) => `/sales/junior/clients/${clientId}`;
const opportunityHref = (opportunityId: string) =>
  `/sales/junior/opportunites/${opportunityId}`;
const debriefHref = (opportunityId: string) =>
  `/sales/junior/appointment/debrief/${opportunityId}`;

const linkClass =
  'underline decoration-[#172033]/20 underline-offset-4 transition-colors hover:decoration-[#172033]';

// Écran de préparation : à lire avant le rendez-vous, puis à fermer.
// La saisie (checklist, notes) se fait après, sur l'écran de débrief.
export default function MeetingCopilot({
  client,
  opportunity,
  plannedMeeting,
  objective,
  blocker,
  known,
  missing,
  questions,
}: CopilotContext) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Contexte du rendez-vous */}
      <section className="flex flex-col gap-4">
        <LimeTag>Meeting Copilot • Préparation</LimeTag>
        <h1 className={pageTitle}>Préparer mon rendez-vous</h1>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#667085] sm:text-base">
          <Link
            href={clientHref(client.id)}
            className={`inline-flex items-center gap-2 text-[#172033] ${linkClass}`}
          >
            <Building2 size={16} />
            {client.name}
          </Link>
          •
          <Link
            href={opportunityHref(opportunity.id)}
            className={`text-[#172033] ${linkClass}`}
          >
            {opportunity.title}
          </Link>
          {plannedMeeting && <SoftTag>Prévu le {plannedMeeting.date}</SoftTag>}
        </p>
      </section>

      {/* B. Ce qu'on sait déjà / Ce qui manque */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <section className={`${glowCard} glow-green flex flex-col gap-5`}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl">
              Ce qu&apos;on sait déjà
            </h2>
            <DotNumber className="text-6xl">{known.length}</DotNumber>
          </div>
          <ul className="mt-auto flex flex-col gap-2">
            {known.map((item) => (
              <li
                key={item}
                className="rounded-[18px] bg-white/90 px-4 py-3 text-sm text-[#172033]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={`${glowCard} glow-orange flex flex-col gap-5`}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl">
              Ce qui manque
            </h2>
            <DotNumber className="text-6xl">{missing.length}</DotNumber>
          </div>
          {missing.length > 0 ? (
            <ul className="mt-auto flex flex-col gap-2">
              {missing.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 rounded-[18px] bg-white/90 px-4 py-3 text-sm text-[#172033]"
                >
                  {item}
                  <LimeTag>À confirmer</LimeTag>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-auto rounded-[18px] bg-white/90 px-4 py-3 text-sm text-[#172033]">
              Aucune information manquante identifiée.
            </p>
          )}
        </section>
      </div>

      {/* C. Objectif recommandé */}
      <section className={softCard}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
          <h2 className={`${sectionTitle} shrink-0 lg:w-56`}>
            Objectif recommandé
          </h2>
          <div className={`${softTile} flex-1 p-5`}>
            <p className="text-base text-[#172033] sm:text-lg">{objective}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
              <LimeTag>Point à débloquer</LimeTag>
              {blocker}
            </p>
          </div>
        </div>
      </section>

      {/* D. Questions suggérées par l'IA */}
      <section className={softCard}>
        <div className="mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h2 className={sectionTitle}>{questions.length} questions à poser</h2>
          <p className="text-sm text-[#667085]">
            À répartir dans l&apos;échange, pas à réciter.
          </p>
        </div>
        <ol className="grid gap-3 lg:grid-cols-3">
          {questions.map((item, index) => (
            <li
              key={item.question}
              className={`${softTile} flex flex-col gap-3 p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <DotNumber className="text-4xl">{index + 1}</DotNumber>
                <SoftTag>{item.info_sought}</SoftTag>
              </div>
              <p className="text-base text-[#172033]">« {item.question} »</p>
              <p className="mt-auto rounded-[18px] bg-[#F3F4F6] p-3 text-sm text-[#667085]">
                <span className="text-[#172033]">Pourquoi ?</span> {item.why}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* E. Rappel « non intrusif » et suite du parcours */}
      <section className={softCard}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-start gap-3 text-sm text-[#667085]">
            <EyeOff size={18} className="mt-0.5 shrink-0 text-[#172033]" />
            <span>
              <span className="text-[#172033]">
                Fermez cet écran avant le rendez-vous.
              </span>{' '}
              Rien ne s&apos;affiche devant le client. Vous compléterez les
              informations juste après.
            </span>
          </p>
          <Link href={debriefHref(opportunity.id)} className={primaryButton}>
            Le rendez-vous a eu lieu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
