type Point = {
    x?: unknown;
    y?: unknown;
} | number | null | undefined;
type ChartDataLike = {
    labels?: unknown[];
    datasets?: {
        label?: string;
        data?: Point[];
    }[];
};
export type ChartTable = {
    series: string[];
    rows: {
        label: string;
        values: string[];
    }[];
};
export declare function chartTable(data: ChartDataLike | undefined, format: (n: number) => string): ChartTable;
export declare function nearestHeadingText(element: Element, maxDepth?: number): string;
export {};
