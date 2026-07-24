# Product Requirements Document — Patrimoine MVP

## 1. Vision

Patrimoine aide un utilisateur à comprendre où se trouve son argent, vérifier sa diversification, suivre ses objectifs et documenter ses décisions d’investissement à long terme.

Le produit n’est ni un courtier, ni un robot de trading, ni un conseiller financier automatisé.

## 2. Problème utilisateur

Les particuliers répartissent leur argent entre livrets, PEA, CTO, PER, crypto et autres supports sans vision consolidée ni règles explicites de suivi.

Les outils existants sont souvent :

- trop orientés trading ;
- trop complexes ;
- peu adaptés aux enveloppes françaises ;
- peu transparents sur les hypothèses ;
- peu accessibles ;
- peu utiles pour documenter une stratégie long terme.

## 3. Utilisateur cible initial

Particulier français de 20 à 45 ans qui :

- commence à construire son patrimoine ;
- utilise plusieurs enveloppes ;
- investit régulièrement ;
- souhaite éviter le sur-trading ;
- veut comprendre ses décisions ;
- accepte une saisie manuelle pour le MVP.

## 4. Proposition de valeur

Centraliser son patrimoine, suivre son allocation, simuler plusieurs horizons et conserver un journal de décision traçable.

## 5. Questions auxquelles le produit répond

1. Où est mon argent ?
2. Comment mon patrimoine est-il réparti ?
3. Suis-je proche de mon allocation cible ?
4. Que donnent mes versements réguliers sur 10, 15, 20 ou 30 ans ?
5. Pourquoi ai-je pris telle décision ?

## 6. Périmètre MVP

### 6.1 Comptes financiers

L’utilisateur peut créer, modifier, consulter et supprimer :

- Livret A ;
- LDDS ;
- PEA ;
- CTO ;
- PER ;
- portefeuille crypto ;
- compte espèces ;
- autre compte manuel.

Données minimales :

- établissement ;
- type de compte ;
- devise ;
- solde espèces ;
- date d’ouverture ;
- objectif ;
- horizon ;
- versement mensuel cible.

### 6.2 Actifs et positions

L’utilisateur peut enregistrer :

- ETF ;
- action ;
- obligation ;
- cryptoactif ;
- fonds ;
- or ou matière première ;
- liquidités ;
- autre actif.

Données minimales :

- nom ;
- ISIN ou ticker si disponible ;
- classe d’actif ;
- devise ;
- quantité ;
- prix moyen ;
- valeur manuelle actuelle ;
- niveau de risque ;
- horizon de détention.

### 6.3 Allocation

Le produit calcule :

- allocation par enveloppe ;
- allocation par classe d’actifs ;
- part de liquidités ;
- part de crypto ;
- écart par rapport à une allocation cible.

### 6.4 Projections

L’utilisateur peut définir :

- capital initial ;
- versement mensuel ;
- durée ;
- rendement annuel hypothétique ;
- inflation ;
- frais annuels.

Le produit affiche :

- capital nominal ;
- capital corrigé de l’inflation ;
- total versé ;
- gains théoriques ;
- frais estimés.

### 6.5 Journal de décisions

Chaque entrée peut contenir :

- actif ou compte concerné ;
- type de décision ;
- justification ;
- sources ;
- niveau de confiance ;
- décision finale ;
- date de révision prévue ;
- résultat observé ultérieurement.

## 7. Hors périmètre MVP

- connexion bancaire ou courtier ;
- exécution d’ordres ;
- trading automatique ;
- données de marché temps réel ;
- recommandations automatiques personnalisées ;
- analyse technique avancée ;
- fiscalité exhaustive ;
- retraite française détaillée ;
- immobilier détaillé ;
- application mobile native ;
- réseau social ;
- abonnement complexe ;
- synchronisation multi-utilisateur d’un foyer.

## 8. Contraintes métier

- Aucun montant financier en virgule flottante.
- Les calculs de projection sont déterministes.
- L’IA ne calcule pas les montants.
- L’IA ne déclenche aucune transaction.
- Toute donnée appartient à un utilisateur ou à un portefeuille explicitement autorisé.
- Les hypothèses de rendement doivent être visibles.
- Les projections ne doivent jamais être présentées comme garanties.

## 9. Critères de succès MVP

Le MVP est validé si un utilisateur peut :

1. créer un compte ;
2. créer un portefeuille ;
3. ajouter un Livret A et un PEA ;
4. ajouter une position ETF ;
5. voir son allocation ;
6. définir une allocation cible ;
7. créer une projection à 20 ans ;
8. enregistrer une décision ;
9. exporter ses données ;
10. supprimer son compte.

## 10. Exigences non fonctionnelles

### Accessibilité

- navigation clavier complète ;
- focus visible ;
- structure sémantique ;
- contrastes conformes ;
- alternatives textuelles aux graphiques ;
- erreurs de formulaire accessibles ;
- compatibilité zoom 200 % et 400 %.

### Sécurité

- authentification sécurisée ;
- autorisation côté serveur ;
- refus par défaut ;
- validation stricte ;
- secrets hors dépôt ;
- CSP ;
- rate limiting ;
- journalisation des actions sensibles.

### Performance

- affichage du tableau de bord sous 2 secondes sur connexion standard ;
- pagination des listes ;
- calculs de projection sous 300 ms pour les cas usuels.

### Portabilité

- export JSON et CSV ;
- migrations versionnées ;
- aucune dépendance directe du domaine à Supabase ou Next.js.

## 11. Risques principaux

- dérive vers un produit de conseil financier automatisé ;
- sur-complexité du modèle de données ;
- mauvaise interprétation des projections ;
- fuite de données financières personnelles ;
- dépendance excessive à un fournisseur ;
- extension prématurée vers les données temps réel.

## 12. Étapes suivantes

1. valider ce PRD ;
2. valider le vocabulaire métier ;
3. valider les ADR ;
4. réaliser les wireframes ;
5. produire le schéma SQL ;
6. initialiser le dépôt ;
7. commencer le socle technique.
