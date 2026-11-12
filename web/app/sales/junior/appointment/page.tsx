import Link from 'next/link';
import { ArrowRight, Building2, Target } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { getUpcomingMeetings } from '@/lib/appointments';
import { formatDate } from '@/lib/crm';

// Un clic ouvre le détail de l'opportunité liée au rendez-vous
const opportunityHref = (opportunityId: string) =>
  `/sales/junior/opportunites/${opportunityId}`;

const MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

// Date AAAA-MM-JJ lue sans fuseau : évite tout décalage d'un jour
function dayAndMonth(isoDate: string) {
  const [, month, day] = isoDate.split('-').map(Number);
  return { day, month: MONTHS[month - 1] };
}

export default function AppointmentPage() {
  const meetings = getUpcomingMeetings();

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <section className="rounded-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
              Rendez-vous à venir
            </h1>
            <p className="mt-1 text-sm text-[#667085] sm:text-base">
              Vos rendez-vous prévus avec les clients. Ouvrez-en un pour voir
              l&apos;opportunité concernée.
            </p>
          </div>
          <p className="w-fit rounded-full bg-[#F6F7F9] px-4 py-1.5 text-sm text-[#667085]">
            {meetings.length}{' '}
            {meetings.length > 1 ? 'rendez-vous prévus' : 'rendez-vous prévu'}
          </p>
        </div>
      </section>

      {meetings.length > 0 ? (
        <ul className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          {meetings.map((meeting) => {
            const { day, month } = dayAndMonth(meeting.date);
            return (
              <li key={meeting.id} className="min-w-0">
                <Link
                  href={opportunityHref(meeting.opportunity.id)}
                  aria-label={`Rendez-vous du ${formatDate(meeting.date)} avec ${meeting.client.name} : ${meeting.opportunity.title}`}
                  className="group flex h-full gap-4 rounded-3xl bg-white p-5 transition-colors duration-300 ease-out hover:bg-[#EFE9FC] sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#EFE9FC] text-[#6542C2] transition-colors group-hover:bg-white sm:size-18"
                  >
                    <span className="text-2xl leading-none font-semibold">
                      {day}
                    </span>
                    <span className="mt-1 text-xs font-medium">{month}</span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm text-[#667085]">
                        <span className="truncate">
                          <span className="font-medium text-[#172033]">
                            {meeting.client.name}
                          </span>{' '}
                          • {meeting.client.sector}
                        </span>
                      </p>
                      <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#172033]">
                        {meeting.opportunity.title}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={meeting.opportunity.status} />
                      <PriorityBadge priority={meeting.opportunity.priority} />
                    </div>

                    <p className="flex items-start gap-2 text-sm text-[#667085]">
                      <Target
                        size={16}
                        className="mt-0.5 shrink-0 text-[#6542C2]"
                      />
                      {meeting.objective}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-medium text-[#6542C2]">
                      Voir l&apos;opportunité
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-[#667085]">
          Aucun rendez-vous prévu pour le moment.
        </p>
      )}
    </div>
  );
}
