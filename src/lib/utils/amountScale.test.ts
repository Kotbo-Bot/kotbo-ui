import { describe, expect, test } from 'bun:test';
import { amountSteps, nearestStepIndex, orderedAmounts, shiftedRange } from './amountScale.js';

const LARGE = { min: 1, max: 1_000_000 };
const SMALL = { min: 1, max: 10 };

describe('paliers du curseur de montants', () => {
  test('petite plage : chaque valeur est un palier', () => {
    expect(amountSteps(SMALL)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('grande plage : des valeurs rondes, croissantes, bornes incluses', () => {
    const steps = amountSteps(LARGE);
    expect(steps[0]).toBe(LARGE.min);
    expect(steps.at(-1)).toBe(LARGE.max);
    expect(steps).toContain(50);
    expect(steps).toContain(250);
    expect(steps).toContain(10_000);
    expect(steps.every((step, index) => index === 0 || step > steps[index - 1])).toBe(true);
    expect(steps.length).toBeLessThan(80);
  });

  test('une valeur saisie hors palier place le curseur sur le plus proche', () => {
    const steps = amountSteps(LARGE);
    expect(steps[nearestStepIndex(steps, 50)]).toBe(50);
    expect(steps[nearestStepIndex(steps, 52)]).toBe(50);
    expect(steps[nearestStepIndex(steps, 0)]).toBe(1);
    expect(steps[nearestStepIndex(steps, 5_000_000)]).toBe(LARGE.max);
  });

  test('une poignée qui dépasse l’autre la pousse', () => {
    expect(orderedAmounts(300, 200, 'min')).toEqual({ min: 300, max: 300 });
    expect(orderedAmounts(300, 200, 'max')).toEqual({ min: 200, max: 200 });
    expect(orderedAmounts(50, 250, 'min')).toEqual({ min: 50, max: 250 });
  });

  test('la plage glisse d’un bloc sans se tasser', () => {
    expect(shiftedRange(2, 5, 3, 20)).toEqual({ min: 5, max: 8 });
    expect(shiftedRange(2, 5, -10, 20)).toEqual({ min: 0, max: 3 });
    expect(shiftedRange(15, 18, 10, 20)).toEqual({ min: 17, max: 20 });
  });
});
