import type { Snippet } from 'svelte';
type $$ComponentProps = {
    title?: string;
    description?: string;
    icon?: string;
    flush?: boolean;
    class?: string;
    actions?: Snippet;
    children?: Snippet;
};
declare const SectionCard: import("svelte").Component<$$ComponentProps, {}, "">;
type SectionCard = ReturnType<typeof SectionCard>;
export default SectionCard;
