# ADR-007 — Supabase derrière des adapters

- Statut : proposé
- Date : 2026-07-24

## Décision

Supabase peut fournir PostgreSQL et l’authentification, mais son SDK ne doit pas être utilisé dans le domaine.

## Conséquence

Les accès passent par des repositories et adapters remplaçables.
