# Module `@kotbo/ui` — Composants UI, Actions, Stores & Coque

Point d'entrée principal de Kotbo-UI :

```ts
import {
  Button,
  Tabs,
  FilterPills,
  Modal,
  DashboardShell,
  toast,
  unsavedChanges,
  portal,
} from '@kotbo/ui';
```

## Catalogue des composants

### Primitives de mise en page et d'action

| Composant | Rôle | Props principales |
| --- | --- | --- |
| `Button` | Bouton d'action (`primary`, `secondary`, `ghost`, `danger`) ou lien si `href` est fourni | `variant`, `size` (`'sm' \| 'md'`), `icon`, `iconRight`, `loading`, `fullWidth`, `disabled`, `disabledReason`, `href`, `target` |
| `ActionButton` | Adaptateur de compatibilité (variantes historiques `neutral`/`muted`/`success`/`warning`) | `variant`, `size`, `label`, `icon`, `disabled`, `onClick` / `onclick` |
| `RefreshButton` | Bouton icône discret d'actualisation avec état `aria-busy` | `loading`, `label`, `ariaLabel`, `iconOnly`, `className`, `iconClass`, `onclick` |
| `Tabs` | Barre d'onglets `role="tablist"` avec navigation clavier (`←`, `→`, `Debut`, `Fin`) | `tabs: TabItem[]`, `active`, `onchange`, `label` |
| `FilterPills` | Pastilles génériques de filtrage (`generics="T extends string"`) distinctes des onglets | `options: FilterOption<T>[]`, `value`, `onchange`, `label`, `describedBy`, `disabled` |
| `Callout` | Encadré informatif dans le flux (`info`, `success`, `warning`, `danger`) | `variant`, `title`, `icon`, `actions` snippet, `children` |
| `SectionCard` | Carte structurée (en-tête avec icône, titre, description, `actions` et corps `flush` optionnel) | `title`, `description`, `icon`, `flush`, `actions`, `children` |
| `SettingsGroup` | Groupe de réglages avec en-tête et actions | `title`, `description`, `actions`, `children` |
| `SettingsRow` | Ligne libellé/description + contrôle aligné à droite (ou empilé via `stacked`) | `label`, `description`, `labelFor`, `stacked`, `children` |
| `ListGroup` | Titre discret, carte, lignes séparées par un filet rentré | `title`, `footer`, `id`, `children` |
| `ListRow` | Ligne d'un `ListGroup` ; toute la ligne est cliquable avec `href` ou `onclick` (sans réglage interactif dans `children` dans ce cas) | `label`, `description`, `icon`, `media`, `href`, `onclick`, `external`, `danger`, `stacked`, `children` |
| `Segmented` | Choix exclusif `radiogroup` avec navigation aux flèches | `options`, `value`, `onchange`, `label`, `stretch` |
| `StatTile` | Tuile KPI simple (icône, valeur, libellé) | `icon`, `tone` ou `variant` (`primary \| success \| warning \| danger \| neutral`), `value`, `label` |
| `Menu` | Menu contextuel téléporté dans `document.body` (`use:portal`) avec positionnement adaptatif | `items: MenuItem[]`, `label`, `icon`, `text` |
| `Breadcrumbs` | Lien de retour (`back`) ou fil d'Ariane structuré (`items: BreadcrumbItem[]`) | `back`, `items`, `ariaLabel` |
| `EmptyState` | État vide actionnable ou justifié (`reason`) | `icon`, `title`, `description`, `action`, `actionLabel`, `actionHref`, `onAction`, `reason` |
| `Skeleton` | Placeholders animés compatibles dimensions CSS ou classes utilitaires | `width`, `height`, `rounded`, `circle`, `radius`, `class` |
| `InlineFeedback` | Retour compact d'erreur/succès sous un contrôle | `message`, `error`, `idleText`, `state` |

### Overlays, modales & notifications

| Composant | Rôle | Props principales |
| --- | --- | --- |
| `Modal` | Fenêtre modale accessible (`use:portal`, `use:scrollLock`, `use:dialogFocus`) | `bind:open`, `onClose`, `title`, `ariaLabel`, `subtitle`, `size` (`sm \| md \| lg \| xl \| full \| screen`), `flush`, `aboveCase`, `footer` |
| `ConfirmModal` | Modale de confirmation avec liste d'`impacts`, saisie obligatoire (`requireInput`) et focus sûr | `bind:open`, `title`, `description`, `variant`, `requireInput`, `impacts`, `loading`, `onConfirm`, `onCancel` |
| `DetailSheet` | Fiche plein écran avec bannière, identité, onglets sticky et barre d'actions | `open`, `onClose`, `icon`, `title`, `subtitle`, `bannerUrl`, `leading`, `badges`, `actions`, `tabs`, `active`, `onchange`, `children` |
| `ToastContainer` & `Toast` | Zone `aria-live="polite"` affichant la pile de notifications (jusqu'à 4 simultanées) avec pause au survol/focus | Prop `item: ToastItem` sur `Toast` |
| `UnsavedChangesBar` | Bandeau fixe de sauvegarde / réinitialisation piloté par le store `unsavedChanges` | Aucune prop requise (lit `unsavedChanges`) |

### Formulaires, sélecteurs & calendrier

| Composant | Rôle | Props principales |
| --- | --- | --- |
| `Field` | Wrapper de champ générant `id` et `describedBy` et reliant label, aide et erreur | `label`, `hint`, `error`, `required`, `id`, `children(id, describedBy)` |
| `FormInput` | Champ texte/nombre avec label optionnel et liaison `bind:value` | `id`, `type`, `bind:value`, `placeholder`, `label`, `ariaLabel`, `describedBy`, `icon`, `required`, `disabled`, `readonly` |
| `FormSelect` | `<select>` natif stylé avec flèche SVG | `id`, `bind:value`, `multiple`, `disabled`, `ariaLabel`, `describedBy`, `children` |
| `FormTextarea` | Zone multiligne | `id`, `bind:value`, `rows`, `placeholder`, `ariaLabel`, `describedBy`, `disabled`, `readonly` |
| `ToggleSwitch` | Interrupteur `role="switch"` avec libellé accessible obligatoire ou fallback | `checked`, `disabled`, `onToggle`, `size` (`sm \| md \| lg`), `activeClass`, `id`, `ariaLabel` |
| `FormColorPicker` | Sélecteur hexadécimal avec prévisualisation temps réel et palette | `bind:value`, `presets`, `onchange` |
| `AmountRangeSlider` | Double curseur à paliers logarithmiques/ronds synchronisé avec des champs numériques | `range: { min, max }`, `bind:min`, `bind:max`, `labelMin`, `labelMax`, `labelRange`, `disabled` |
| `SearchableSelect` | Combobox téléportée avec filtrage insensible aux accents et création à la volée (`onCreate`) | `bind:value`, `options: SearchableOption[]`, `placeholder`, `clearable`, `showId`, `onCreate`, `onchange`, `oninput` |
| `MultiSelect` | Sélecteur multiple à puces (`role="combobox"` + `role="listbox"`) | `bind:values`, `options`, `placeholder`, `disabled`, `accentClass`, `id`, `describedBy`, `onchange` |
| `Calendar` | Agenda complet (jour, 2 jours, semaine, mois, liste agenda, glisser-déposer optionnel) | `bind:view`, `bind:currentDate`, `events: CalendarEvent[]`, `selectedKey`, `showWeekend`, `onRangeChange`, `onEventClick`, `onSlotSelect`, `onEventMove`, `canMove`, `canResize` |

### Coque d'application (`DashboardShell`)

`DashboardShell` fournit la mise en page complète (barre latérale repliable mémorisée dans `localStorage`, infobulles en mode rail, tiroir mobile, barre supérieure avec fil d'Ariane, menu compte avec sélecteur de thème `Auto / Clair / Sombre` et barre d'onglets mobile).

Props principales :
- `brandName`, `brandLogo`, `brandTag`, `brandHref`, `storageKey`
- `sectionLabel`, `secondarySectionLabel`, `activeTitle`
- `primaryNav: ShellNavItem[]`, `secondaryNav?: ShellSecondaryItem[]`, `userMenuLinks?: ShellUserMenuLink[]`
- `username`, `userRoleLabel`, `avatarUrl`
- `themeMode?: 'auto' | 'light' | 'dark'`, `onThemeChange`, `onNavigate`, `onLogout`
- Snippets : `renderIcon(name)`, `topbarLeft`, `topbarRight`, `userMenuExtra`, `children`

---

## Actions, Stores & Sous-exports JS purs

Pour que les tests unitaires (`bun test`) et utilitaires TypeScript fonctionnent sans charger de fichiers `.svelte`, les modules JS purs sont également exposés en sous-chemins dédiés :

| Import principal | Sous-export JS pur (`bun test` safe) | Symboles exportés |
| --- | --- | --- |
| `@kotbo/ui` | `@kotbo/ui/config` | `configureKotboUi`, `resetKotboUiConfig`, `getKotboUiConfig`, `getMessages`, `getLocale`, `notifyUi`, `DEFAULT_MESSAGES` |
| `@kotbo/ui` | `@kotbo/ui/actions/portal` | `portal` |
| `@kotbo/ui` | `@kotbo/ui/actions/dialogFocus` | `dialogFocus`, `type DialogFocusOptions` |
| `@kotbo/ui` | `@kotbo/ui/actions/scrollLock` | `lockBodyScroll`, `unlockBodyScroll`, `scrollLock` |
| `@kotbo/ui` | `@kotbo/ui/utils/pausableTimers` | `PausableTimers` |
| `@kotbo/ui` | `@kotbo/ui/utils/amountScale` | `amountSteps`, `nearestStepIndex`, `orderedAmounts`, `shiftedRange` |
| `@kotbo/ui` | `@kotbo/ui/utils/calendarLayout` | `layoutDay` |
| `@kotbo/ui` | `@kotbo/ui/utils/searchableSelectModel` | `normalizeSearch`, `filterOptions`, `displayedText`, `type SelectOption` |
| `@kotbo/ui` | — | `toast`, `unsavedChanges`, `UnsavedChangesStore`, `createUnsavedChangesStore` |

> **Notes** :
> - `toast.undoable(message, { commit, onUndo, onError, quietError, duration })` lance `commit()` à l'expiration de la bulle ou si l'utilisateur la ferme sans cliquer sur « Annuler ».
> - `unsavedChanges.setTracker(fn)` permet à l'application hôte (comme Kotbo) de brancher sa télémétrie sur `save`, `save_failed` et `discard`.
