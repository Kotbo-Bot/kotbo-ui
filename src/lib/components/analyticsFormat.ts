import type { FormatMessages } from "#lib/lib/paraglide.ts";

export function fmtNumber(n: number | null | undefined, locale = 'fr'): string {
  return (n ?? 0).toLocaleString(locale);
}

/** Pourcentage avec une décimale au plus : « 7,9 % ». */
export function fmtPct(value: number, digits = 1, locale = 'fr'): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded.toLocaleString(locale, { maximumFractionDigits: digits })} %`;
}

/** Minutes lues en heures : « 2 940 h », ou « 45 min » sous l'heure. */
export function fmtMinutes(
  minutes: number | null | undefined,
  messages: Pick<FormatMessages, 'anx_unit_minutes' | 'anx_unit_hours'>,
  locale = 'fr',
): string {
  const value = minutes ?? 0;
  if (value < 60) return messages.anx_unit_minutes({ count: fmtNumber(Math.round(value), locale) });
  return messages.anx_unit_hours({ count: fmtNumber(Math.round(value / 60), locale) });
}

/** Durée en secondes lue à l'échelle utile : « 45 s », « 3 min », « 1 h 20 ». */
export function fmtDuration(
  seconds: number | null | undefined,
  messages: Pick<
    FormatMessages,
    'anx_unit_seconds' | 'anx_unit_minutes' | 'anx_unit_hours_minutes' | 'anx_unit_hours'
  >,
  locale = 'fr',
): string {
  if (seconds === null || seconds === undefined) return '–';
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return messages.anx_unit_seconds({ count: fmtNumber(s, locale) });
  if (s < 3600) return messages.anx_unit_minutes({ count: fmtNumber(Math.round(s / 60), locale) });
  const h = Math.floor(s / 3600);
  const min = Math.round((s % 3600) / 60);
  return min > 0
    ? messages.anx_unit_hours_minutes({
        hours: fmtNumber(h, locale),
        minutes: String(min).padStart(2, '0'),
      })
    : messages.anx_unit_hours({ count: fmtNumber(h, locale) });
}

/** Écart signé : « +12 % », « −3 pts », « +40 », « = ». */
export function fmtDelta(
  delta: number | null,
  unit: 'pct' | 'pts' | 'abs',
  messages: Pick<FormatMessages, 'anx_delta_new' | 'anx_unit_points'>,
  locale = 'fr',
): string {
  if (delta === null) return messages.anx_delta_new();
  const rounded = Number(delta.toFixed(1));
  if (rounded === 0) return '=';
  const sign = rounded > 0 ? '+' : '−';
  const abs = Math.abs(rounded).toLocaleString(locale, { maximumFractionDigits: 1 });
  if (unit === 'abs') return `${sign}${abs}`;
  return unit === 'pct' ? `${sign}${abs} %` : messages.anx_unit_points({ value: `${sign}${abs}` });
}

export function shortDate(dateKey: string, locale = 'fr'): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

/** Jours écoulés depuis une clé de jour. */
export function daysSince(dateKey: string | null): number | null {
  if (!dateKey) return null;
  return Math.floor((Date.now() - Date.parse(`${dateKey}T00:00:00Z`)) / (24 * 3600 * 1000));
}

/** Couleurs catégorielles, dans l'ordre fixe de la palette. */
export const SERIES = [
  'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)',
  'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)',
] as const;
export const SERIES_NEUTRAL = 'var(--series-neutral)';