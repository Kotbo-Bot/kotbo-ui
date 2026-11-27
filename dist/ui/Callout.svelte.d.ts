import type { Snippet } from 'svelte';
type Variant = 'info' | 'success' | 'warning' | 'danger';
type $$ComponentProps = {
    variant?: Variant;
    title?: string;
    icon?: string;
    class?: string;
    children?: Snippet;
    actions?: Snippet;
};
declare const Callout: import("svelte").Component<$$ComponentProps, {}, "">;
type Callout = ReturnType<typeof Callout>;
export default Callout;
