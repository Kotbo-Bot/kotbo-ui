export type Granularity = 'auto' | 'hour' | 'day' | 'week' | 'month';
export type ResolvedGranularity = Exclude<Granularity, 'auto'>;
export type Aggregate = 'sum' | 'avg';

const DAY_MS = 24 * 3600 * 1000;
const parseKey = (key: string) => Date.parse(`${key}T00:00:00Z`);
const keyOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function resolveGranularity(requested: Granularity, days: number, hourlyAvailable: boolean): ResolvedGranularity {
  if (requested === 'hour') return hourlyAvailable ? 'hour' : 'day';
  if (requested !== 'auto') return requested;
  if (days <= 2 && hourlyAvailable) return 'hour';
  if (days <= 92) return 'day';
  return 'week';
}

export interface Bucket {
  key: string;
  indices: number[];
  partial: boolean;
}

export function weekStart(key: string): string {
  const ms = parseKey(key);
  const weekday = (new Date(ms).getUTCDay() + 6) % 7;
  return keyOf(ms - weekday * DAY_MS);
}

export function bucketDays(dates: string[], granularity: 'day' | 'week' | 'month'): Bucket[] {
  if (granularity === 'day') return dates.map((key, i) => ({ key, indices: [i], partial: false }));
  const buckets: Bucket[] = [];
  const byKey = new Map<string, Bucket>();
  dates.forEach((date, i) => {
    const key = granularity === 'week' ? weekStart(date) : `${date.slice(0, 7)}-01`;
    let bucket = byKey.get(key);
    if (!bucket) {
      bucket = { key, indices: [], partial: false };
      byKey.set(key, bucket);
      buckets.push(bucket);
    }
    bucket.indices.push(i);
  });
  for (const bucket of buckets) {
    if (granularity === 'week') {
      bucket.partial = bucket.indices.length < 7;
    } else {
      const [y, m] = bucket.key.split('-').map(Number) as [number, number];
      const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
      bucket.partial = bucket.indices.length < daysInMonth;
    }
  }
  return buckets;
}

export function aggregate(values: number[], buckets: Bucket[], how: Aggregate): number[] {
  return buckets.map((bucket) => {
    const sum = bucket.indices.reduce((s, i) => s + (values[i] ?? 0), 0);
    if (how === 'sum') return sum;
    return bucket.indices.length > 0 ? Math.round((sum / bucket.indices.length) * 10) / 10 : 0;
  });
}

export function smoothingWindow(granularity: ResolvedGranularity): number {
  return { hour: 24, day: 7, week: 4, month: 3 }[granularity];
}

export function movingAverage(values: (number | null)[], window: number): (number | null)[] {
  return values.map((_, i) => {
    const slice = values
      .slice(Math.max(0, i - window + 1), i + 1)
      .filter((v): v is number => v !== null && Number.isFinite(v));
    if (slice.length === 0) return null;
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    return Math.round(avg * 10) / 10;
  });
}

export function trendPct(values: number[]): number | null {
  if (values.length < 4) return null;
  const n = Math.min(7, Math.floor(values.length / 2));
  const first = values.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const last = values.slice(-n).reduce((s, v) => s + v, 0) / n;
  if (first === 0) return last === 0 ? 0 : null;
  return ((last - first) / first) * 100;
}

export interface Forecast {
  dates: string[];
  values: number[];
  low: number[];
  high: number[];
}

export const FORECAST_MIN_DAYS = 28;

function seasonalMean(values: number[], i: number): number | null {
  const ref = [7, 14, 21, 28].map((lag) => values[i - lag]).filter((v): v is number => v !== undefined);
  return ref.length >= 3 ? ref.reduce((s, v) => s + v, 0) / ref.length : null;
}

export function forecast(daily: number[], dates: string[], horizon: number): Forecast | null {
  if (daily.length < FORECAST_MIN_DAYS || horizon <= 0 || dates.length !== daily.length) return null;
  const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
  const recent = sum(daily.slice(-14));
  const before = sum(daily.slice(-28, -14));
  const factor = before > 0 ? Math.min(1.25, Math.max(0.75, recent / before)) : 1;

  const errors: number[] = [];
  for (let i = daily.length - 15; i < daily.length; i += 1) {
    const expected = seasonalMean(daily, i);
    if (expected !== null) errors.push(daily[i]! - expected);
  }
  const std = errors.length > 1 ? Math.sqrt(sum(errors.map((e) => e * e)) / (errors.length - 1)) : 0;

  const series = [...daily];
  const out: Forecast = { dates: [], values: [], low: [], high: [] };
  const lastKey = dates[dates.length - 1]!;
  for (let h = 1; h <= horizon; h += 1) {
    const i = series.length;
    const value = Math.max(0, Math.round((seasonalMean(series, i) ?? 0) * factor));
    series.push(value);
    out.dates.push(keyOf(parseKey(lastKey) + h * DAY_MS));
    out.values.push(value);
    out.low.push(Math.max(0, Math.round(value - 1.28 * std)));
    out.high.push(Math.round(value + 1.28 * std));
  }
  return out;
}

export function daysLeftInMonth(key: string): number {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m, 0)).getUTCDate() - d;
}
