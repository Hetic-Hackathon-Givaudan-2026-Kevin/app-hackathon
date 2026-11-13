// Logos des clients.
//
// Tant qu'une entrée est absente, l'application affiche un monogramme
// (initiales + teinte stable). Pour afficher un vrai logo :
//   1. déposez le fichier dans web/public/logos/ (SVG de préférence, sinon PNG
//      sur fond transparent) ;
//   2. ajoutez la ligne correspondante ci-dessous, la clé étant l'identifiant
//      du client dans data/json/clients.json.
//
// Exemple :
//   '1': '/logos/maison-nova-drinks.svg',
//
// Rien d'autre à modifier : la pastille bascule automatiquement, et retombe
// sur le monogramme si le fichier est introuvable.

export const CLIENT_LOGOS: Record<string, string> = {};
