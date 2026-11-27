# Internationalisation (`configureKotboUi`) & Intégrations

Kotbo-UI est **indépendant de tout runtime i18n** (pas de dépendance Paraglide dans le paquet). Tous les libellés intégrés disposent de valeurs par défaut en français (`DEFAULT_MESSAGES`) et sont réactifs via `createSubscriber` (`svelte/reactivity`).

## Configuration globale (`@kotbo/ui` ou `@kotbo/ui/config`)

```ts
import { configureKotboUi, resetKotboUiConfig } from '@kotbo/ui';
// ou sans dépendance .svelte (tests Bun / Node) :
import { configureKotboUi } from '@kotbo/ui/config';

configureKotboUi({
  locale: 'en-GB', // ou un getter réactif () => activeLocale
  messages: {
    common_cancel: () => 'Cancel',
    anx_view_line: () => 'Line chart',
    select_no_result_for: ({ query }) => `No result for "${query}"`,
  },
  onNotify: (msg) => toast.info(msg),
});
```

### API exposée

- `configureKotboUi(partial)`: fusionne `locale`, `messages` (`Partial<KotboUiMessages>`) et `onNotify`, puis notifie tous les composants Svelte montés.
- `resetKotboUiConfig()`: restaure `'fr-FR'` et les messages par défaut.
- `getLocale()`: retourne la locale active (`string`).
- `getMessages(overrides?)`: fusionne `DEFAULT_MESSAGES`, la configuration globale et d'éventuelles surcharges locales par composant.
- `notifyUi(message, fallback?)`: passe par `onNotify` si configuré, sinon exécute `fallback`.

---

## Intégration 1 : Kotbo Dashboard (`Kotbo/apps/dashboard`)

Kotbo utilise **Paraglide-JS** et **Tailwind CSS v4**. Pour que les composants `@kotbo/ui` changent de langue à chaud sans recharger la page et respectent les 189+ appels existants :

1. **Pont i18n** (`src/lib/kotboUiBridge.ts`) : mappe l'ensemble des clés `KotboUiMessages` vers les messages Paraglide `m.*()` et la fonction `dateLocale()`.
2. **Synchronisation à chaud** (`src/lib/liveLocale.svelte.ts`) : `apply(lang)` appelle `syncKotboUiConfig()` après chaque changement de langue.
3. **Wrappers locaux conservés** (`src/lib/components/**`) : tous les chemins d'import historiques du dashboard restent inchangés et délèguent par wrappers fins vers `@kotbo/ui`, `@kotbo/ui/analytics`, `@kotbo/ui/icons` et les sous-exports purs `@kotbo/ui/utils/*` / `@kotbo/ui/actions/*`.
4. **Garde-fous RGAA** (`src/lib/a11yGuard.test.ts`) : vérifie directement le code de `@kotbo/ui/dist` pour `Chart`, `MetricTabs`, `MultiSelect` et `Papicon`.

---

## Intégration 2 : AegisAI (`aegisai-api/frontend`)

AegisAI utilise **Svelte 5 + CSS natif** (sans Tailwind, sans Paraglide) :

1. `main.ts` importe `'@kotbo/ui/styles'` avant `'./app.css'`.
2. `src/lib/components/DashboardShell.svelte` délègue à `DashboardShell` de `@kotbo/ui` en fournissant le snippet `renderIcon`, le menu utilisateur Aegis et `themeStore`.
3. `src/lib/components/analytics/AnalyticsChartCard.svelte` adapte `AnalyticsSummary` vers `AnalyticsChartCard` de `@kotbo/ui/analytics` et conserve les sous-cartes métier propres à AegisAI (distribution des longueurs de messages et matrice de décision IA).
4. `src/app.css` applique la palette bleu/slate d'AegisAI et les jetons `--kotbo-chart-card-*` / `--kotbo-fact-value-*` pour garder son rendu un peu plus moderne par-dessus les composants Kotbo.
