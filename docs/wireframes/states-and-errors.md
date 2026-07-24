# États d’interface et gestion des erreurs

## États obligatoires par écran

Chaque écran de consultation doit définir :

- chargement initial ;
- contenu disponible ;
- contenu vide ;
- erreur récupérable ;
- erreur non récupérable ;
- session expirée ;
- hors ligne lorsque pertinent.

Chaque formulaire doit définir :

- état initial ;
- saisie en cours ;
- validation invalide ;
- soumission en cours ;
- succès ;
- erreur serveur ;
- conflit ou double soumission.

## Chargement

- Un indicateur textuel reste disponible aux technologies d’assistance.
- Les skeletons ne remplacent pas le nom de la page.
- Les actions indisponibles pendant la soumission indiquent clairement leur état.
- Le bouton conserve sa largeur lorsque son libellé devient « Enregistrement… ».

## État vide

Un état vide contient :

1. un titre explicite ;
2. la raison de l’absence de données ;
3. la prochaine action utile ;
4. une seule action principale.

Exemple :

> Aucun compte enregistré. Ajoutez votre premier compte pour commencer à visualiser votre patrimoine.

## Validation des formulaires

### Règles

- Validation au changement de champ uniquement après une première interaction.
- Validation complète à la soumission.
- Focus déplacé vers le résumé des erreurs après une soumission invalide.
- Le résumé contient des liens vers les champs concernés.
- Les valeurs saisies sont conservées.

### Messages

Mauvais :

> Valeur incorrecte.

Correct :

> Saisissez un montant supérieur ou égal à 0, par exemple 150,00 €.

## Erreurs métier

Exemples :

- Le total de l’allocation cible doit être égal à 100 %.
- Cette position appartient à un compte qui a été supprimé.
- La quantité ne peut pas être négative.
- La date de revue ne peut pas précéder la date de décision.
- Ce compte ne peut pas être supprimé tant que ses positions n’ont pas été transférées ou supprimées.

Les erreurs métier sont distinctes des erreurs techniques dans les logs et dans les contrats API.

## Erreurs serveur

Message utilisateur générique :

> Nous n’avons pas pu enregistrer vos modifications. Vos données saisies sont conservées. Réessayez dans quelques instants.

Actions proposées :

- Réessayer
- Enregistrer un brouillon local lorsque possible
- Revenir sans perdre les données

Aucune stack trace, requête SQL, clé ou information interne n’est affichée.

## Hors ligne

- Bandeau persistant indiquant l’absence de connexion.
- Les consultations déjà chargées peuvent rester visibles avec leur date de mise à jour.
- Les écritures ne sont pas simulées comme réussies.
- L’utilisateur est informé avant de perdre une saisie non enregistrée.

## Session expirée

- Les données du formulaire sont conservées temporairement côté client lorsque cela ne présente pas de risque.
- Une nouvelle authentification est demandée.
- Après connexion, l’utilisateur revient à son action initiale.

## Double soumission et idempotence

- Le bouton est désactivé pendant la requête.
- Le backend reste la protection principale.
- Une réponse répétée n’entraîne pas la création de plusieurs comptes, positions ou décisions.

## Suppression

La suppression suit trois niveaux :

1. suppression simple réversible ou sans dépendance : confirmation courte ;
2. suppression avec dépendances : écran détaillant les impacts ;
3. suppression du compte utilisateur : nouvelle authentification et confirmation textuelle.

## Succès

- Confirmation visible dans le contenu principal pour les opérations importantes.
- Toast autorisé uniquement comme complément.
- Le message indique le résultat réel : « Le compte Livret A a été ajouté. »
- Le focus est déplacé seulement lorsque cela aide la poursuite du parcours.

## Taxonomie d’état

```text
IDLE
LOADING
READY
EMPTY
SUBMITTING
SUCCESS
VALIDATION_ERROR
BUSINESS_ERROR
AUTHORIZATION_ERROR
CONFLICT
NETWORK_ERROR
SERVER_ERROR
OFFLINE
```

Cette taxonomie guide l’interface sans imposer une implémentation technique au domaine.