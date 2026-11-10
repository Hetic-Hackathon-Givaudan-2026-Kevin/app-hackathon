# 0003. Utiliser FastAPI pour le développement de l'API back-end

- Statut : acceptée
- Date : 2026-11-10
- Décideurs : l'équipe Back-End & Data

## Contexte

Le back-end du projet pour le **Challenge Sales de Givaudan** doit porter la logique métier liée au traitement des données de vente, communiquer avec notre base PostgreSQL 17 et interagir avec les modèles d'IA. Le délai est restreint à **deux semaines**. L'application s'appuie sur Python 3.13[cite: 1], doit tourner dans un environnement conteneurisé via Docker[cite: 1], et être facilement testable et exposée en ligne (notamment via ngrok pour les démos)[cite: 1]. Nous avons besoin d'un framework performant, doté d'une validation rigoureuse des données et d'un contrat d'interface clairement établi, formalisé par le fichier `openapi.yaml` placé à la racine du dépôt.

## Options

1. **FastAPI** : Framework Python moderne et ultra-rapide. Il propose une validation automatique des données via Pydantic, génère de lui-même une documentation interactive (Swagger/OpenAPI) exportable et synchronisée dans `openapi.yaml`, ce qui sécurise le couplage avec le front-end Next.js tout en s'alignant sur l'écosystème Python 3.13[cite: 1].
2. **Flask** : Micro-framework Python très léger, mais nécessitant l'installation et la configuration manuelle de multiples extensions (validation, sérialisation, documentation) trop chronophages pour notre délai de deux semaines.
3. **Django REST Framework** : Extrêmement puissant, mais trop lourd, rigide et surdimensionné pour un prototype rapide de hackathon.

## Décision

Nous choisissons **FastAPI** parce qu'il s'intègre parfaitement avec notre écosystème Python 3.13[cite: 1], garantit un développement rapide et sécurisé grâce à la validation Pydantic, et permet de figer le contrat d'interface de l'API via le fichier `openapi.yaml` partagé avec l'équipe front-end au sein de notre stack Docker[cite: 1].

## Conséquences

- Positives : Documentation interactive et fichier de spécification `openapi.yaml` versionné dans le dépôt, validation stricte des payloads de vente et d'IA, et excellente intégration avec les bibliothèques data en Python.
- Négatives, à accepter : Nécessite la maîtrise de la programmation asynchrone et de Pydantic par l'équipe.
- À revoir si : Le projet s'oriente vers un monolithe full-stack sans API découplée.
