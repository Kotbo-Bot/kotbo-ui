import { describe, expect, test } from 'bun:test';
import { chartTable } from './chartTable.js';

const fmt = (n: number) => String(n);

describe('chartTable : alternative textuelle des graphiques (RGAA 1.1)', () => {
  test('une ligne par libellé, une colonne par série', () => {
    const table = chartTable(
      { labels: ['Lun', 'Mar'], datasets: [{ label: 'Messages', data: [3, 5] }, { label: 'Membres', data: [1, 2] }] },
      fmt,
    );
    expect(table.series).toEqual(['Messages', 'Membres']);
    expect(table.rows).toEqual([
      { label: 'Lun', values: ['3', '1'] },
      { label: 'Mar', values: ['5', '2'] },
    ]);
  });

  test('points {x, y} sans libellés : x sert de libellé de ligne', () => {
    const table = chartTable(
      { datasets: [{ label: 'Score', data: [{ x: '2026-11-01', y: 4 }, { x: '2026-11-02', y: 7 }] }] },
      fmt,
    );
    expect(table.rows).toEqual([
      { label: '2026-11-01', values: ['4'] },
      { label: '2026-11-02', values: ['7'] },
    ]);
  });

  test('valeur absente : cellule vide', () => {
    const table = chartTable({ labels: ['A'], datasets: [{ label: 'S', data: [null] }] }, fmt);
    expect(table.rows).toEqual([{ label: 'A', values: [''] }]);
  });

  test('série sans nom : numérotée', () => {
    const table = chartTable({ labels: ['A'], datasets: [{ data: [1] }] }, fmt);
    expect(table.series).toEqual(['1']);
  });

  test('données vides ou absentes : tableau vide', () => {
    expect(chartTable(undefined, fmt)).toEqual({ series: [], rows: [] });
    expect(chartTable({ labels: [], datasets: [] }, fmt)).toEqual({ series: [], rows: [] });
  });
});
