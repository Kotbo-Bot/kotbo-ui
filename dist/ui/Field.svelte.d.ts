import type { Snippet } from 'svelte';
type $$ComponentProps = {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    id?: string;
    class?: string;
    children: Snippet<[string, string | undefined]>;
};
declare const Field: import("svelte").Component<$$ComponentProps, {}, "">;
type Field = ReturnType<typeof Field>;
export default Field;
