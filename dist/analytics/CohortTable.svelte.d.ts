export interface CohortRow {
    week: string;
    size: number;
    retention: (number | null)[];
}
type $$ComponentProps = {
    title: string;
    description?: string;
    cohorts?: CohortRow[];
    weeks?: number;
    loading?: boolean;
    error?: string;
    notice?: string;
    columnPrefix?: string;
};
declare const CohortTable: import("svelte").Component<$$ComponentProps, {}, "">;
type CohortTable = ReturnType<typeof CohortTable>;
export default CohortTable;
