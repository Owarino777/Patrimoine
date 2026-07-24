# ADR-009 — API Contract First et DTO explicites

- Statut : accepté
- Date : 2026-07-24

## Contexte

Le frontend, les cas d’usage et les adapters doivent évoluer sans exposer directement les tables PostgreSQL ni les modèles Supabase. Une API improvisée pendant l’implémentation créerait des incohérences, des ruptures et un couplage technique difficile à corriger.

## Décision

1. L’API publique du MVP est définie avant son implémentation dans une spécification OpenAPI versionnée.
2. Toutes les routes métier utilisent le préfixe `/api/v1`.
3. Les DTO d’entrée, de sortie, les commandes applicatives et les entités de domaine restent distincts.
4. Les montants sont transportés en unités mineures entières avec leur devise.
5. Les quantités fractionnées sont transportées sous forme de chaînes décimales.
6. Les collections utilisent une pagination par curseur opaque.
7. Les erreurs respectent une enveloppe commune avec un code stable et un identifiant de requête.
8. Les opérations rejouables importantes acceptent une clé d’idempotence.
9. Les ressources d’un autre utilisateur sont rendues indistinguables d’une ressource inexistante.
10. La spécification ne dépend ni de Supabase ni de la structure physique de la base.

## Alternatives rejetées

### Exposer directement PostgREST ou les tables Supabase

Rejeté car cela couple le client à la persistance, expose trop facilement des détails internes et complique l’évolution des règles métier.

### Utiliser les modèles ORM comme réponses HTTP

Rejeté car les changements de persistance deviendraient automatiquement des changements de contrat.

### GraphQL dès le MVP

Non retenu : le domaine et les besoins de lecture ne justifient pas encore la complexité opérationnelle et de cache supplémentaire.

### API non versionnée

Rejetée car le produit prévoit des imports, de la fiscalité et d’autres extensions susceptibles de nécessiter des évolutions incompatibles.

## Conséquences

### Positives

- Contrats testables avant le code applicatif.
- Découplage frontend, domaine et persistance.
- Erreurs et validations cohérentes.
- Génération future possible de clients et de types.
- Évolutions incompatibles gérées explicitement.

### Négatives

- Travail documentaire initial supplémentaire.
- Nécessité de maintenir la spécification et l’implémentation synchronisées.
- Mapping obligatoire entre DTO et domaine.

## Vérification

- validation syntaxique OpenAPI en CI ;
- tests de contrat sur les exemples ;
- tests négatifs pour validation et autorisation ;
- détection des changements incompatibles ;
- aucune table ou colonne PostgreSQL exposée comme contrat implicite.
