type TileVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type $$ComponentProps = {
    icon: string;
    tone?: string;
    variant?: TileVariant;
    value: string | number;
    label: string;
    class?: string;
};
declare const StatTile: import("svelte").Component<$$ComponentProps, {}, "">;
type StatTile = ReturnType<typeof StatTile>;
export default StatTile;
