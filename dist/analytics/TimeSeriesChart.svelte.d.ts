export type ChartMode = 'line' | 'bar' | 'stacked' | 'lines';
export interface ChartMarker {
    index: number;
    tone: 'note' | 'up' | 'down';
    text: string;
}
type $$ComponentProps = {
    labels: string[];
    mode: ChartMode;
    main?: {
        label: string;
        values: (number | null)[];
        color: string;
    } | null;
    previous?: {
        label: string;
        values: (number | null)[];
    } | null;
    smoothed?: {
        label: string;
        values: (number | null)[];
    } | null;
    projection?: {
        label: string;
        values: (number | null)[];
        low?: (number | null)[];
        high?: (number | null)[];
    } | null;
    stacks?: Array<{
        label: string;
        values: (number | null)[];
        color: string;
    }>;
    markers?: ChartMarker[];
    format?: (value: number) => string;
    height?: number;
    onselect?: (index: number) => void;
};
declare const TimeSeriesChart: import("svelte").Component<$$ComponentProps, {}, "">;
type TimeSeriesChart = ReturnType<typeof TimeSeriesChart>;
export default TimeSeriesChart;
