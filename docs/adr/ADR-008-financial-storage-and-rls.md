# ADR-008 — Stockage financier exact et isolation RLS

- Statut : accepté
- Date : 2026-07-24

## Contexte

Le MVP stocke des montants monétaires, des quantités fractionnées et des données patrimoniales privées. Les erreurs d’arrondi et les accès croisés entre utilisateurs sont inacceptables.

## Décision

1. Les montants monétaires sont stockés en unités mineures dans des colonnes `bigint`.
2. Les quantités d’actifs utilisent `numeric(38,18)`.
3. Les taux et allocations utilisent des points de base entiers.
4. Chaque donnée métier est rattachée directement ou indirectement à un portefeuille.
5. Toutes les tables exposées activent et forcent PostgreSQL Row Level Security.
6. Les politiques sont deny-by-default et reposent sur `auth.uid()`.
7. Une fonction privée `security definer` centralise la vérification de propriété d’un portefeuille, avec `search_path` vide et droits minimaux.
8. Les actifs de référence globaux sont en lecture seule pour les utilisateurs ; les actifs personnalisés restent privés.
9. Les écritures sensibles produisent une trace d’audit non modifiable par le client.

## Alternatives rejetées

### Montants en `float` ou `double precision`

Rejetés en raison des erreurs binaires d’arrondi.

### Type PostgreSQL `money`

Rejeté car son comportement dépend de la locale et convient mal aux échanges applicatifs multi-devises.

### Autorisation uniquement dans l’API Next.js

Rejetée : une erreur applicative ou un accès direct à l’API Supabase pourrait exposer des données.

### Duplication de `user_id` sur toutes les tables

Non retenue pour le MVP. Le portefeuille reste la racine d’autorisation, avec contrôle de cohérence des relations enfants.

## Conséquences

### Positives

- Calculs déterministes et testables.
- Isolation renforcée au niveau de la base.
- Modèle compatible avec Supabase sans dépendance dans le domaine.
- Traçabilité des modifications sensibles.
- Possibilité de changer d’adapter ou d’hébergeur PostgreSQL.

### Négatives

- Conversion obligatoire entre unités mineures et affichage utilisateur.
- Complexité supplémentaire pour les devises sans deux décimales et les cryptoactifs.
- Les politiques RLS doivent être testées à chaque évolution du schéma.
- La fonction `security definer` exige une revue de sécurité stricte.

## Vérification

- migrations exécutables sur une base locale propre ;
- tests d’isolation entre deux utilisateurs ;
- contraintes testées sur montants, quantités et relations ;
- revue des privilèges `anon`, `authenticated` et service role ;
- aucune colonne financière en type flottant.
