import type { Aggregate } from './timeSeries.js';
export interface AnalyticsCardMetric {
    id: string;
    label: string;
    value: string;
    delta?: number | null;
    invert?: boolean;
    previous?: string;
    spark?: number[];
    color?: string;
    hint?: string;
    tag?: {
        text: string;
        badgeUrl?: string | null;
    };
    format?: (value: number) => string;
    values: (number | null)[];
    previousValues?: (number | null)[];
    aggregate?: Aggregate;
    canForecast?: boolean;
    forecastData?: {
        dates: string[];
        labels?: string[];
        values: number[];
        low?: number[];
        high?: number[];
    } | null;
}
export interface AnalyticsFact {
    label: string;
    value: string;
    sub?: string;
    tone?: 'success' | 'error' | 'neutral';
    wide?: boolean;
    title?: string;
}
export interface AnalyticsViewOption {
    id: string;
    icon: string;
    label: string;
    disabled?: boolean;
}
import { type Snippet } from 'svelte';
import { type FilterOption } from '../ui/FilterPills.svelte';
import { type MetricTab } from './MetricTabs.svelte';
import { type ChartMarker } from './TimeSeriesChart.svelte';
type $$ComponentProps = {
    metrics: AnalyticsCardMetric[];
    active?: string;
    onActiveChange?: (id: string) => void;
    labels: string[];
    periodOptions?: FilterOption<string>[];
    period?: string;
    onPeriodChange?: (value: string) => void;
    views?: AnalyticsViewOption[];
    view?: string;
    compare?: boolean;
    onToggleCompare?: () => void;
    smooth?: boolean;
    showForecast?: boolean;
    smoothingWindowSize?: number;
    autoScaleSpark?: boolean;
    markers?: ChartMarker[];
    facts?: AnalyticsFact[];
    tableHeaders?: string[];
    tableRows?: Array<{
        key?: string;
        label: string;
        cells: string[];
    }>;
    storageKey?: string;
    busy?: boolean;
    height?: number;
    onChartSelect?: (index: number) => void;
    toolbarExtra?: Snippet;
    layersExtra?: Snippet;
    beforePlot?: Snippet;
    customPlot?: Snippet<[string]>;
    metricBadge?: Snippet<[MetricTab]>;
    footer?: Snippet;
};
declare const AnalyticsChartCard: import("svelte").Component<$$ComponentProps, {}, "view" | "active" | "smooth" | "showForecast">;
type AnalyticsChartCard = ReturnType<typeof AnalyticsChartCard>;
export default AnalyticsChartCard;
