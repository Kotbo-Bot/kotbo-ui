import type { Snippet } from 'svelte';
type SelectValue = string | string[];
type $$ComponentProps = {
    id?: string;
    ariaLabel?: string;
    describedBy?: string | undefined;
    'aria-describedby'?: string | undefined;
    value?: SelectValue;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    onchange?: (event: Event) => void;
    children?: Snippet;
};
declare const FormSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormSelect = ReturnType<typeof FormSelect>;
export default FormSelect;
