export interface MetricTab {
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
}
import type { Snippet } from 'svelte';
import { type KotboUiMessages } from '../config.svelte.js';
type $$ComponentProps = {
    metrics: MetricTab[];
    active: string;
    onchange: (id: string) => void;
    compare?: boolean;
    label?: string;
    interactive?: boolean;
    deltaUnit?: 'pct' | 'pts';
    autoScaleSpark?: boolean;
    messages?: Partial<KotboUiMessages>;
    badge?: Snippet<[MetricTab]>;
};
declare const MetricTabs: import("svelte").Component<$$ComponentProps, {}, "">;
type MetricTabs = ReturnType<typeof MetricTabs>;
export default MetricTabs;
