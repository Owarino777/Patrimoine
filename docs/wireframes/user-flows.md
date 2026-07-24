# Parcours utilisateur — MVP

## Flux 1 — Première utilisation

```text
Inscription
  → validation de l’adresse e-mail
  → choix de l’objectif principal
  → création du portefeuille personnel
  → ajout du premier compte
  → définition facultative d’une allocation cible
  → tableau de bord
```

### Objectif principal

Choix unique initial, modifiable plus tard :

- Construire une épargne de sécurité
- Développer mon patrimoine
- Préparer un projet
- Préparer ma retraite
- Comprendre mes investissements

Ce choix personnalise l’ordre des informations, sans produire de recommandation réglementée.

### Règles

- L’utilisateur peut quitter l’onboarding et le reprendre.
- L’allocation cible est facultative.
- Aucun compte bancaire ou courtier n’est connecté.
- Une explication claire indique que les données sont saisies manuellement.

## Flux 2 — Ajouter un Livret A

```text
Tableau de bord
  → Ajouter un compte
  → type : Livret A
  → établissement
  → solde actuel
  → versement mensuel prévu
  → objectif du compte
  → récapitulatif
  → confirmation
  → tableau de bord mis à jour
```

### Validations

- Le solde ne peut pas être négatif.
- La devise est EUR et n’est pas modifiable pour ce type.
- Le versement mensuel peut être nul.
- Les données doivent pouvoir être corrigées avant confirmation.

## Flux 3 — Ajouter un PEA et une position ETF

```text
Comptes
  → Ajouter un compte
  → type : PEA
  → établissement
  → solde espèces
  → enregistrer
  → Ajouter une position
  → rechercher ou saisir l’actif
  → identifiant ISIN ou ticker
  → quantité
  → prix moyen
  → valeur actuelle manuelle
  → horizon de détention
  → enregistrer
```

### Cas particuliers

- Un actif inconnu peut être créé manuellement.
- Les quantités fractionnées sont autorisées lorsque l’utilisateur en détient réellement.
- La valeur actuelle peut être mise à jour sans modifier le prix moyen.
- L’application indique la date de dernière mise à jour manuelle.

## Flux 4 — Comprendre son allocation

```text
Tableau de bord
  → Allocation
  → résumé textuel
  → répartition par classe d’actifs
  → tableau détaillé
  → comparaison avec la cible
  → écarts à surveiller
```

### Sortie attendue

L’application formule des constats factuels :

- « 62 % de votre patrimoine déclaré est exposé aux actions. »
- « Votre poche de liquidités est inférieure de 8 points à votre cible. »

Elle n’affiche pas :

- « Vendez cet actif maintenant. »
- « Achetez de l’or aujourd’hui. »

## Flux 5 — Créer une projection

```text
Projections
  → Nouveau scénario
  → capital initial prérempli
  → versement mensuel
  → horizon 10 / 15 / 20 / 30 ans
  → rendement annuel hypothétique
  → inflation
  → frais annuels
  → calcul
  → résultat nominal
  → résultat corrigé de l’inflation
  → détail des versements, gains et frais
  → enregistrer le scénario
```

### Règles

- Les hypothèses sont toujours visibles.
- Les valeurs extrêmes déclenchent un avertissement.
- Le moteur de calcul est déterministe.
- Le scénario peut être dupliqué pour comparaison.

## Flux 6 — Consigner une décision

```text
Journal
  → Nouvelle décision
  → sélectionner un actif ou le portefeuille global
  → action envisagée
  → contexte
  → thèse et justification
  → sources
  → risques identifiés
  → décision finale
  → date de revue facultative
  → enregistrer
```

### Actions possibles

- Ne rien faire
- Continuer les versements prévus
- Suspendre les versements
- Renforcer progressivement
- Réduire progressivement
- Modifier l’allocation cible
- Autre

L’application n’exécute aucune action financière.

## Flux 7 — Exporter ou supprimer ses données

```text
Paramètres
  → Données personnelles
  → Exporter
  → choisir JSON ou CSV
  → génération
  → téléchargement
```

```text
Paramètres
  → Supprimer mon compte
  → explication des conséquences
  → saisie de confirmation
  → nouvelle authentification si nécessaire
  → délai de sécurité éventuel
  → suppression
```

## Flux 8 — Erreur ou interruption

Chaque parcours doit prévoir :

- perte de connexion ;
- session expirée ;
- validation impossible ;
- erreur serveur ;
- double soumission ;
- données supprimées dans un autre onglet ;
- reprise après interruption.

Aucune erreur ne doit effacer silencieusement les données saisies dans un formulaire.