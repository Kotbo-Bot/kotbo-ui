# Kotbo-UI (`@kotbo/ui`)

Bibliothèque partagée de composants **Svelte 5** et de visualisations **Analytics v3** extraite de **Kotbo Dashboard** et réutilisée dans l'écosystème Kotbo (`Kotbo`, `AegisAI`, futures applications).

- **CSS 100 % autonome** : aucune dépendance à Tailwind CSS dans la bibliothèque. Livré avec les jetons Sand / Night (`--color-*`, `--series-1..8`, `--kotbo-*`) et les feuilles dédiées.
- **Personnalisable par jetons CSS** : Kotbo garde son style dense (`0.875rem`), tandis qu'AegisAI applique sa surcouche plus moderne (`1.25rem`, palette bleu/slate) sans forker un seul composant.
- **i18n réactive sans Paraglide** : français par défaut, surchargeable à chaud via `configureKotboUi`.
- **Sous-exports JS purs** : exploitables directement sous `bun test` et outils Node/Bun sans compilateur Svelte.
- **Accessibilité RGAA intégrée** : focus trap modal, navigation clavier (`tablist`, `radiogroup`, `listbox`), alternatives en tableau `sr-only` pour tous les graphiques Canvas.

## Documentation dédiée par module

| Module / Sujet | Guide | Rôle |
| --- | --- | --- |
| **`@kotbo/ui`** | [docs/ui.md](./docs/ui.md) | Primitives UI, modales/tiroirs, formulaires, sélecteurs, calendrier, `DashboardShell`, stores, actions et sous-exports purs |
| **`@kotbo/ui/analytics`** | [docs/analytics.md](./docs/analytics.md) | Composants **Analytics v3** (`AnalyticsChartCard`, `MetricTabs`, `Chart`, `TimeSeriesChart`, `TopList`, `CohortTable`…) et helpers |
| **`@kotbo/ui/icons`** | [docs/icons.md](./docs/icons.md) | Composant `Papicon`, registres statiques `@getpapillon/papicons` + `lucide-svelte`, alias et accessibilité |
| **`@kotbo/ui/styles`** | [docs/styles-theming.md](./docs/styles-theming.md) | Architecture CSS autonome, jetons Sand/Night, séries et personnalisation moderne AegisAI |
| **i18n & intégrations** | [docs/i18n-integration.md](./docs/i18n-integration.md) | Configuration `configureKotboUi`, pont Paraglide (`Kotbo`) et intégration CSS native (`AegisAI`) |

## Installation (Bun uniquement)

```json
{
  "dependencies": {
    "@kotbo/ui": "github:Kotbo-Bot/kotbo-ui"
  }
}
```

> Pour le développement local côte à côte avant push, vous pouvez pointer temporairement vers `"file:../Kotbo-ui"`.

```bash
bun install
```

## Démarrage rapide

```ts
// main.ts
import '@kotbo/ui/styles';
import './app.css';
```

```svelte
<script lang="ts">
  import { Button, SectionCard, toast } from '@kotbo/ui';
  import { AnalyticsChartCard } from '@kotbo/ui/analytics';
  import { Papicon } from '@kotbo/ui/icons';
</script>

<SectionCard title="Activité" icon="activity">
  <Button variant="primary" onclick={() => toast.success('Enregistré')}>
    <Papicon icon="check" size={16} /> Valider
  </Button>
</SectionCard>
```

## Développement & Qualité

```bash
bun install
bun run dev        # Showcase interactif local
bun run check      # svelte-kit sync + svelte-check (0 erreur, 0 warning)
bun test           # Tests unitaires et garde-fous d'accessibilité
bun run build:pkg  # svelte-package + publint
bun run build      # Package + application de démonstration
```
