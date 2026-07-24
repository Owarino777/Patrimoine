# Wireframes fonctionnels — MVP Patrimoine

## Objectif

Définir les écrans, parcours, états et composants du MVP avant toute implémentation.

Le produit doit permettre à un utilisateur de :

1. créer son espace ;
2. déclarer manuellement ses comptes ;
3. ajouter ses positions ;
4. comprendre son allocation ;
5. simuler son patrimoine à long terme ;
6. consigner ses décisions ;
7. exporter ou supprimer ses données.

## Principes de conception

- Mobile-first, puis adaptation tablette et desktop.
- Navigation simple, stable et prévisible.
- Une action principale par écran.
- Aucun graphique sans alternative textuelle et tabulaire.
- Aucun état transmis uniquement par la couleur.
- Tous les contrôles sont utilisables au clavier.
- Focus visible sur chaque élément interactif.
- Les erreurs sont placées près des champs et annoncées aux technologies d’assistance.
- Les montants, hypothèses et projections ne sont jamais présentés comme garantis.
- Le produit informe et aide à structurer les décisions ; il ne donne pas d’ordre automatique d’achat ou de vente.

## Architecture de navigation

```text
Connexion / inscription
        ↓
Onboarding
        ↓
Tableau de bord
├── Comptes
│   ├── Liste des comptes
│   ├── Détail d’un compte
│   └── Ajouter / modifier un compte
├── Positions
│   ├── Liste des positions
│   ├── Détail d’une position
│   └── Ajouter / modifier une position
├── Allocation
│   ├── Répartition actuelle
│   └── Allocation cible
├── Projections
│   ├── Nouveau scénario
│   └── Résultat détaillé
├── Journal de décisions
│   ├── Liste
│   ├── Nouvelle décision
│   └── Détail / suivi
└── Paramètres
    ├── Profil
    ├── Export des données
    └── Suppression du compte
```

## Navigation principale

### Mobile

Barre inférieure avec cinq destinations maximum :

- Accueil
- Comptes
- Allocation
- Projections
- Plus

Le menu « Plus » contient : positions, journal, paramètres et aide.

### Desktop

Navigation latérale persistante :

- Tableau de bord
- Comptes
- Positions
- Allocation
- Projections
- Journal
- Paramètres

Le contenu principal conserve une largeur lisible et ne dépend pas d’un écran très large.

## Liste des écrans

1. Connexion
2. Inscription
3. Mot de passe oublié
4. Onboarding — objectif
5. Onboarding — premier compte
6. Onboarding — allocation cible initiale
7. Tableau de bord
8. Liste des comptes
9. Ajouter un compte
10. Détail d’un compte
11. Liste des positions
12. Ajouter une position
13. Détail d’une position
14. Allocation actuelle
15. Allocation cible
16. Nouveau scénario de projection
17. Résultat de projection
18. Journal de décisions
19. Nouvelle décision
20. Détail d’une décision
21. Paramètres du profil
22. Export des données
23. Suppression du compte
24. États système : chargement, vide, erreur, hors ligne et succès

## Documents associés

- `user-flows.md` : parcours utilisateur détaillés
- `screen-specifications.md` : contenu et comportement de chaque écran
- `component-inventory.md` : composants réutilisables
- `responsive-accessibility.md` : responsive et exigences d’accessibilité
- `states-and-errors.md` : états, erreurs et messages
- `acceptance-matrix.md` : critères de validation de l’issue
