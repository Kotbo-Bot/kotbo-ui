import { afterEach, describe, expect, test } from 'bun:test';
import { configureKotboUi, resetKotboUiConfig } from '../config.svelte.js';
import { fmtDelta, fmtDuration, fmtMinutes, fmtPct } from './analyticsFormat.js';

afterEach(() => {
  resetKotboUiConfig();
});

describe('analyticsFormat & configureKotboUi', () => {
  test('formate les durées, pourcentages et écarts en français par défaut', () => {
    expect(fmtMinutes(45)).toBe('45 min');
    expect(fmtMinutes(120)).toBe('2 h');
    expect(fmtDuration(undefined)).toBe('–');
    expect(fmtDuration(45)).toBe('45 s');
    expect(fmtDelta(null, 'pct')).toBe('nouveau');
    expect(fmtDelta(0, 'pct')).toBe('=');
    expect(fmtPct(12.34)).toContain('%');
  });

  test('respecte les surcharges de messages via configureKotboUi', () => {
    configureKotboUi({
      locale: 'en-US',
      messages: {
        anx_delta_new: () => 'new',
        anx_unit_minutes: ({ count }) => `${count} mins`,
      },
    });
    expect(fmtDelta(null, 'pct')).toBe('new');
    expect(fmtMinutes(15)).toBe('15 mins');
  });
});
