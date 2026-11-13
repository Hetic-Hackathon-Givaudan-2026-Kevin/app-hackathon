import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import {
  DotNumber,
  ghostButton,
  glowCard,
  LimeTag,
  mutedButton,
  pageTitle,
  primaryButton,
  sectionTitle,
  softCard,
  softTile,
  Stat,
} from '@/components/ui/Soft';
import { getMeetings, type MeetingRow } from '@/lib/meetings';
import { routes } from '@/lib/roles';

const r = routes('junior');

function DateTile({ meeting }: { meeting: MeetingRow }) {
  return (
    <div
      title={meeting.date}
      className="flex w-16 shrink-0 flex-col items-center gap-1 rounded-[18px] bg-[#F3F4F6] px-2 py-2.5"
    >
      <DotNumber className="text-2xl">{meeting.day}</DotNumber>
      <span className="text-[11px] text-[#667085]">{meeting.month}</span>
    </div>
  );
}

function MeetingHeading({ meeting }: { meeting: MeetingRow }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-[#172033]">{meeting.client.name}</p>
        <StatusBadge status={meeting.opportunity.status} />
      </div>
      <Link
        href={r.opportunity(meeting.opportunity.id)}
        className="text-sm text-[#172033] underline decoration-[#172033]/20 underline-offset-4 transition-colors hover:decoration-[#172033]"
      >
        {meeting.opportunity.title}
      </Link>
      <p className="mt-1 text-sm text-[#667085]">{meeting.objective}</p>
    </div>
  );
}

export default function AppointmentPage() {
  const { toPrepare, done } = getMeetings();
  const next = toPrepare.find((meeting) => meeting.hasCopilot) ?? null;
  const last = done[0] ?? null;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Titre et indicateurs */}
      <section className="flex flex-col gap-5">
        <div>
          <h1 className={pageTitle}>Mes rendez-vous</h1>
          <p className="mt-2 text-sm text-[#667085] sm:text-base">
            Préparez vos prochains échanges, puis complétez-les juste après.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <Stat
            value={toPrepare.length + done.length}
            label="Total"
            highlight
          />
          <Stat value={toPrepare.length} label="À préparer" />
          <Stat value={done.length} label="Réalisés" />
        </div>
      </section>

      {/* B. Prochain rendez-vous et dernier compte rendu */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {next && (
          <section
            className={`${glowCard} glow-orange flex min-h-64 flex-col justify-between gap-6`}
          >
            <p className="text-sm text-[#172033]">Prochain rendez-vous</p>
            <div className="flex flex-col items-center gap-2 text-center">
              <DotNumber light className="text-7xl">
                {next.day}
              </DotNumber>
              <p className="text-sm">
                {next.month} • {next.client.name}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-[#172033]">{next.opportunity.title}</p>
              <Link
                href={r.prepare(next.opportunity.id)}
                className={ghostButton}
              >
                Préparer
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}
        {last && (
          <section
            className={`${glowCard} glow-green flex min-h-64 flex-col justify-between gap-6`}
          >
            <p className="text-sm text-[#172033]">Dernier compte rendu</p>
            <div className="flex flex-col items-center gap-2 text-center">
              <DotNumber light className="text-7xl">
                {last.day}
              </DotNumber>
              <p className="text-sm">
                {last.month} • {last.client.name}
              </p>
            </div>
            <p className="text-sm">
              {last.summary || 'Aucun compte rendu enregistré.'}
            </p>
          </section>
        )}
      </div>

      {/* C. Rendez-vous à préparer */}
      <section className={softCard}>
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <h2 className={sectionTitle}>À préparer</h2>
          <LimeTag>{toPrepare.length}</LimeTag>
        </div>
        {toPrepare.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {toPrepare.map((meeting) => (
              <li
                key={meeting.id}
                className={`${softTile} flex flex-col gap-4 p-4 lg:flex-row lg:items-center`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <DateTile meeting={meeting} />
                  <MeetingHeading meeting={meeting} />
                </div>
                {meeting.hasCopilot && (
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Link
                      href={r.debrief(meeting.opportunity.id)}
                      className={mutedButton}
                    >
                      Compléter après le RDV
                    </Link>
                    <Link
                      href={r.prepare(meeting.opportunity.id)}
                      className={primaryButton}
                    >
                      Préparer
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#667085]">
            Aucun rendez-vous à préparer.
          </p>
        )}
      </section>

      {/* D. Rendez-vous réalisés */}
      <section className={softCard}>
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <h2 className={sectionTitle}>Rendez-vous réalisés</h2>
          <LimeTag>{done.length}</LimeTag>
        </div>
        {done.length > 0 ? (
          <ul className="grid gap-3 xl:grid-cols-2">
            {done.map((meeting) => (
              <li
                key={meeting.id}
                className={`${softTile} flex flex-col gap-4 p-4`}
              >
                <div className="flex min-w-0 items-start gap-4">
                  <DateTile meeting={meeting} />
                  <MeetingHeading meeting={meeting} />
                </div>
                <div className="rounded-[18px] bg-[#F3F4F6] p-4">
                  <h3 className="text-xs text-[#667085]">Compte rendu</h3>
                  <p className="mt-1 text-sm text-[#172033]">
                    {meeting.summary || 'Aucun compte rendu enregistré.'}
                  </p>
                  {meeting.nextActions.length > 0 && (
                    <>
                      <h3 className="mt-3 text-xs text-[#667085]">
                        Prochaines actions
                      </h3>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#172033]">
                        {meeting.nextActions.map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#667085]">Aucun rendez-vous réalisé.</p>
        )}
      </section>

      <p className="text-xs text-[#667085]">
        Prototype : rendez-vous fictifs, repris du jeu de données de
        démonstration.
      </p>
    </div>
  );
}
