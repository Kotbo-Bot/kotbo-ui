type $$ComponentProps = {
    values?: string[];
    options?: Array<{
        id: string;
        name: string;
    }>;
    placeholder?: string | undefined;
    disabled?: boolean;
    accentClass?: string;
    id?: string;
    describedBy?: string | undefined;
    onchange?: (values: string[]) => void;
};
declare const MultiSelect: import("svelte").Component<$$ComponentProps, {}, "values">;
type MultiSelect = ReturnType<typeof MultiSelect>;
export default MultiSelect;
