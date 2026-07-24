# ADR-010 — Socle Next.js en monolithe modulaire

- Statut : accepté
- Date : 2026-07-24

## Contexte

Le MVP doit fournir une application web accessible, testable et simple à déployer sans introduire de microservices ni coupler le domaine à Next.js ou Supabase.

## Décision

1. Utiliser Next.js avec l’App Router et TypeScript strict.
2. Conserver une seule application déployable pour le MVP.
3. Organiser le code par responsabilités : `domain`, `application`, `infrastructure`, `app` et `config`.
4. Interdire les dépendances de framework dans le domaine.
5. Valider les variables d’environnement au démarrage côté serveur.
6. Utiliser Vitest pour les tests unitaires et de composants.
7. Valider le contrat OpenAPI, le lint, le typage, les tests et le build dans GitHub Actions.
8. Conserver les composants serveur par défaut et n’introduire des composants client que lorsqu’une interaction l’exige.
9. Ne placer aucun secret dans les variables publiques `NEXT_PUBLIC_*`.

## Conséquences

### Positives

- Déploiement et développement simples.
- Frontières métier explicites.
- Socle compatible avec une extraction future de modules.
- Contrôles automatiques dès chaque pull request.
- Réduction du JavaScript client initial.

### Négatives

- Mappings nécessaires entre HTTP, domaine et persistance.
- Discipline requise pour empêcher les imports transversaux.
- Le workflow utilise temporairement `npm install` jusqu’à la génération d’un lockfile vérifié.

## Vérification

- `npm run verify` réussit localement ;
- la CI réussit sur une pull request ;
- aucun import Next.js ou Supabase dans `src/domain` ;
- les tests du domaine ne nécessitent ni réseau ni base de données.
