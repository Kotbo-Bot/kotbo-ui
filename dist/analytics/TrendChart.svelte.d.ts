type $$ComponentProps = {
    dates: string[];
    values: number[];
    previous?: number[];
    label: string;
    previousLabel: string;
    compare?: boolean;
    color?: string;
    height?: number;
    format?: (value: number) => string;
};
declare const TrendChart: import("svelte").Component<$$ComponentProps, {}, "">;
type TrendChart = ReturnType<typeof TrendChart>;
export default TrendChart;
