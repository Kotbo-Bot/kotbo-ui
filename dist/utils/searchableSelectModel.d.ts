export type SelectOption = {
    id: string;
    name: string;
};
export declare function normalizeSearch(text: string): string;
export declare function filterOptions<T extends SelectOption>(options: readonly T[], query: string, selectedName: string | null): T[];
export declare function displayedText(value: string | null, options: readonly SelectOption[]): string | null;
