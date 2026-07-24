# Spécifications des écrans

## 1. Connexion et inscription

### Contenu

- Logo et nom du produit
- Titre unique de page
- Adresse e-mail
- Mot de passe
- Affichage/masquage du mot de passe
- Action principale
- Lien vers le parcours alternatif
- Mot de passe oublié
- Mentions de confidentialité

### Contraintes

- Pas de connexion sociale dans le MVP.
- Les erreurs ne révèlent pas si un compte existe.
- Les critères de mot de passe sont annoncés avant validation.

## 2. Onboarding

### Étape 1 — objectif

- Progression textuelle « Étape 1 sur 3 »
- Question principale
- Choix sous forme de boutons radio
- Explication courte
- Continuer
- Passer pour le moment

### Étape 2 — premier compte

- Type de compte
- Établissement
- Nom personnalisé facultatif
- Solde actuel
- Versement mensuel prévu
- Objectif facultatif

### Étape 3 — cible initiale

- Répartition facultative par grandes classes d’actifs
- Total calculé en direct
- Blocage de validation tant que le total n’est pas égal à 100 %
- Option « Je définirai cela plus tard »

## 3. Tableau de bord

### Hiérarchie

1. Titre et date de dernière mise à jour
2. Valeur totale déclarée
3. Progression de l’épargne de sécurité
4. Résumé de l’allocation
5. Comptes principaux
6. Prochaine action utile
7. Décisions à revoir

### Cartes

- Patrimoine total
- Versements mensuels prévus
- Liquidités disponibles
- Exposition aux actifs risqués

### Action principale

« Ajouter un compte » tant qu’aucun compte n’existe, puis « Mettre à jour mes données ».

### Version vide

- Explication du bénéfice
- Une seule action : ajouter le premier compte
- Aucun graphique vide

## 4. Liste des comptes

### Contenu

- Filtres par type
- Tri par valeur, nom ou dernière mise à jour
- Valeur totale
- Liste de comptes
- Action d’ajout

### Ligne ou carte de compte

- Nom
- Type
- Établissement
- Solde ou valorisation
- Versement mensuel prévu
- Date de mise à jour
- Lien vers le détail

## 5. Ajouter ou modifier un compte

### Champs communs

- Type de compte
- Établissement
- Nom personnalisé
- Devise
- Solde espèces
- Versement mensuel prévu
- Objectif
- Horizon

### Comportement

- Les champs dépendent du type de compte.
- Les valeurs existantes sont préremplies en modification.
- Une page récapitulative précède la création lorsque plusieurs données importantes sont saisies.
- La suppression est distincte de l’enregistrement.

## 6. Détail d’un compte

### Contenu

- Résumé du compte
- Solde espèces
- Valorisation des positions
- Valeur totale
- Versement prévu
- Positions rattachées
- Historique manuel des transactions
- Dernière mise à jour

### Actions

- Modifier le compte
- Ajouter une position
- Ajouter une transaction
- Supprimer le compte

La suppression doit expliquer le traitement des positions liées.

## 7. Liste des positions

### Contenu

- Recherche par nom, ticker ou ISIN
- Filtres par compte et classe d’actifs
- Tri par poids, valeur, performance déclarée ou mise à jour
- Tableau accessible sur desktop
- Cartes structurées sur mobile

### Données affichées

- Actif
- Compte
- Quantité
- Prix moyen
- Valeur actuelle
- Poids dans le patrimoine
- Date de mise à jour

## 8. Ajouter ou modifier une position

### Champs

- Compte de rattachement
- Actif existant ou création manuelle
- Nom
- Ticker ou ISIN
- Classe d’actifs
- Devise
- Quantité
- Prix moyen
- Valeur actuelle
- Horizon
- Niveau de risque déclaré
- Note personnelle

### Validations

- Quantité et valeurs utilisent des décimaux exacts.
- Les erreurs de format indiquent un exemple valide.
- Les identifiants d’actifs sont facultatifs lors d’une création manuelle.

## 9. Allocation actuelle

### Ordre de restitution

1. Résumé en langage clair
2. Répartition par classe d’actifs
3. Répartition par enveloppe
4. Répartition géographique lorsque disponible
5. Répartition sectorielle lorsque disponible
6. Tableau complet

### Graphiques

- Graphique en anneau ou barres uniquement comme complément.
- Tableau associé systématique.
- Bouton permettant de masquer les graphiques.

## 10. Allocation cible

### Contenu

- Cibles par classe d’actifs
- Total en pourcentage
- Comparaison actuel/cible
- Écarts en points
- Date de prise d’effet
- Justification personnelle facultative

### Règles

- Total obligatoire de 100 %.
- Pas de recommandation automatique.
- L’utilisateur peut restaurer sa cible précédente.

## 11. Nouveau scénario de projection

### Champs

- Nom du scénario
- Capital initial
- Versement mensuel
- Durée
- Rendement annuel hypothétique
- Inflation
- Frais annuels
- Date de début

### Aide

Chaque hypothèse dispose d’une description courte et d’un exemple, accessible sans infobulle au survol uniquement.

## 12. Résultat de projection

### Indicateurs

- Capital final nominal
- Capital final corrigé de l’inflation
- Total versé
- Gains théoriques
- Frais estimés

### Restitution

- Résumé textuel
- Courbe de progression
- Tableau annuel
- Hypothèses utilisées
- Avertissement sur l’incertitude
- Comparaison avec un autre scénario

## 13. Journal de décisions

### Liste

- Date
- Actif ou portefeuille
- Action envisagée
- Décision finale
- Statut de revue
- Date de prochaine revue

### Nouvelle décision

Le formulaire suit quatre sections : contexte, thèse, risques, décision.

### Détail

- Données d’origine non écrasées
- Historique des modifications
- Sources avec titre, URL et date de consultation
- Résultat observé ajouté séparément

## 14. Paramètres et données personnelles

### Sections

- Profil
- Préférences d’affichage
- Formats de nombre et devise
- Export
- Suppression
- Informations légales

### Suppression

- Zone visuellement distincte, mais pas dépendante du rouge seul
- Confirmation explicite
- Conséquences détaillées
- Possibilité d’annuler avant validation finale
