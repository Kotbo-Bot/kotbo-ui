import type { Snippet } from 'svelte';
type $$ComponentProps = {
    label?: string;
    description?: string;
    labelFor?: string | undefined;
    stacked?: boolean;
    children?: Snippet;
};
declare const SettingsRow: import("svelte").Component<$$ComponentProps, {}, "">;
type SettingsRow = ReturnType<typeof SettingsRow>;
export default SettingsRow;
