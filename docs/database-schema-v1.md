# Schéma PostgreSQL v1

## Objectif

Fournir une base cohérente, auditable et sécurisée pour le MVP Patrimoine, sans coupler le domaine à Supabase.

## Source de vérité

PostgreSQL est la source de vérité. Supabase fournit l’hébergement, Auth et l’application des politiques RLS, mais les règles métier restent décrites par les migrations versionnées.

## Principes retenus

- UUID pour les identifiants métier.
- `bigint` en unités monétaires mineures pour les montants.
- `numeric(38,18)` pour les quantités fractionnées.
- Devise ISO 4217 explicite sur chaque valeur monétaire.
- `timestamptz` pour les événements et horodatages techniques.
- Clés étrangères, contraintes `check`, unicité et index dès le départ.
- RLS activée et forcée sur toutes les tables exposées.
- Accès refusé par défaut ; politiques explicites pour le rôle `authenticated`.
- Aucun accès du rôle `anon` aux données métier.
- Tables d’audit non modifiables par le client.

## Tables

| Table | Responsabilité |
|---|---|
| `profiles` | Profil applicatif lié à `auth.users` |
| `portfolios` | Racine d’agrégat appartenant à un utilisateur |
| `financial_accounts` | Livret A, LDDS, PEA, CTO, PER, portefeuille crypto, espèces |
| `assets` | Référentiel global ou actifs personnalisés privés |
| `positions` | Position d’un actif dans un compte |
| `transactions` | Historique manuel des mouvements |
| `allocation_targets` | Objectifs d’allocation en points de base |
| `projection_scenarios` | Hypothèses déterministes de projection |
| `investment_decisions` | Journal de décisions |
| `decision_sources` | Sources associées à une décision |
| `audit_logs` | Traçabilité des opérations sensibles |

## Invariants protégés en base

- Un compte appartient à un portefeuille.
- Une position et une transaction utilisent un compte du même portefeuille.
- Les quantités et frais ne peuvent pas être négatifs.
- Une opération d’achat ou de vente exige un actif, une quantité et un prix unitaire.
- Les allocations sont stockées en points de base entre 0 et 10 000.
- Les scénarios ont un horizon et des hypothèses bornées.
- Un actif global a `owner_user_id = null`; un actif personnalisé appartient à son créateur.
- Une position unique existe par couple compte/actif.

## Sécurité RLS

La fonction `private.owns_portfolio(uuid)` centralise la vérification de propriété. Elle est `security definer`, utilise un `search_path` vide et n’est exécutable que par le rôle authentifié.

Les politiques autorisent uniquement :

- l’accès au profil de l’utilisateur courant ;
- l’accès aux portefeuilles dont `user_id = auth.uid()` ;
- l’accès aux entités enfants d’un portefeuille possédé ;
- la lecture des actifs globaux et des actifs personnalisés propres ;
- la lecture de ses propres logs d’audit.

## Ordre des migrations

1. `20260724090000_initial_schema.sql`
2. `20260724090100_rls_policies.sql`
3. `20260724090150_privileges.sql`
4. `20260724090200_audit_triggers.sql`

## Seed

`supabase/seed.sql` ajoute uniquement quelques actifs publics de démonstration. Il ne crée aucun utilisateur et ne doit jamais être exécuté en production.

## Tests

`supabase/tests/rls_isolation.sql` vérifie notamment qu’un utilisateur ne peut ni lire ni créer de données dans le portefeuille d’un autre utilisateur.

## Évolutions prévues

- valorisations historiques séparées des positions ;
- import de transactions avec batch et idempotence ;
- catégories personnalisées ;
- agrégats de lecture pour le tableau de bord ;
- politique de rétention et pseudonymisation des audits ;
- tests pgTAP intégrés à la CI lorsque le socle applicatif sera initialisé.
