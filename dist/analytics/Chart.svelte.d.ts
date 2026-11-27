import { Chart, type ChartTypeRegistry } from 'chart.js';
type $$ComponentProps = {
    data: any;
    type?: keyof ChartTypeRegistry;
    options?: any;
    height?: number;
    width?: number | null;
    plugins?: any[];
    label?: string;
};
declare const Chart: import("svelte").Component<$$ComponentProps, {}, "">;
type Chart = ReturnType<typeof Chart>;
export default Chart;
