const LINEAR_MAX_STEPS = 50;
const ROUND_MULTIPLIERS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5];

export function amountSteps(range: { min: number; max: number }): number[] {
  if (range.max - range.min < LINEAR_MAX_STEPS) {
    return Array.from({ length: range.max - range.min + 1 }, (_, index) => range.min + index);
  }

  const steps = new Set<number>([range.min]);
  for (let decade = 1; decade <= range.max; decade *= 10) {
    for (const multiplier of ROUND_MULTIPLIERS) {
      const value = Math.round(decade * multiplier);
      if (value > range.min && value < range.max) steps.add(value);
    }
  }
  steps.add(range.max);
  return [...steps].sort((a, b) => a - b);
}

export function nearestStepIndex(steps: number[], value: number): number {
  if (!Number.isFinite(value) || value <= steps[0]) return 0;
  let best = 0;
  let bestDistance = Infinity;
  steps.forEach((step, index) => {
    const distance = Math.abs(Math.log(step) - Math.log(value));
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

export function orderedAmounts(min: number, max: number, moved: 'min' | 'max'): { min: number; max: number } {
  if (min <= max) return { min, max };
  return moved === 'min' ? { min, max: min } : { min: max, max };
}

export function shiftedRange(minIndex: number, maxIndex: number, delta: number, lastIndex: number): { min: number; max: number } {
  const shift = Math.min(Math.max(delta, -minIndex), lastIndex - maxIndex);
  return { min: minIndex + shift, max: maxIndex + shift };
}
