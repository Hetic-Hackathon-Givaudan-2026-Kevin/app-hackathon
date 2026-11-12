// Logique pure (sans données) : utilisée côté navigateur par le Meeting Copilot.
// Pour le prototype, le compte rendu est produit par des règles simples,
// pas par un modèle de langage.

export const CHECKLIST = [
  'Objectifs du client',
  'Besoin réel',
  'Contraintes techniques',
  'Contraintes budgétaires',
  'Calendrier',
  'Critères de décision',
] as const;

export type ChecklistItem = (typeof CHECKLIST)[number];

export interface ReportInput {
  clientName: string;
  clientSector: string;
  opportunity: { title: string; category: string };
  objective: string;
  questions: { question: string; info_sought: ChecklistItem }[];
  answers: string[]; // une réponse (éventuellement vide) par question
  checked: ChecklistItem[];
  notes: string;
}

export interface ReportSection {
  id: string;
  title: string;
  text: string;
}

const NEEDS: ChecklistItem[] = ['Objectifs du client', 'Besoin réel'];
const CONSTRAINTS: ChecklistItem[] = [
  'Contraintes techniques',
  'Contraintes budgétaires',
  'Calendrier',
  'Critères de décision',
];

const bullets = (lines: string[]) =>
  lines.map((line) => `- ${line}`).join('\n');

export function buildReport(input: ReportInput): ReportSection[] {
  const { checked, notes } = input;
  const missing = CHECKLIST.filter((item) => !checked.includes(item));

  const answered = input.questions
    .map((question, index) => ({
      info: question.info_sought,
      answer: (input.answers[index] ?? '').trim(),
    }))
    .filter((item) => item.answer);

  const answersFor = (infos: ChecklistItem[]) =>
    answered.filter((item) => infos.includes(item.info));

  const needs = [
    ...answersFor(NEEDS).map((item) => `${item.info} : ${item.answer}`),
    ...NEEDS.filter(
      (item) =>
        checked.includes(item) &&
        !answersFor(NEEDS).some((answer) => answer.info === item),
    ).map((item) => `${item} : précisé pendant le rendez-vous (voir notes)`),
  ];

  const constraints = [
    ...answersFor(CONSTRAINTS).map((item) => `${item.info} : ${item.answer}`),
    ...CONSTRAINTS.filter(
      (item) =>
        checked.includes(item) &&
        !answersFor(CONSTRAINTS).some((answer) => answer.info === item),
    ).map((item) => `${item} : précisé pendant le rendez-vous (voir notes)`),
  ];

  // Opportunité à confirmer ou à écarter : règle simple sur la checklist
  let verdict: string;
  if (checked.includes('Besoin réel') && checked.length >= 4) {
    verdict =
      "À confirmer : le besoin est vérifié auprès du client. Recommandation : passer l'opportunité au statut « Confirmée ».";
  } else if (checked.length <= 1) {
    verdict =
      "À confirmer ou à écarter : presque aucune information n'a été collectée. Recommandation : reprogrammer un échange avant de décider, ou écarter l'opportunité si le besoin ne se confirme pas.";
  } else {
    verdict =
      "À confirmer : le besoin n'est que partiellement vérifié. Recommandation : garder l'opportunité « À qualifier » et compléter les informations manquantes.";
  }

  const actions = [
    ...missing.slice(0, 3).map((item) => `Obtenir : ${item.toLowerCase()}`),
    missing.length === 0
      ? 'Transmettre le brief aux équipes concernées'
      : 'Envoyer au client un message résumant ce qui a été compris',
  ];

  const teams = new Set<string>();
  const sector = input.clientSector.toLowerCase();
  teams.add(
    /cosm|parfum|hygi/.test(sector)
      ? 'Parfumerie : créateurs et évaluateurs'
      : 'Arômes : créateurs et évaluateurs',
  );
  if (
    checked.includes('Contraintes techniques') ||
    answersFor(['Contraintes techniques']).length > 0
  ) {
    teams.add('Application technique et R&D');
  }
  if (
    checked.includes('Contraintes budgétaires') ||
    answersFor(['Contraintes budgétaires']).length > 0
  ) {
    teams.add('Pricing et finance');
  }
  if (
    /certif|naturel|sucre|sel\b|réglement/i.test(
      `${input.opportunity.title} ${input.opportunity.category}`,
    )
  ) {
    teams.add('Réglementaire');
  }

  const summary = [
    `Rendez-vous avec ${input.clientName} au sujet de « ${input.opportunity.title} ».`,
    `Objectif : ${input.objective}`,
    `Informations collectées : ${checked.length} sur ${CHECKLIST.length}.`,
    notes.trim() ? `Notes : ${notes.trim().slice(0, 300)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return [
    { id: 'resume', title: 'Résumé du rendez-vous', text: summary },
    {
      id: 'besoins',
      title: 'Besoins identifiés',
      text:
        needs.length > 0
          ? bullets(needs)
          : 'Aucun besoin confirmé pour le moment.',
    },
    {
      id: 'contraintes',
      title: 'Contraintes communiquées',
      text:
        constraints.length > 0
          ? bullets(constraints)
          : 'Aucune contrainte communiquée pour le moment.',
    },
    {
      id: 'manquantes',
      title: 'Informations encore manquantes',
      text:
        missing.length > 0
          ? bullets([...missing])
          : 'Toutes les informations de la checklist ont été collectées.',
    },
    {
      id: 'verdict',
      title: 'Opportunité à confirmer ou à écarter',
      text: verdict,
    },
    {
      id: 'actions',
      title: 'Prochaines actions recommandées',
      text: bullets(actions),
    },
    {
      id: 'equipes',
      title: 'Équipes internes potentiellement concernées',
      text: bullets([...teams]),
    },
  ];
}