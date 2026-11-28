import type { Snippet } from 'svelte';
type $$ComponentProps = {
    icon?: string;
    label: string;
    description?: string;
    href?: string;
    onclick?: () => void;
    external?: boolean;
    danger?: boolean;
    /** Le réglage passe sous le libellé (sélecteur large, champ). */
    stacked?: boolean;
    /** Remplace la pastille d'icône (avatar, image). */
    media?: Snippet;
    children?: Snippet;
};
declare const ListRow: import("svelte").Component<$$ComponentProps, {}, "">;
type ListRow = ReturnType<typeof ListRow>;
export default ListRow;
