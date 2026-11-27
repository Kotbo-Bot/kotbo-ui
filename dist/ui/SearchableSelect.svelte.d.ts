export interface SearchableOption {
    id: string;
    name: string;
    color?: string | null;
    icon?: string;
}
type $$ComponentProps = {
    id?: string;
    describedBy?: string | undefined;
    value?: string | null;
    options?: SearchableOption[];
    placeholder?: string;
    className?: string;
    clearable?: boolean;
    disabled?: boolean;
    showId?: boolean;
    onCreate?: ((name: string) => Promise<{
        id: string;
        name: string;
    } | null>) | null;
    onchange?: (value: string | null) => void;
    oninput?: (value: string | null) => void;
};
declare const SearchableSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type SearchableSelect = ReturnType<typeof SearchableSelect>;
export default SearchableSelect;
