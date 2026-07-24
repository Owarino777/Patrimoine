# Responsive et accessibilité

## Breakpoints fonctionnels

Les breakpoints sont définis selon la capacité du contenu, pas selon un appareil précis.

- Compact : jusqu’à environ 767 px
- Intermédiaire : 768 à 1199 px
- Large : 1200 px et plus

## Compact

- Une seule colonne principale.
- Barre de navigation inférieure.
- Actions principales visibles sans ouvrir un menu contextuel.
- Tableaux transformés en listes structurées.
- Formulaires sur une colonne.
- Dialogues remplacés par une page ou un panneau plein écran lorsque le contenu est long.

## Intermédiaire

- Navigation latérale rétractable.
- Grille de deux colonnes uniquement pour les cartes indépendantes.
- Formulaires toujours lisibles sans multiplier les alignements horizontaux.

## Large

- Navigation latérale persistante.
- Contenu principal limité en largeur.
- Panneau secondaire possible pour le résumé ou l’aide contextuelle.
- Jamais plus de trois colonnes de cartes de données.

## Zoom et reflow

- Utilisable à 200 % sans perte de contenu ni chevauchement.
- Reflow à 400 % sur une largeur de référence de 1280 px.
- Aucun défilement horizontal pour le contenu courant, hors tableaux réellement bidimensionnels.
- Aucun texte dans une image.

## Clavier

- Ordre de tabulation identique à l’ordre visuel et logique.
- Lien d’évitement vers le contenu principal.
- Aucun piège clavier.
- Tous les menus, filtres, dialogues et contrôles sont utilisables au clavier.
- Échap ferme les superpositions non critiques.
- Le focus revient au déclencheur après fermeture.

## Focus

- Focus visible avec un contraste d’au moins 3:1 avec les couleurs adjacentes.
- Le focus n’est jamais supprimé sans remplacement équivalent.
- Les éléments masqués ne reçoivent pas le focus.

## Structure et sémantique

- Un seul `main` par vue.
- Titres hiérarchisés sans saut artificiel.
- `button` pour une action, `a` pour une navigation.
- `fieldset` et `legend` pour les groupes de choix.
- Tableaux avec `caption`, en-têtes et associations adaptées.
- Les régions de navigation ont des noms accessibles distincts.

## Formulaires

- Libellé visible pour chaque champ.
- Instructions avant la saisie.
- Erreur liée au champ concerné.
- Résumé des erreurs au début du formulaire après soumission invalide.
- Les formats attendus sont explicités.
- La validation frontend ne remplace jamais la validation serveur.

## Couleurs et contrastes

- Texte courant : ratio minimal 4,5:1.
- Texte large : ratio minimal 3:1.
- Composants et états graphiques essentiels : ratio minimal 3:1.
- Aucun statut indiqué uniquement par vert, orange ou rouge.
- Icône, texte ou motif complète la couleur.

## Graphiques

- Le graphique est décoratif lorsqu’un résumé et un tableau portent entièrement l’information.
- Sinon, il possède un nom et une description accessibles adaptés.
- Les valeurs ne sont pas accessibles uniquement au survol.
- Le tableau de données suit immédiatement le graphique ou est relié explicitement.
- Les catégories utilisent des libellés et éventuellement des motifs en plus des couleurs.

## Mouvement

- Respect de `prefers-reduced-motion`.
- Aucune animation essentielle à la compréhension.
- Pas de déplacement automatique du contenu.
- Chargements et transitions restent courts et non bloquants.

## Messages dynamiques

- Confirmation courte : région `status` non intrusive.
- Erreur bloquante : région `alert` et focus géré vers le résumé.
- Mise à jour d’un calcul : ne pas annoncer chaque frappe ; annoncer le résultat après action ou temporisation maîtrisée.

## Tests obligatoires

- Navigation complète au clavier.
- NVDA avec Firefox ou Chrome sur les parcours critiques.
- Zoom 200 % et reflow 400 %.
- Contraste et focus.
- Axe en CI comme filet de sécurité uniquement.
- Test manuel des graphiques, erreurs, dialogues et formulaires.