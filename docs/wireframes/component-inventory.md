# Inventaire des composants UI

## Fondations

- `AppShell`
- `SkipLink`
- `MainNavigation`
- `MobileBottomNavigation`
- `PageHeader`
- `Breadcrumbs`
- `ContentSection`
- `Divider`

## Actions

- `Button` : primary, secondary, danger, ghost
- `IconButton` avec nom accessible obligatoire
- `ButtonLink`
- `MenuButton`
- `BackButton`

## Formulaires

- `FormField`
- `TextInput`
- `EmailInput`
- `PasswordInput`
- `MoneyInput`
- `PercentageInput`
- `DecimalInput`
- `Select`
- `RadioGroup`
- `Checkbox`
- `Textarea`
- `DateInput`
- `FieldHint`
- `FieldError`
- `FormSummaryError`

## Données financières

- `MoneyValue`
- `PercentageValue`
- `AccountTypeBadge`
- `AssetClassBadge`
- `RiskIndicator`
- `LastUpdated`
- `AccountCard`
- `PositionCard`
- `MetricCard`
- `AllocationComparison`
- `ProjectionSummary`

## Tableaux et listes

- `DataTable`
- `ResponsiveDataList`
- `SortableHeader`
- `Pagination`
- `FilterGroup`
- `SearchField`
- `EmptyState`

Les tableaux complexes deviennent des cartes sémantiques sur mobile sans perdre les intitulés de colonnes.

## Graphiques

- `AccessibleChartContainer`
- `AllocationBarChart`
- `ProjectionLineChart`
- `ChartLegend`
- `ChartDataTable`
- `ChartTextSummary`

Chaque composant graphique exige :

- un titre ;
- une description ;
- un résumé textuel ;
- un tableau des valeurs ;
- une palette non dépendante de la perception des couleurs ;
- un ordre de lecture cohérent.

## Retours système

- `Alert`
- `StatusMessage`
- `Toast` uniquement pour les confirmations non critiques
- `LoadingIndicator`
- `Skeleton`
- `ProgressIndicator`
- `OfflineBanner`
- `RetryPanel`

Les erreurs critiques restent visibles dans le contenu et ne reposent pas sur un toast temporaire.

## Superpositions

- `Dialog`
- `ConfirmationDialog`
- `Drawer`

Contraintes : focus initial maîtrisé, boucle de focus, fermeture avec Échap, restitution du focus au déclencheur et titre associé.

## Décisions

- `DecisionCard`
- `DecisionStatus`
- `SourceList`
- `ReviewDate`
- `DecisionTimeline`

## Règles communes

- Cible tactile minimale de 44 × 44 CSS pixels lorsque possible.
- Nom accessible pour toute action iconographique.
- États `hover`, `focus`, `active`, `disabled`, `loading`, `error` et `success` définis.
- Aucun texte essentiel placé uniquement dans un placeholder.
- Les composants métier ne réalisent aucun calcul financier critique côté affichage.
- Les composants ne connaissent pas Supabase ni la structure de persistance.