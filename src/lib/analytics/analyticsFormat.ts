import { getLocale, getMessages, type KotboUiMessages } from '../config.svelte.js';

export function fmtNumber(n: number | null | undefined, locale = getLocale()): string {
  return (n ?? 0).toLocaleString(locale);
}

export function fmtPct(value: number, digits = 1, locale = getLocale()): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded.toLocaleString(locale, { maximumFractionDigits: digits })} %`;
}

export function fmtMinutes(
  minutes: number | null | undefined,
  msgs: Partial<KotboUiMessages> = getMessages(),
  locale = getLocale(),
): string {
  const m = getMessages(msgs);
  const value = minutes ?? 0;
  if (value < 60) return m.anx_unit_minutes({ count: fmtNumber(Math.round(value), locale) });
  return m.anx_unit_hours({ count: fmtNumber(Math.round(value / 60), locale) });
}

export function fmtDuration(
  seconds: number | null | undefined,
  msgs: Partial<KotboUiMessages> = getMessages(),
  locale = getLocale(),
): string {
  if (seconds === null || seconds === undefined) return '–';
  const m = getMessages(msgs);
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return m.anx_unit_seconds({ count: fmtNumber(s, locale) });
  if (s < 3600) return m.anx_unit_minutes({ count: fmtNumber(Math.round(s / 60), locale) });
  const h = Math.floor(s / 3600);
  const min = Math.round((s % 3600) / 60);
  return min > 0
    ? m.anx_unit_hours_minutes({ hours: fmtNumber(h, locale), minutes: String(min).padStart(2, '0') })
    : m.anx_unit_hours({ count: fmtNumber(h, locale) });
}

export function fmtDelta(
  delta: number | null,
  unit: 'pct' | 'pts' | 'abs',
  msgs: Partial<KotboUiMessages> = getMessages(),
  locale = getLocale(),
): string {
  const m = getMessages(msgs);
  if (delta === null) return m.anx_delta_new();
  const rounded = Number(delta.toFixed(1));
  if (rounded === 0) return '=';
  const sign = rounded > 0 ? '+' : '−';
  const abs = Math.abs(rounded).toLocaleString(locale, { maximumFractionDigits: 1 });
  if (unit === 'abs') return `${sign}${abs}`;
  return unit === 'pct' ? `${sign}${abs} %` : m.anx_unit_points({ value: `${sign}${abs}` });
}

export function shortDate(dateKey: string, locale = getLocale()): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

export function daysSince(dateKey: string | null): number | null {
  if (!dateKey) return null;
  return Math.floor((Date.now() - Date.parse(`${dateKey}T00:00:00Z`)) / (24 * 3600 * 1000));
}

export const SERIES = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
  'var(--series-7)',
  'var(--series-8)',
] as const;

export const SERIES_NEUTRAL = 'var(--series-neutral)';
