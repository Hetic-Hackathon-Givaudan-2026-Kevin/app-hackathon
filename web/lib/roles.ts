// Un seul endroit pour les routes de chaque profil : les composants partagés
// (portefeuille, copilote, compte rendu) ne connaissent plus /sales/junior.

export type Role = 'junior' | 'senior' | 'rd';

export const ROLE_LABEL: Record<Role, string> = {
  junior: 'Commercial junior',
  senior: 'Commercial senior',
  rd: 'Recherche & Développement',
};

export const ROLE_PERSON: Record<Role, string> = {
  junior: 'Camille Lellouche',
  senior: 'Israel Adesanya',
  rd: 'Stéphane Ko',
};

// Photos des profils, dans web/public/
export const ROLE_PHOTO: Record<Role, string> = {
  junior: '/camille.avif',
  senior: '/israel.avif',
  rd: '/stephane.avif',
};

const BASE: Record<Role, string> = {
  junior: '/sales/junior',
  senior: '/sales/senior',
  rd: '/sales/rd',
};

export function roleBase(role: Role): string {
  return BASE[role];
}

// Rôle déduit de l'URL courante, pour les composants client partagés
export function roleFromPath(pathname: string): Role {
  if (pathname.startsWith(BASE.senior)) return 'senior';
  if (pathname.startsWith(BASE.rd)) return 'rd';
  return 'junior';
}

export function routes(role: Role) {
  const base = BASE[role];
  return {
    home: base,
    clients: `${base}/clients`,
    client: (clientId: string) => `${base}/clients/${clientId}`,
    opportunity: (opportunityId: string) =>
      `${base}/opportunites/${opportunityId}`,
    appointments: `${base}/appointment`,
    prepare: (opportunityId: string) =>
      `${base}/appointment/prepare/${opportunityId}`,
    debrief: (opportunityId: string) =>
      `${base}/appointment/debrief/${opportunityId}`,
    report: (opportunityId: string) =>
      `${base}/appointment/report/${opportunityId}`,
    practices: `${base}/good-practices`,
    // Propre au senior
    review: `${base}/revue`,
    reviewItem: (opportunityId: string) => `${base}/revue/${opportunityId}`,
    // Propre à la R&D
    briefs: `${base}/briefs`,
    brief: (meetingId: string) => `${base}/briefs/${meetingId}`,
  };
}
