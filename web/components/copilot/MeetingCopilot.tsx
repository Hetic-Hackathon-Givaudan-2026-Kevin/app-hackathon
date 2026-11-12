'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Check, FileText, Target } from 'lucide-react';
import ReportModal from '@/components/copilot/ReportModal';
import type { CopilotContext } from '@/lib/copilot';
import {
  buildReport,
  CHECKLIST,
  type ChecklistItem,
  type ReportSection,
} from '@/lib/report';

// Routes de destination : à adapter si tes pages sont ailleurs
const clientHref = (clientId: string) => `/sales/junior/clients/${clientId}`;
const opportunityHref = (opportunityId: string) =>
  `/sales/junior/opportunites/${opportunityId}`;

function Card({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl bg-white p-5 sm:p-6 lg:p-7 ${className}`}>
      {title && (
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#172033] sm:mb-5 sm:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

const fieldClass =
  'w-full resize-y rounded-2xl bg-[#F6F7F9] p-4 text-sm text-[#172033] outline-none transition-colors placeholder:text-slate-400 focus:bg-[#EFE9FC]/60';

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
  const [answers, setAnswers] = useState<string[]>(() =>
    questions.map(() => ''),
  );
  const [checked, setChecked] = useState<ChecklistItem[]>([]);
  const [notes, setNotes] = useState('');
  const [report, setReport] = useState<ReportSection[] | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  function toggle(item: ChecklistItem) {
    setChecked((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  function generate() {
    setIsReportOpen(true);
    setReport(
      buildReport({
        clientName: client.name,
        clientSector: client.sector,
        opportunity,
        objective,
        questions,
        answers,
        checked,
        notes,
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A. Contexte du rendez-vous */}
      <Card>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#EFE9FC] px-3 py-1 text-xs font-medium text-[#6542C2]">
          Meeting Copilot
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
          Préparer mon rendez-vous
        </h1>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F6F7F9] p-4">
            <dt className="text-xs text-[#667085]">Client</dt>
            <dd className="mt-1">
              <Link
                href={clientHref(client.id)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6542C2] transition-opacity hover:opacity-80"
              >
                <Building2 size={16} />
                {client.name}
              </Link>
            </dd>
          </div>
          <div className="rounded-2xl bg-[#F6F7F9] p-4">
            <dt className="text-xs text-[#667085]">Opportunité concernée</dt>
            <dd className="mt-1">
              <Link
                href={opportunityHref(opportunity.id)}
                className="text-sm font-medium text-[#6542C2] transition-opacity hover:opacity-80"
              >
                {opportunity.title}
              </Link>
            </dd>
          </div>
          <div className="rounded-2xl bg-[#F6F7F9] p-4 sm:col-span-2">
            <dt className="text-xs text-[#667085]">
              Objectif du rendez-vous
              {plannedMeeting && ` • prévu le ${plannedMeeting.date}`}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#172033]">
              {plannedMeeting?.objective ?? objective}
            </dd>
          </div>
        </dl>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-[#F6F7F9] p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#172033]">
              Informations déjà connues
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
              {known.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#F6F7F9] p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#172033]">
              Informations manquantes
            </h3>
            {missing.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
                {missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-[#667085]">
                Aucune information manquante identifiée.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-4 sm:gap-5 xl:col-span-2">
          {/* B. Objectifs recommandés */}
          <Card
            title="Objectifs recommandés"
            className="bg-linear-to-br from-[#EFE9FC] via-[#F5EEFB] to-[#FDEBDD]"
          >
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 sm:p-5">
              <Target size={20} className="mt-0.5 shrink-0 text-[#6542C2]" />
              <div>
                <p className="text-sm font-medium text-[#172033] sm:text-base">
                  {objective}
                </p>
                <p className="mt-2 text-sm text-[#667085]">
                  Point à débloquer : {blocker}
                </p>
              </div>
            </div>
          </Card>

          {/* C. Questions suggérées par l'IA */}
          <Card title="Questions suggérées">
            <ol className="flex flex-col gap-3">
              {questions.map((item, index) => (
                <li
                  key={item.question}
                  className="rounded-2xl bg-[#F6F7F9] p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#EFE9FC] px-3 py-1 text-xs font-medium text-[#6542C2]">
                      Question {index + 1}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-[#667085]">
                      Information recherchée : {item.info_sought}
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-[#172033]">
                    « {item.question} »
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    <span className="font-medium text-[#172033]">
                      Pourquoi ?
                    </span>{' '}
                    {item.why}
                  </p>
                  <label className="mt-3 block">
                    <span className="sr-only">
                      Réponse obtenue à la question {index + 1}
                    </span>
                    <textarea
                      rows={2}
                      value={answers[index]}
                      onChange={(event) =>
                        setAnswers((current) =>
                          current.map((value, position) =>
                            position === index ? event.target.value : value,
                          ),
                        )
                      }
                      placeholder="Réponse obtenue (facultatif)"
                      className={`${fieldClass} bg-white`}
                    />
                  </label>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* D. Checklist de rendez-vous */}
          <Card title="Checklist de rendez-vous">
            <ul className="flex flex-col gap-2">
              {CHECKLIST.map((item) => {
                const isChecked = checked.includes(item);
                return (
                  <li key={item}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 text-sm transition-colors duration-300 ${
                        isChecked
                          ? 'bg-[#2FA66A]/10 text-[#172033]'
                          : 'bg-[#F6F7F9] text-[#172033] hover:bg-[#EFE9FC]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6542C2] ${
                          isChecked
                            ? 'border-[#2FA66A] bg-[#2FA66A] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check size={14} />}
                      </span>
                      {item}
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-[#667085]">
              {checked.length} / {CHECKLIST.length} informations collectées
            </p>
          </Card>

          {/* E. Prise de notes */}
          <Card title="Notes du rendez-vous">
            <textarea
              rows={6}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Inscrivez ici les réponses obtenues..."
              aria-label="Notes du rendez-vous"
              className={fieldClass}
            />
          </Card>

          {/* F. Génération du compte rendu */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={generate}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6542C2] px-5 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90"
            >
              <FileText size={16} />
              {report ? 'Régénérer le compte rendu' : 'Générer le compte rendu'}
            </button>
            {report && (
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#6542C2] transition-colors duration-300 hover:bg-[#EFE9FC]"
              >
                Rouvrir le compte rendu
              </button>
            )}
          </div>
        </div>
      </div>

      {report && (
        <ReportModal
          open={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          sections={report}
          onSectionChange={(id, text) =>
            setReport((current) =>
              current
                ? current.map((item) =>
                    item.id === id ? { ...item, text } : item,
                  )
                : current,
            )
          }
          meta={{
            clientName: client.name,
            opportunityTitle: opportunity.title,
            objective: plannedMeeting?.objective ?? objective,
          }}
        />
      )}
    </div>
  );
}
