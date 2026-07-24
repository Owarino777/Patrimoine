# ADR-003 — Aucun float pour l’argent

- Statut : accepté
- Date : 2026-07-24

## Décision

Les montants monétaires utilisent des unités mineures entières ou un type Decimal exact.

## Conséquence

Tout calcul financier doit préciser la devise et les règles d’arrondi.
