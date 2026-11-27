# Module `@kotbo/ui/analytics` — Analytics v3

Toutes les visualisations et calculs de séries temporelles **Analytics v3** partagés entre Kotbo Dashboard (`ActivityChartCard`, pages `/analytics`) et AegisAI (`AnalyticsChartCard`).

```ts
import {
  AnalyticsChartCard,
  MetricTabs,
  Sparkline,
  KpiTile,
  Chart,
  TimeSeriesChart,
  TrendChart,
  BarList,
  ShareBar,
  CohortTable,
  TopList,
  AnalyticsSkeleton,
} from '@kotbo/ui/analytics';
```

## Composants

### `AnalyticsChartCard`

Carte composite complète pilotant :
1. Un sélecteur de métriques (`MetricTabs`) avec sparkline et badge d'écart.
2. Une barre d'outils : choix de période (`periodOptions`), modes d'affichage (`views`, par défaut `line`, `bar`, `table`), et calques (lissage, comparaison période précédente, prévision).
3. Le graphique principal (`TimeSeriesChart`) ou un tableau de données (`data-table`), voire un rendu sur mesure (`customPlot` snippet).
4. Une grille de faits clés (`facts`) calculés automatiquement ou fournis par l'hôte.

**Props principales :**
- `metrics: AnalyticsCardMetric[]` (`id`, `label`, `value`, `delta`, `invert`, `previous`, `spark`, `color`, `hint`, `tag`, `format`, `values`, `previousValues`, `aggregate`, `canForecast`, `forecastData`)
- `bind:active`, `onActiveChange`
- `labels: string[]`
- `periodOptions`, `period`, `onPeriodChange`
- `views`, `bind:view`, `compare`, `onToggleCompare`
- `bind:smooth`, `bind:showForecast`, `smoothingWindowSize`, `autoScaleSpark`
- `markers: ChartMarker[]`, `facts: AnalyticsFact[]`
- `tableHeaders`, `tableRows`
- `storageKey` (persistance locale de `{ view, smooth, forecast }`)
- `busy`, `height`, `onChartSelect`
- Snippets : `toolbarExtra`, `layersExtra`, `beforePlot`, `customPlot(view)`, `metricBadge(metric)`, `footer`

**Personnalisation CSS :** `.chart-card` et `.facts` exposent les variables `--kotbo-chart-card-radius`, `--kotbo-chart-card-padding`, `--kotbo-chart-card-gap`, `--kotbo-chart-card-bg`, `--kotbo-facts-padding-top`, `--kotbo-fact-value-size` et `--kotbo-fact-value-weight`.

### `MetricTabs` & `Sparkline`

- `MetricTabs` (`role="radiogroup"` / `role="radio"` quand `interactive=true`) : affiche chaque métrique avec valeur, écart fléché (`invert` inverse vert/rouge pour les métriques négatives comme la toxicité ou les sanctions), mini-courbe `Sparkline` SVG et snippet optionnel `badge(metric)`.
- `Sparkline` : SVG décoratif (`aria-hidden="true"`), props `values`, `color`, `width`, `height`, `fill`.

### `KpiTile`

Tuile KPI unitaire autonome (`label`, `value`, `delta`, `unit: 'pct' | 'pts' | 'abs'`, `compare`, `invert`, `hint`).

### `Chart`, `TimeSeriesChart` & `TrendChart`

- **`Chart`** : enveloppe tree-shakée de `chart.js` (n'enregistre que `Bar`, `Line`, `Doughnut`, `Pie` et les échelles associées). Résout automatiquement les variables CSS (`var(--series-1)`, `rgba(var(--...), alpha)`) vers RGB utilisable sur `<canvas>`, masque le canvas (`aria-hidden="true"`) et rend un tableau `.sr-only` équivalent (RGAA 1.1 / 1.10).
- **`TimeSeriesChart`** : courbe/barres/empilé/multi-lignes à un seul axe, supportant `main`, `previous` (pointillés neutres), `smoothed` (remplace la série brute en mode lissé), `projection` + bande d'incertitude (`low`/`high`), `stacks` et repères verticaux `markers`.
- **`TrendChart`** : barres quotidiennes + courbe pointillée de période précédente (`dates`, `values`, `previous`, `label`, `previousLabel`, `compare`, `color`, `height`, `format`).

### `BarList`, `ShareBar`, `CohortTable`, `TopList`, `AnalyticsSkeleton`

- **`BarList`** (`generics="T extends BarListItem"`) : classement horizontal à barres proportionnelles, lignes cliquables si `onselect` est défini, snippets `leading` / `trailing`.
- **`ShareBar`** : barre segmentée à 100 % et sa légende multi-colonnes (`segments: ShareSegment[]`, `columns`, `showCounts`).
- **`CohortTable`** : matrice de rétention hebdomadaire avec heatmap `color-mix()` et ligne de moyenne pondérée (`title`, `description`, `cohorts: CohortRow[]`, `weeks`, `loading`, `error`, `notice`, `columnPrefix`).
- **`TopList`** (`generics="T extends TopListItem"`) : carte Top N avec bascule tableau/barres, fenêtre modale « Tout voir » avec recherche et pagination (`50`/page), hook de chargement complet (`onLoadFull`) et export (`onExport`), snippets `renderIdentity` et `renderRowName`.
- **`AnalyticsSkeleton`** : squelette plein écran ou mode compact (`compact`, `rows`).

---

## Sous-exports JS purs (calculs, formatage, tableaux RGAA)

Utilisables dans Vite **et** directement dans `bun test` :

| Import | Rôle & exports |
| --- | --- |
| `@kotbo/ui/analytics/timeSeries` | `resolveGranularity`, `weekStart`, `bucketDays`, `aggregate`, `smoothingWindow`, `movingAverage`, `trendPct`, `forecast`, `daysLeftInMonth`, `FORECAST_MIN_DAYS`, types `Granularity`, `ResolvedGranularity`, `Aggregate`, `Bucket` |
| `@kotbo/ui/analytics/analyticsFormat` | `fmtNumber`, `fmtPct`, `fmtMinutes`, `fmtDuration`, `fmtDelta`, `shortDate`, `daysSince`, `SERIES`, `SERIES_NEUTRAL` |
| `@kotbo/ui/analytics/chartTable` | `chartTable(data, format)`, `nearestHeadingText(element, maxDepth)`, type `ChartTable` |
