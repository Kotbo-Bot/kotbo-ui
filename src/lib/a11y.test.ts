import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LIB = join(import.meta.dir);

describe('garde-fou accessibilité @kotbo/ui', () => {
  test('Chart masque le canvas et expose un tableau sr-only', () => {
    const src = readFileSync(join(LIB, 'analytics/Chart.svelte'), 'utf-8');
    expect(src).toContain('aria-hidden="true"');
    expect(src).toContain('chartTable(');
    expect(src).toContain('<table');
  });

  test('MetricTabs utilise radiogroup et radio', () => {
    const src = readFileSync(join(LIB, 'analytics/MetricTabs.svelte'), 'utf-8');
    expect(src).not.toContain('role="tab"');
    expect(src).toContain('role="radiogroup"');
    expect(src).toContain('role="radio"');
  });

  test('MultiSelect sépare status et listbox et pose combobox sur input', () => {
    const src = readFileSync(join(LIB, 'ui/MultiSelect.svelte'), 'utf-8');
    expect(src).toContain('role="combobox"');
    expect(src).toContain('role="listbox"');
    expect(src).toContain('role="status"');
  });

  test('Papicon rend ses icônes décoratives avec aria-hidden="true"', () => {
    const src = readFileSync(join(LIB, 'icons/Papicon.svelte'), 'utf-8');
    expect(src).toContain('aria-hidden="true"');
  });
});
