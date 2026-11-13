Sillage

Projet du Givaudan AI Innovation Challenge 2026, défi 01 : « La relation commerciale à l'ère de l'IA ».

Brief

Un commercial Givaudan doit à la fois construire une relation de qualité, comprendre des besoins souvent flous et collecter des informations critiques pour les équipes créatives. Ces trois missions se disputent le même rendez-vous : prendre des notes dégrade l'écoute, et un brief incomplet oblige l'évaluateur à rappeler.

Sillage est un copilote IA qui prépare le commercial avant le rendez-vous , l'aide a aiguiller le client pendant le rendez-vous et optimise la transmission des données après le rendez-vous

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Lancer la tranche verticale

docker compose up --build

Puis http://localhost:3000 — choisissez un profil : Camille (junior),
Israel (senior) ou Stéphane (R&D).

## Ce qui est simulé

- **Les données** sont fictives mais cohérentes : 12 clients, 18 opportunités,
  27 projets, 18 signaux et 11 rendez-vous, reliés entre eux et vérifiés par
  `npm run check:data`. Aucune connexion à Pegasus, Atlas ou Salesforce.
- **L'« IA » n'est pas un modèle de langage.** Les questions suggérées sont
  rédigées à l'avance par opportunité ; le compte rendu est produit par des
  règles métier (`lib/report.ts`) à partir de la checklist et des notes ; les
  équipes concernées sont déduites du secteur et de mots-clés.
- **La persistance est locale au navigateur.** Relectures des seniors, notes de
  rendez-vous et comptes rendus validés sont gardés dans le navigateur, pas sur
  un serveur. Ils ne sont donc pas partagés entre postes.
- **Pas d'authentification.** Le changement de profil se fait par la page
  d'accueil.
- **Le service FastAPI de l'équipe Data n'est pas encore branché.** La couche
  d'accès aux données (`lib/`) est le point de raccordement prévu.

Ce qui n'est pas simulé : le parcours complet, les relations entre les données,
les compteurs calculés depuis les tables, la traçabilité des signaux
(fait / hypothèse / à confirmer) et la boucle senior → junior → R&D.