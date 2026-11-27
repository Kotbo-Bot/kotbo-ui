/**
 * Correspondance entre les noms d'icones utilises dans le dashboard
 * (Material Symbols, Lucide/Feather, Phosphor) et les icones Papicons.
 *
 * Un nom absent de cette table est converti en PascalCase par toPapiconsName,
 * puis rendu par Lucide si Papicons ne le fournit pas.
 */
export declare const iconAliases: Record<string, string>;
export declare const fallbackIconName = "Grid";
/** Resout un nom d'icone quelconque en nom Papicons/Lucide (PascalCase). */
export declare function toPapiconsName(value: unknown): string;
