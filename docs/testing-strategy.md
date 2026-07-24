# Stratégie de tests

## Pyramide

- nombreux tests unitaires ;
- tests d’intégration ciblés ;
- quelques parcours E2E critiques.

## Tests unitaires

- Money ;
- Percentage ;
- calcul de valeur de position ;
- calcul d’allocation ;
- calcul d’écart ;
- projection mensuelle ;
- inflation ;
- frais ;
- validations métier.

## Tests d’intégration

- repository PostgreSQL ;
- RLS ;
- création de portefeuille ;
- création de compte ;
- ajout de position ;
- suppression ;
- export.

## Tests E2E

1. Inscription et création du portefeuille.
2. Ajout d’un Livret A et d’un PEA.
3. Ajout d’une position ETF.
4. Consultation de l’allocation.
5. Création d’une projection.
6. Enregistrement d’une décision.

## Accessibilité

- axe automatisé ;
- clavier ;
- focus ;
- zoom 200 % et 400 % ;
- NVDA sur les parcours principaux ;
- alternative textuelle des graphiques.

## CI

- format ;
- lint ;
- typecheck ;
- tests unitaires ;
- tests d’intégration ;
- build ;
- tests accessibilité smoke ;
- audit dépendances.
