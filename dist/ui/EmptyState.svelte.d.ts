import type { Snippet } from 'svelte';
type $$ComponentProps = {
    icon?: string;
    title?: string;
    description?: string;
    action?: Snippet;
    actionLabel?: string;
    actionHref?: string;
    actionIcon?: string;
    onAction?: () => void;
    reason?: 'all-clear' | 'accumulating' | 'nothing-matches' | 'read-only' | 'instruction';
};
declare const EmptyState: import("svelte").Component<$$ComponentProps, {}, "">;
type EmptyState = ReturnType<typeof EmptyState>;
export default EmptyState;
