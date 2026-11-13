'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleSlash,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import { EvidenceBadge, PriorityBadge, StatusBadge } from '@/components/Badges';
import JuniorPreview from '@/components/senior/JuniorPreview';
import { softCard } from '@/components/ui/Soft';
import {
  confidenceLabel,
  formatDate,
  SOURCE_LABEL,
  type Priority,
} from '@/lib/crm';
import { CHECKLIST, type ChecklistItem } from '@/lib/report';
import {
  removeReview,
  saveReview,
  useReviews,
  VERDICT_CLASS,
  VERDICT_LABEL,
  type QuestionDraft,
  type Review,
  type Verdict,
} from '@/lib/review';
import { routes } from '@/lib/roles';
import type { ReviewContext } from '@/lib/senior';

const senior = routes('senior');

const card = `${softCard} min-w-0`;
const field =
  'mt-1.5 w-full resize-y rounded-2xl bg-white/90 field-sizing-content px-4 py-3 text-sm text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#6542C2]/40';
const ghostButton =
  'flex h-11 items-center justify-center gap-2 rounded-full bg-white/90 px-5 text-sm font-medium text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] transition-colors hover:bg-white';
const iconButton =
  'rounded-full bg-white/90 p-2 text-slate-400 shadow-[0_1px_2px_rgba(23,32,51,0.05)] transition-colors hover:text-[#6542C2] disabled:cursor-not-allowed disabled:opacity-30';

const VERDICTS: { value: Verdict; label: string; icon: typeof Check }[] = [
  { value: 'validee', label: 'Valider', icon: Check },
  { value: 'corrigee', label: 'Corriger', icon: Pencil },
  { value: 'ecartee', label: 'Écarter', icon: CircleSlash },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'haute', label: 'Haute' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'basse', label: 'Basse' },
];

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function ReviewWorkspace({
  context,
}: {
  context: ReviewContext;
}) {
  const reviews = useReviews();
  const saved = reviews[context.detail.opportunity.id];

  // Une relecture enregistrée arrive après l'hydratation : la clé relance
  // l'éditeur avec les valeurs retenues par le senior.
  return (
    <ReviewEditor
      key={saved ? `saved-${saved.reviewed_at}` : 'draft'}
      context={context}
      saved={saved}
    />
  );
}

function ReviewEditor({
  context,
  saved,
}: {
  context: ReviewContext;
  saved: Review | undefined;
}) {
  const { detail, objective, blocker, questions, position, total } = context;
  const { opportunity, client, signals, justification } = detail;
  const uid = useId();

  const [verdict, setVerdict] = useState<Verdict>(saved?.verdict ?? 'validee');
  const [recommendation, setRecommendation] = useState(
    saved?.recommendation ?? opportunity.next_action,
  );
  const [priority, setPriority] = useState<Priority>(
    saved?.priority ?? opportunity.priority,
  );
  const [reason, setReason] = useState(saved?.reason ?? '');
  const [coaching, setCoaching] = useState(saved?.coaching ?? '');
  const [drafts, setDrafts] = useState<QuestionDraft[]>(
    saved?.questions ??
      questions.map((question, index) => ({
        id: `ia-${index}`,
        question: question.question,
        why: question.why,
        info_sought: question.info_sought,
        kept: true,
        origin: 'ia' as const,
      })),
  );
  const [done, setDone] = useState(saved !== undefined);

  function update(index: number, patch: Partial<QuestionDraft>) {
    setDrafts((list) =>
      list.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
    setDone(false);
  }

  function touched<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDone(false);
    };
  }

  function save() {
    saveReview({
      opportunity_id: opportunity.id,
      verdict,
      recommendation: recommendation.trim(),
      priority,
      reason: reason.trim(),
      questions: drafts,
      coaching: coaching.trim(),
    });
    setDone(true);
  }

  const keptCount = drafts.filter((question) => question.kept).length;
  const removedCount = drafts.length - keptCount;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* En-tête : contexte et navigation dans la file */}
      <section className="rounded-3xl">
        <Link
          href={senior.home}
          className="inline-flex items-center gap-2 text-sm text-[#667085] transition-colors hover:text-[#6542C2]"
        >
          <ArrowLeft size={16} />
          Espace senior
        </Link>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-normal tracking-tight text-[#172033] sm:text-3xl lg:text-4xl">
              {opportunity.title}
            </h1>
            <p className="mt-1 text-sm text-[#667085] sm:text-base">
              <Link
                href={senior.client(client.id)}
                className="font-medium text-[#172033] underline-offset-4 hover:underline"
              >
                {client.name}
              </Link>{' '}
              • {client.sector} • {opportunity.category}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={opportunity.status} />
              <PriorityBadge priority={priority} />
              {saved && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${VERDICT_CLASS[saved.verdict]}`}
                >
                  {VERDICT_LABEL[saved.verdict]} le{' '}
                  {formatDate(saved.reviewed_at)}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-[#F6F7F9] px-4 py-1.5 text-sm text-[#667085] tabular-nums">
              {position} / {total}
            </span>
            {context.previousId ? (
              <Link
                href={senior.reviewItem(context.previousId)}
                aria-label="Recommandation précédente"
                className={iconButton}
              >
                <ArrowLeft size={18} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                aria-label="Recommandation précédente"
                className={iconButton}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {context.nextId ? (
              <Link
                href={senior.reviewItem(context.nextId)}
                aria-label="Recommandation suivante"
                className={iconButton}
              >
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                aria-label="Recommandation suivante"
                className={iconButton}
              >
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          {/* Sur quoi l'IA s'appuie */}
          <section aria-labelledby={`${uid}-signals`} className={card}>
            <h2
              id={`${uid}-signals`}
              className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl"
            >
              Sur quoi l&apos;IA s&apos;appuie
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Chaque élément porte sa source et son statut : un fait est tracé
              dans une source, une hypothèse reste à vérifier.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E6F03C] px-3 py-1 text-xs font-medium text-[#172033]">
              Soumise à votre avis : {context.needReason.toLowerCase()}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {signals.map((signal) => (
                <li
                  key={signal.id}
                  className="rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 text-sm text-[#172033]">
                      {signal.description}
                    </p>
                    <EvidenceBadge type={signal.evidence_type} />
                  </div>
                  <p className="mt-2 text-xs text-[#667085]">
                    {SOURCE_LABEL[signal.source_type] ?? signal.source_type} •{' '}
                    {formatDate(signal.source_date)} • Fiabilité{' '}
                    {confidenceLabel(signal.confidence).toLowerCase()}
                  </p>
                </li>
              ))}
              {signals.length === 0 && (
                <li className="rounded-[22px] bg-white/90 p-4 text-sm text-[#667085] shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
                  Aucun signal enregistré pour cette opportunité.
                </li>
              )}
            </ul>

            {justification && (
              <div className="mt-4 rounded-[22px] bg-white/90 p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#6542C2]">
                  <Sparkles size={14} />
                  Raisonnement de l&apos;IA
                </p>
                <p className="mt-1 text-sm text-[#172033]">
                  {justification.reasoning}
                </p>
                {justification.to_verify.length > 0 && (
                  <>
                    <p className="mt-3 text-xs font-medium text-[#667085]">
                      Reste à vérifier
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#667085]">
                      {justification.to_verify.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Verdict sur la recommandation */}
          <section aria-labelledby={`${uid}-verdict`} className={card}>
            <h2
              id={`${uid}-verdict`}
              className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl"
            >
              Votre verdict
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Recommandation proposée par l&apos;IA :
            </p>
            <p className="mt-2 rounded-[22px] bg-white/90 p-4 text-sm text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)]">
              {opportunity.next_action}
            </p>

            <div
              role="group"
              aria-label="Verdict"
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              {VERDICTS.map(({ value, label, icon: Icon }) => {
                const active = verdict === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setVerdict(value);
                      setDone(false);
                      if (value === 'validee') {
                        setRecommendation(opportunity.next_action);
                      }
                    }}
                    className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#6542C2] text-white'
                        : 'bg-white/90 text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.05)] hover:bg-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
            </div>

            {verdict === 'corrigee' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor={`${uid}-reco`}
                    className="text-sm font-medium text-[#172033]"
                  >
                    Recommandation corrigée
                  </label>
                  <textarea
                    id={`${uid}-reco`}
                    value={recommendation}
                    onChange={(event) =>
                      touched(setRecommendation)(event.target.value)
                    }
                    rows={4}
                    className={field}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${uid}-priority`}
                    className="text-sm font-medium text-[#172033]"
                  >
                    Priorité
                  </label>
                  <select
                    id={`${uid}-priority`}
                    value={priority}
                    onChange={(event) =>
                      touched<Priority>(setPriority)(
                        event.target.value as Priority,
                      )
                    }
                    className={`${field} h-11 resize-none py-0`}
                  >
                    {PRIORITIES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {verdict === 'ecartee' && (
              <div className="mt-4">
                <label
                  htmlFor={`${uid}-reason`}
                  className="text-sm font-medium text-[#172033]"
                >
                  Pourquoi écarter cette piste
                </label>
                <p className="text-xs text-[#667085]">
                  Le motif est ce que le junior retiendra : il apprend à
                  reconnaître une fausse piste.
                </p>
                <textarea
                  id={`${uid}-reason`}
                  value={reason}
                  onChange={(event) => touched(setReason)(event.target.value)}
                  rows={3}
                  placeholder="Ex. : le signal vient d'un échange informel, le client a déjà tranché l'an dernier."
                  className={field}
                />
              </div>
            )}
          </section>

          {/* Tri des questions proposées par l'IA */}
          {verdict !== 'ecartee' && (
            <section aria-labelledby={`${uid}-questions`} className={card}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2
                  id={`${uid}-questions`}
                  className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl"
                >
                  Questions proposées au junior
                </h2>
                <p aria-live="polite" className="text-sm text-[#667085]">
                  {keptCount} retenue{keptCount > 1 ? 's' : ''}
                  {removedCount > 0 && `, ${removedCount} retirée`}
                  {removedCount > 1 && 's'}
                </p>
              </div>
              <p className="mt-1 text-sm text-[#667085]">
                Classez-les dans l&apos;ordre où vous les poseriez, retirez
                celles qui n&apos;apportent rien et ajoutez ce qui manque.
                {blocker !== '' && (
                  <>
                    {' '}
                    Point de blocage identifié :{' '}
                    <span className="text-[#172033]">{blocker}</span>
                  </>
                )}
              </p>

              <ul className="mt-4 flex flex-col gap-3">
                {drafts.map((question, index) => (
                  <li
                    key={question.id}
                    className={`rounded-[22px] p-4 shadow-[0_1px_2px_rgba(23,32,51,0.05)] ${
                      question.kept ? 'bg-white/90' : 'bg-[#F6F7F9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#EFE9FC] px-2.5 py-0.5 text-xs font-medium text-[#6542C2]">
                          {question.origin === 'ia'
                            ? 'Proposée par l’IA'
                            : 'Ajoutée par vous'}
                        </span>
                        {!question.kept && (
                          <span className="rounded-full bg-[#D94848]/10 px-2.5 py-0.5 text-xs font-medium text-[#D94848]">
                            Retirée
                          </span>
                        )}
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDrafts((list) => move(list, index, index - 1));
                            setDone(false);
                          }}
                          disabled={index === 0}
                          aria-label="Monter la question"
                          className={iconButton}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDrafts((list) => move(list, index, index + 1));
                            setDone(false);
                          }}
                          disabled={index === drafts.length - 1}
                          aria-label="Descendre la question"
                          className={iconButton}
                        >
                          <ChevronDown size={16} />
                        </button>
                        {question.origin === 'senior' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setDrafts((list) =>
                                list.filter((_, i) => i !== index),
                              );
                              setDone(false);
                            }}
                            aria-label="Supprimer la question"
                            className={iconButton}
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              update(index, { kept: !question.kept })
                            }
                            aria-label={
                              question.kept
                                ? 'Retirer la question'
                                : 'Rétablir la question'
                            }
                            className={iconButton}
                          >
                            {question.kept ? (
                              <Trash2 size={16} />
                            ) : (
                              <Undo2 size={16} />
                            )}
                          </button>
                        )}
                      </span>
                    </div>

                    <label
                      htmlFor={`${uid}-q${index}`}
                      className="mt-3 block text-sm font-medium text-[#172033]"
                    >
                      Question {index + 1}
                    </label>
                    <textarea
                      id={`${uid}-q${index}`}
                      value={question.question}
                      onChange={(event) =>
                        update(index, { question: event.target.value })
                      }
                      rows={3}
                      placeholder="Formulez la question telle que le junior la posera."
                      className={field}
                    />

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`${uid}-w${index}`}
                          className="text-sm font-medium text-[#172033]"
                        >
                          Pourquoi la poser
                        </label>
                        <textarea
                          id={`${uid}-w${index}`}
                          value={question.why}
                          onChange={(event) =>
                            update(index, { why: event.target.value })
                          }
                          rows={2}
                          placeholder="Ce que le junior doit comprendre avec cette question."
                          className={field}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${uid}-i${index}`}
                          className="text-sm font-medium text-[#172033]"
                        >
                          Information recherchée
                        </label>
                        <select
                          id={`${uid}-i${index}`}
                          value={question.info_sought}
                          onChange={(event) =>
                            update(index, {
                              info_sought: event.target.value as ChecklistItem,
                            })
                          }
                          className={`${field} h-11 resize-none py-0`}
                        >
                          {CHECKLIST.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setDrafts((list) => [
                    ...list,
                    {
                      id: `senior-${Date.now().toString(36)}`,
                      question: '',
                      why: '',
                      info_sought: CHECKLIST[0],
                      kept: true,
                      origin: 'senior',
                    },
                  ]);
                  setDone(false);
                }}
                className={`${ghostButton} mt-4 w-full sm:w-auto`}
              >
                <Plus size={16} />
                Ajouter une question
              </button>
            </section>
          )}

          {/* Conseil au junior */}
          <section aria-labelledby={`${uid}-coaching`} className={card}>
            <h2
              id={`${uid}-coaching`}
              className="text-xl font-normal tracking-tight text-[#172033] sm:text-2xl"
            >
              Votre conseil au junior
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Une ou deux phrases issues de votre expérience, affichées avant le
              rendez-vous. C&apos;est ce qu&apos;aucune donnée ne contient.
            </p>
            <label htmlFor={`${uid}-advice`} className="sr-only">
              Conseil au junior
            </label>
            <textarea
              id={`${uid}-advice`}
              value={coaching}
              onChange={(event) => touched(setCoaching)(event.target.value)}
              rows={3}
              placeholder="Ex. : chez ce client, le budget se discute avec les achats, pas avec le chef de produit."
              className={field}
            />
          </section>

          {/* Enregistrement */}
          <section className={card}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-[#667085]">
                {done
                  ? 'Relecture enregistrée. Le junior verra cette version.'
                  : 'Modifications non enregistrées.'}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {saved && (
                  <button
                    type="button"
                    onClick={() => removeReview(opportunity.id)}
                    className={ghostButton}
                  >
                    <RotateCcw size={16} />
                    Revenir à la version de l&apos;IA
                  </button>
                )}
                <button
                  type="button"
                  onClick={save}
                  disabled={done}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#6542C2] px-6 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={16} />
                  Enregistrer la relecture
                </button>
                {context.nextId && (
                  <Link
                    href={senior.reviewItem(context.nextId)}
                    className={ghostButton}
                  >
                    Suivante
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Aperçu, collé en haut sur grand écran */}
        <div className="min-w-0 lg:sticky lg:top-4 lg:self-start">
          <JuniorPreview
            verdict={verdict}
            recommendation={recommendation}
            reason={reason}
            questions={drafts}
            coaching={coaching}
            objective={objective}
          />
        </div>
      </div>
    </div>
  );
}
