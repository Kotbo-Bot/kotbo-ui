# @kotbo/ui (futur `Kotbo-ui`)

Bibliothèque partagée de composants **Svelte 5** et de visualisations **Analytics v3** pour l'écosystème Kotbo (Kotbo Dashboard, AegisAI, etc.).

- **CSS autonome** (aucune dépendance à Tailwind CSS) avec jetons Sand / Night (`--color-*`, `--series-1..8`, `--layer-*`).
- **i18n configurable** (français par défaut, surchargeable via `configureKotboUi`).
- **Accessibilité RGAA** intégrée (focus trap, navigation clavier, tableaux `sr-only` pour les graphiques).

## Points d'entrée

- `@kotbo/ui` — Primitives UI, modales, formulaires, sélecteurs, calendrier, `DashboardShell`, `toast`, actions Svelte.
- `@kotbo/ui/analytics` — `AnalyticsChartCard`, `MetricTabs`, `Sparkline`, `KpiTile`, `Chart`, `TimeSeriesChart`, `TrendChart`, `BarList`, `ShareBar`, `CohortTable`, `TopList`, `AnalyticsSkeleton`, helpers `timeSeries`, `analyticsFormat`, `chartTable`.
- `@kotbo/ui/icons` — `Papicon` + registres statiques Papicons et Lucide.
- `@kotbo/ui/styles` — `tokens.css` + `components.css` (ou imports séparés `@kotbo/ui/styles/tokens.css`, `@kotbo/ui/styles/components.css`).

## Utilisation

```ts
import '@kotbo/ui/styles';
import { configureKotboUi, Button, Modal, toast } from '@kotbo/ui';
import { AnalyticsChartCard, MetricTabs, Sparkline } from '@kotbo/ui/analytics';
```

## Développement & Build

```bash
bun install
bun run dev
bun run check
bun test
bun run build
```
