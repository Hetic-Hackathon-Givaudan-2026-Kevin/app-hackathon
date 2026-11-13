// Vérifie la cohérence du jeu de données de démonstration.
// Usage : npm run check:data
import { readFileSync } from 'node:fs';

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../data/json/${name}.json`, import.meta.url)),
  );

const clients = read('clients');
const projects = read('projects');
const opportunities = read('opportunities');
const signals = read('signals');
const meetings = read('meetings');
const insights = read('clients-insights');
const questions = read('suggested-questions');
const justifications = read('opportunity-justifications');
const practices = read('good-practices');

const errors = [];
const warnings = [];

const clientIds = new Set(clients.map((item) => item.id));
const opportunityIds = new Set(opportunities.map((item) => item.id));

function uniqueIds(label, rows) {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.id))
      errors.push(`${label} : identifiant en double ${row.id}`);
    seen.add(row.id);
  }
}

function belongsToClient(label, rows) {
  for (const row of rows) {
    if (!clientIds.has(row.client_id))
      errors.push(`${label} ${row.id ?? ''} : client inconnu ${row.client_id}`);
  }
}

function belongsToOpportunity(label, rows) {
  for (const row of rows) {
    if (row.opportunity_id && !opportunityIds.has(row.opportunity_id))
      errors.push(
        `${label} ${row.id ?? ''} : opportunité inconnue ${row.opportunity_id}`,
      );
  }
}

uniqueIds('clients', clients);
uniqueIds('projets', projects);
uniqueIds('opportunités', opportunities);
uniqueIds('signaux', signals);
uniqueIds('rendez-vous', meetings);

belongsToClient('projet', projects);
belongsToClient('opportunité', opportunities);
belongsToClient('rendez-vous', meetings);
belongsToClient('questions', questions);

belongsToOpportunity('signal', signals);
belongsToOpportunity('rendez-vous', meetings);
belongsToOpportunity('questions', questions);
belongsToOpportunity('justification', justifications);

// Une opportunité s'appuie sur au moins un signal (règle du cahier des charges)
for (const opportunity of opportunities) {
  const count = signals.filter(
    (s) => s.opportunity_id === opportunity.id,
  ).length;
  if (count === 0)
    errors.push(`opportunité ${opportunity.id} : aucun signal déclencheur`);
  if (!justifications.some((j) => j.opportunity_id === opportunity.id))
    warnings.push(`opportunité ${opportunity.id} : aucune justification`);
}

// Trois questions au moins par opportunité outillée
for (const set of questions) {
  if (!set.opportunity_id) continue;
  if (!Array.isArray(set.questions) || set.questions.length < 3)
    errors.push(`questions ${set.id} : moins de 3 questions`);
}

// Les compteurs affichés doivent correspondre aux tables
for (const client of clients) {
  const actual = {
    projectsCount: projects.filter(
      (p) => p.client_id === client.id && p.status === 'actif',
    ).length,
    opportunitiesDetected: opportunities.filter(
      (o) => o.client_id === client.id && o.status === 'detectee',
    ).length,
    opportunitiesToQualify: opportunities.filter(
      (o) => o.client_id === client.id && o.status === 'a_qualifier',
    ).length,
  };
  for (const [key, value] of Object.entries(actual)) {
    if (client[key] !== undefined && client[key] !== value)
      warnings.push(
        `client ${client.id} : ${key} annoncé ${client[key]}, calculé ${value}`,
      );
  }
  if (!insights.some((i) => i.client_id === client.id))
    warnings.push(`client ${client.id} : aucune synthèse`);
}

if (practices.length === 0) warnings.push('aucune bonne pratique');

for (const warning of warnings) console.warn(`avertissement : ${warning}`);
for (const error of errors) console.error(`erreur : ${error}`);

console.log(
  `\n${clients.length} clients • ${projects.length} projets • ${opportunities.length} opportunités • ${signals.length} signaux • ${meetings.length} rendez-vous`,
);
console.log(
  errors.length === 0
    ? `Données cohérentes${warnings.length > 0 ? ` (${warnings.length} avertissement(s))` : ''}.`
    : `${errors.length} erreur(s) à corriger.`,
);

process.exit(errors.length === 0 ? 0 : 1);
