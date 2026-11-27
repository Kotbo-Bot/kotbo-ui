type $$ComponentProps = {
    label: string;
    value: string;
    delta?: number | null;
    unit?: 'pct' | 'pts' | 'abs';
    compare?: boolean;
    invert?: boolean;
    hint?: string;
};
declare const KpiTile: import("svelte").Component<$$ComponentProps, {}, "">;
type KpiTile = ReturnType<typeof KpiTile>;
export default KpiTile;
