# Instructions et Contexte pour les Agents IA (AGENTS.md)

Ce dépôt de code source contient le projet développé dans le cadre du **Challenge Sales de Givaudan** (hackathon d'une durée limitée à deux semaines). L'objectif est de fournir une solution innovante combinant analyse de données, intelligence artificielle et ergonomie de vente haut de gamme.

## 🛠️ Stack Technique de Référence
- **Front-end & BFF** : Next.js (TypeScript, Tailwind CSS), utilisé comme Back-End for Front-End pour centraliser les requêtes, gérer les flux et intégrer des animations fluides (GSAP, Anime.js).
- **Back-end** : FastAPI (Python 3.13), exposition d'une API REST performante, validée via Pydantic et documentée contractuellement dans `openapi.yaml`.
- **Base de Données** : PostgreSQL 17, orchestrée via Docker / Docker Compose, exploitant les types `JSONB` pour stocker les prompts et retours d'IA.
- **Outillage** : Git, Docker, ngrok pour le partage de l'application en temps réel lors des démos.

## 🤖 Directives pour l'Assistant IA
1. **Conformité architecturale** : Toute décision structurante doit respecter les Architecture Decision Records (ADR) situés dans le dossier `docs/adr/`.
2. **Contrat d'API** : Les modifications des routes FastAPI doivent impérativement rester synchronisées avec le fichier de spécification `openapi.yaml` à la racine.
3. **Contrainte de temps** : Privilégiez des solutions pragmatiques, propres, testables rapidement et adaptées à un rythme de développement intensif (hackathon de 2 semaines). Évitez la sur-ingénierie non justifiée.
4. **Qualité du code** : Assurez-vous du typage strict (TypeScript côté front, type hints Python + Pydantic côté back).