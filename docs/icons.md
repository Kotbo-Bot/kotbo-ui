# Module `@kotbo/ui/icons` — `Papicon` & registres statiques

Point d'entrée dédié aux icônes du design system Kotbo-UI :

```ts
import { Papicon, iconAliases, fallbackIconName, toPapiconsName } from '@kotbo/ui/icons';
```

> `Papicon` est également réexporté par `@kotbo/ui`.

## Fonctionnement

`Papicon` unifie les noms historiques utilisés dans Kotbo et AegisAI à travers une table statique d'alias (`papicons.ts`) et deux registres tree-shakés :
1. **`papiconComponents.ts`** : sous-ensemble d'icônes `@getpapillon/papicons` (dépaquetage des éléments React SVG en `<svg>` natif Svelte).
2. **`lucide.ts`** : repli automatique vers le sous-ensemble statique `lucide-svelte` lorsque l'icône demandée n'a pas d'équivalent Papicons ou échoue au dépaquetage.

### Props de `Papicon`

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `icon` | `string` | `''` | Nom canonique ou alias d'icône |
| `name` | `string` | `''` | Alias historique accepté à la place d'`icon` |
| `size` | `number` | `24` | Taille en pixels (`width` et `height`) |
| `class` / `className` / `class_` | `string` | `''` | Classes CSS transmises au `<svg>` |
| `style` | `string` | `''` | Style inline optionnel |

## Accessibilité (RGAA 1.2)

Toutes les icônes rendues par `Papicon` (qu'elles proviennent de Papicons ou de Lucide) portent systématiquement `aria-hidden="true"` et `focusable="false"` : le sens doit toujours être porté par le texte voisin ou l'`aria-label` du bouton/lien parent.

## Exports disponibles

- `Papicon` (`Svelte Component`)
- `iconAliases`: table de correspondance des alias (Material, Lucide, Phosphor, noms internes)
- `toPapiconsName(name)` : résout le nom Papicons cible
- `fallbackIconName(name)` : résout le nom de repli Lucide
- `getPapicon(name)` : résout le composant SVG Papicons du registre
- `getLucideIcon(name)` : résout le composant `lucide-svelte` du registre
