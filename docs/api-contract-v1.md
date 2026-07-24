# Contrats API REST v1

## Objectif

Définir une API HTTP stable, prévisible et testable avant l’implémentation du frontend et des adapters.

## Préfixe et format

- Préfixe : `/api/v1`
- Transport : HTTPS uniquement hors environnement local
- Format : `application/json`
- Encodage : UTF-8
- Dates : ISO 8601 en UTC
- Identifiants : UUID
- Montants : unités mineures entières accompagnées d’une devise
- Quantités fractionnées : chaînes décimales afin d’éviter toute perte de précision JavaScript

## Authentification

Toutes les routes métier exigent une session authentifiée.

L’API ne fait jamais confiance à un `userId` transmis par le client. L’identité provient exclusivement de la session serveur.

## Autorisation

Chaque ressource est vérifiée au niveau applicatif puis protégée par les politiques RLS PostgreSQL.

Comportement attendu :

- `401 Unauthorized` : session absente ou invalide ;
- `404 Not Found` : ressource inexistante ou non accessible ;
- aucune distinction observable entre une ressource inexistante et une ressource appartenant à un autre utilisateur.

## Erreurs

Format commun :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Certaines données sont invalides.",
    "requestId": "01J...",
    "details": [
      {
        "field": "name",
        "code": "TOO_SHORT",
        "message": "Le nom est obligatoire."
      }
    ]
  }
}
```

Catégories initiales :

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `NOT_FOUND`
- `CONFLICT`
- `PRECONDITION_FAILED`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

Aucune stack trace, requête SQL ou donnée sensible n’est exposée.

## Pagination

Les collections utilisent une pagination par curseur :

```text
?limit=20&cursor=<opaque>
```

Réponse :

```json
{
  "data": [],
  "page": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

Le curseur est opaque et ne doit pas être interprété côté client.

## Concurrence

Les ressources modifiables exposent `updatedAt`.

Les mises à jour acceptent un en-tête `If-Unmodified-Since` ou un jeton de version applicatif lorsque l’implémentation sera stabilisée. En cas de conflit : `412 Precondition Failed`.

## Idempotence

Les créations pouvant être rejouées après une interruption réseau acceptent `Idempotency-Key` :

- création d’une transaction ;
- création d’un export ;
- import futur de lots.

La même clé avec le même contenu retourne le résultat initial. La même clé avec un contenu différent retourne `409 Conflict`.

## Ressources v1

### Portefeuilles

- `GET /portfolios`
- `POST /portfolios`
- `GET /portfolios/{portfolioId}`
- `PATCH /portfolios/{portfolioId}`
- `DELETE /portfolios/{portfolioId}`

### Comptes

- `GET /portfolios/{portfolioId}/accounts`
- `POST /portfolios/{portfolioId}/accounts`
- `GET /portfolios/{portfolioId}/accounts/{accountId}`
- `PATCH /portfolios/{portfolioId}/accounts/{accountId}`
- `DELETE /portfolios/{portfolioId}/accounts/{accountId}`

### Actifs

- `GET /assets`
- `POST /assets`
- `GET /assets/{assetId}`
- `PATCH /assets/{assetId}`
- `DELETE /assets/{assetId}`

Les actifs publics sont en lecture seule. Seuls les actifs personnalisés appartenant à l’utilisateur sont modifiables.

### Positions

- `GET /portfolios/{portfolioId}/positions`
- `POST /portfolios/{portfolioId}/positions`
- `GET /portfolios/{portfolioId}/positions/{positionId}`
- `PATCH /portfolios/{portfolioId}/positions/{positionId}`
- `DELETE /portfolios/{portfolioId}/positions/{positionId}`

### Transactions

- `GET /portfolios/{portfolioId}/transactions`
- `POST /portfolios/{portfolioId}/transactions`
- `GET /portfolios/{portfolioId}/transactions/{transactionId}`
- `PATCH /portfolios/{portfolioId}/transactions/{transactionId}`
- `DELETE /portfolios/{portfolioId}/transactions/{transactionId}`

### Allocation cible

- `GET /portfolios/{portfolioId}/allocation-targets`
- `PUT /portfolios/{portfolioId}/allocation-targets`

Le `PUT` remplace atomiquement l’ensemble des cibles. La somme doit être égale à 10 000 points de base.

### Projections

- `GET /portfolios/{portfolioId}/projections`
- `POST /portfolios/{portfolioId}/projections`
- `GET /portfolios/{portfolioId}/projections/{projectionId}`
- `DELETE /portfolios/{portfolioId}/projections/{projectionId}`

Les résultats sont calculés par un moteur déterministe. L’IA n’est jamais utilisée pour produire les montants.

### Journal de décisions

- `GET /portfolios/{portfolioId}/decisions`
- `POST /portfolios/{portfolioId}/decisions`
- `GET /portfolios/{portfolioId}/decisions/{decisionId}`
- `PATCH /portfolios/{portfolioId}/decisions/{decisionId}`
- `DELETE /portfolios/{portfolioId}/decisions/{decisionId}`

### Export

- `POST /exports`
- `GET /exports/{exportId}`

L’export est asynchrone, limité dans le temps et accessible uniquement à son propriétaire.

## DTO et domaine

Les DTO HTTP ne sont jamais les entités de domaine ni les modèles PostgreSQL.

Exemple :

```text
HTTP DTO
  ↓ validation
Command / Query applicative
  ↓
Domaine
  ↓
Repository Port
  ↓
Adapter PostgreSQL / Supabase
```

## Suppressions

- Une suppression simple retourne `204 No Content`.
- Une ressource référencée et non supprimable retourne `409 Conflict`.
- La suppression du compte utilisateur n’est pas une route CRUD ordinaire : elle suit un parcours dédié avec confirmation renforcée et audit.

## Validation

- Body, paramètres de chemin, requêtes et en-têtes sont validés côté serveur.
- Les champs inconnus sont refusés sur les commandes d’écriture.
- Les chaînes sont normalisées avant traitement lorsque cela est explicitement prévu.
- Les calculs financiers ne reposent jamais sur des nombres flottants.

## Critères de validation

- spécification OpenAPI syntaxiquement valide ;
- exemples cohérents avec le schéma PostgreSQL ;
- erreurs communes réutilisées ;
- autorisation documentée ;
- pagination, idempotence et concurrence explicites ;
- aucune dépendance à Supabase dans le contrat public ;
- tests de contrat prévus avant implémentation.
