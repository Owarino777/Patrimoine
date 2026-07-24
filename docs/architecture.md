# Architecture cible du MVP

## Style

Monolithe modulaire avec principes hexagonaux.

## Règle de dépendance

Les dépendances vont vers le domaine.

```text
UI / API -> Application -> Domaine
Infrastructure -> Ports du domaine/application
```

Le domaine ne dépend pas de React, Next.js, Supabase ou PostgreSQL.

## Modules initiaux

- identity
- portfolios
- accounts
- assets
- positions
- allocations
- projections
- decisions

`market-intelligence` est réservé à une phase ultérieure.

## Structure proposée

```text
src/
├── app/
├── modules/
│   ├── identity/
│   ├── portfolios/
│   ├── accounts/
│   ├── assets/
│   ├── positions/
│   ├── allocations/
│   ├── projections/
│   └── decisions/
├── shared/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── ui/
└── tests/
```

Chaque module peut contenir :

```text
module/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

## API

REST versionnée sous `/api/v1`.

Contrats documentés avec OpenAPI.

## Persistance

PostgreSQL.

Supabase peut être utilisé pour l’authentification et la base, mais uniquement derrière des adapters.

## Calculs financiers

- entiers pour les montants monétaires usuels ;
- décimaux exacts pour quantités fractionnées ;
- aucune virgule flottante pour l’argent ;
- moteur de projection pur et testable ;
- hypothèses explicites.

## IA

L’IA peut :

- résumer une source ;
- expliquer une projection ;
- classifier un événement ;
- proposer des questions d’analyse.

L’IA ne peut pas :

- calculer les montants officiels ;
- modifier les données sans validation ;
- acheter ou vendre ;
- produire une recommandation automatique présentée comme certaine.
