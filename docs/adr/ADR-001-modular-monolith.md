# ADR-001 — Monolithe modulaire

- Statut : accepté
- Date : 2026-07-24

## Contexte

Le MVP doit être rapide à développer, simple à déployer et suffisamment structuré pour évoluer.

## Décision

Utiliser un monolithe modulaire avec frontières métier explicites.

## Alternatives

- microservices ;
- application Next.js sans structure modulaire ;
- backend séparé dès le départ.

## Conséquences

### Positives

- déploiement simple ;
- transactions locales ;
- coût réduit ;
- extraction future possible.

### Négatives

- discipline nécessaire pour préserver les frontières ;
- risque de couplage interne si les règles ne sont pas respectées.
