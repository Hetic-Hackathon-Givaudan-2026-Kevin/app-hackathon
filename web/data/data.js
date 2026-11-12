export const commonFeatures = [
  {
    id: 'portfolio-dashboard',
    name: 'Portefeuille clients',
    pageName: 'Tableau de Bord / Portefeuille',
    route: '/dashboard',
    description:
      'Affichage de la liste des clients, statuts et cartes statistiques globales.',
  },
  {
    id: 'opportunity-radar',
    name: "Détection d'opportunités",
    pageName: 'Fiche Client & Radar',
    route: '/clients/[id]',
    description:
      'Visualisation des opportunités par pastilles colorées, signaux déclencheurs et potentiel financier.',
  },
  {
    id: 'meeting-assistant',
    name: 'Préparation des rendez-vous',
    pageName: 'Assistant de Rendez-vous',
    route: '/meetings/prepare',
    description:
      'Checklist intelligente de questions suggérées avec leurs justifications.',
  },
  {
    id: 'meeting-report',
    name: 'Compte rendu',
    pageName: 'Compte Rendu de Rendez-vous',
    route: '/meetings/report',
    description:
      'Formulaire de fin de rendez-vous prérempli, modifiable et validable.',
  },
];
