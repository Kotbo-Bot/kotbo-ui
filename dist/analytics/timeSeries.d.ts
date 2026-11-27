export type Granularity = 'auto' | 'hour' | 'day' | 'week' | 'month';
export type ResolvedGranularity = Exclude<Granularity, 'auto'>;
export type Aggregate = 'sum' | 'avg';
export declare function resolveGranularity(requested: Granularity, days: number, hourlyAvailable: boolean): ResolvedGranularity;
export interface Bucket {
    key: string;
    indices: number[];
    partial: boolean;
}
export declare function weekStart(key: string): string;
export declare function bucketDays(dates: string[], granularity: 'day' | 'week' | 'month'): Bucket[];
export declare function aggregate(values: number[], buckets: Bucket[], how: Aggregate): number[];
export declare function smoothingWindow(granularity: ResolvedGranularity): number;
export declare function movingAverage(values: (number | null)[], window: number): (number | null)[];
export declare function trendPct(values: number[]): number | null;
export interface Forecast {
    dates: string[];
    values: number[];
    low: number[];
    high: number[];
}
export declare const FORECAST_MIN_DAYS = 28;
export declare function forecast(daily: number[], dates: string[], horizon: number): Forecast | null;
export declare function daysLeftInMonth(key: string): number;
