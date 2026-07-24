# Stratégie de tests de contrat API

## Objectif

Garantir que l’implémentation HTTP respecte `openapi/patrimoine-v1.yaml` et que le frontend ne dépend d’aucun comportement implicite.

## Niveaux de vérification

### 1. Validation statique

À chaque pull request :

- parsing YAML ;
- validation OpenAPI 3.1 ;
- détection des références cassées ;
- contrôle des `operationId` uniques ;
- contrôle des exemples ;
- détection des changements incompatibles par rapport à `main`.

### 2. Tests des schémas

Pour chaque DTO critique :

- exemple valide accepté ;
- champ obligatoire absent refusé ;
- champ inconnu refusé lorsque `additionalProperties: false` ;
- UUID invalide refusé ;
- devise invalide refusée ;
- quantité décimale trop précise refusée ;
- montant négatif refusé lorsque le métier l’interdit.

### 3. Tests HTTP d’intégration

Chaque endpoint doit vérifier au minimum :

- réponse nominale ;
- absence de session ;
- ressource inexistante ;
- ressource appartenant à un autre utilisateur ;
- payload invalide ;
- conflit d’unicité ;
- concurrence lorsque pertinente.

Une ressource d’un autre utilisateur doit produire la même réponse publique qu’une ressource inexistante.

### 4. Idempotence

Pour `POST /portfolios/{portfolioId}/transactions` :

1. même clé et même payload : même résultat ;
2. même clé et payload différent : `409 Conflict` ;
3. clé absente : `400 Validation Error` ;
4. clés de deux utilisateurs distincts : isolation complète.

### 5. Tests RLS associés

Les tests API ne remplacent pas les tests PostgreSQL RLS.

La CI doit exécuter les deux niveaux :

- tests HTTP applicatifs ;
- tests SQL directs d’isolation.

## Outils envisagés

Au moment de l’initialisation du socle :

- validation OpenAPI avec un validateur compatible 3.1 ;
- tests TypeScript avec Vitest ;
- tests HTTP avec les handlers Next.js dans un environnement isolé ;
- tests E2E avec Playwright ;
- tests SQL via Supabase CLI et `psql` ou pgTAP.

Le choix final des bibliothèques sera versionné dans le socle technique et justifié si une dépendance importante est ajoutée.

## CI cible

```text
openapi:parse
openapi:validate
openapi:breaking-changes
contract:schemas
contract:http
rls:isolation
```

## Definition of Done

- [ ] spécification syntaxiquement valide ;
- [ ] références internes résolues ;
- [ ] exemples validés contre leurs schémas ;
- [ ] tests négatifs définis ;
- [ ] autorisation et RLS couvertes ;
- [ ] idempotence couverte ;
- [ ] changements incompatibles détectés ;
- [ ] documentation mise à jour avec l’implémentation.
