# Module `@kotbo/ui/styles` — Styles autonomes & Thèmes Sand / Night

Kotbo-UI n'utilise **pas Tailwind CSS** dans sa distribution. Tous les composants embarquent leurs propres styles scoped ou classes `.kotbo-*` appuyées sur des variables CSS avec valeurs de repli.

## Imports disponibles

```ts
// Import complet (jetons + styles de composants)
import '@kotbo/ui/styles';
// ou
import '@kotbo/ui/styles.css';

// Imports granulaires
import '@kotbo/ui/styles/tokens.css';
import '@kotbo/ui/styles/components.css';
```

**Ordre recommandé dans l'application hôte :**

Importez `@kotbo/ui/styles` **avant** votre feuille CSS locale (`app.css`), afin que vos surcharges de jetons (`--color-*`, `--series-*`, `--kotbo-*`) l'emportent proprement sans `!important` :

```ts
import '@kotbo/ui/styles';
import './app.css';
```

---

## Architecture des jetons (`tokens.css`)

### Thèmes clair (`Sand`) et sombre (`Night`)

Le thème suit `prefers-color-scheme: dark`, `.dark`, ou `[data-theme="dark"]` (forcé clair via `[data-theme="light"]`).

| Jeton | Défaut clair (`Sand`) | Défaut sombre (`Night`) | Rôle |
| --- | --- | --- | --- |
| `--color-background` | `#fcfbf8` | `#0f0f0f` | Fond principal |
| `--color-surface` / `--color-surface-container-lowest` | `#ffffff` | `#1c1c1c` | Fond de carte / surface élevée |
| `--color-surface-container-low` | `#f7f5f0` | `#151515` | Surface secondaire |
| `--color-surface-container` | `#f0ede6` | `#232323` | Conteneur neutre / pills |
| `--color-surface-container-high` | `#e7e2d8` | `#2c2c2c` | État actif / badge |
| `--color-on-surface` | `#491d11` | `#e4e4e4` | Encre principale |
| `--color-on-surface-variant` | `#6e5147` | `#a6a6a6` | Encre secondaire (contraste ≥ 4.5:1) |
| `--color-primary` / `--color-on-primary` | `#1f8f4e` / `#ffffff` | `#34c773` / `#082414` | Accent principal |
| `--color-outline` / `--color-outline-variant` | `#cfc6b8` / `#e5dfd4` | `#3d3d3d` / `#2c2c2c` | Bordures |
| `--color-success`, `--color-warning`, `--color-error` | Vert / Ambre / Rouge | Vert / Ambre / Rouge | Sémantique d'état (+ `--color-on-*-container`) |

### Palette Analytics (`--series-1..8` & `--series-neutral`)

Huit couleurs catégorielles distinctes adaptées aux deux thèmes + `--series-neutral` pour les courbes de référence (période précédente).

### Couches Z (`--layer-*`)

Échelle ordonnée (`--layer-bar`, `--layer-popover`, `--layer-modal`, `--layer-popover-over-modal`, `--layer-toast`, `--layer-tooltip`) évitant les collisions de `z-index` entre barres fixes, modales, menus portés dans `<body>` et notifications.

---

## Personnalisation moderne (exemple AegisAI)

AegisAI reprend exactement les mêmes composants que Kotbo Dashboard tout en conservant sa direction visuelle un peu plus moderne (palette bleu/slate `#0054db` / `#101a30` et cartes plus aérées) via de simples variables CSS dans `frontend/src/app.css` :

```css
:root {
  /* Palette AegisAI */
  --color-primary: #2a78d6;
  --color-surface-container: #ffffff;
  --color-surface-container-low: #f1f4f9;
  --color-outline-variant: #d8e1ee;

  /* Surcharges visuelles modernes par-dessus @kotbo/ui */
  --kotbo-chart-card-radius: 1.25rem;
  --kotbo-chart-card-padding: 1.25rem;
  --kotbo-chart-card-gap: 1.25rem;
  --kotbo-chart-card-bg: var(--surface);
  --kotbo-facts-padding-top: 1rem;
  --kotbo-fact-value-size: 1.05rem;
  --kotbo-fact-value-weight: 700;
}
```
