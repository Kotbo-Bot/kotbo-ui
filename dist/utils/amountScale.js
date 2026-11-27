const LINEAR_MAX_STEPS = 50;
const ROUND_MULTIPLIERS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5];
export function amountSteps(range) {
    if (range.max - range.min < LINEAR_MAX_STEPS) {
        return Array.from({ length: range.max - range.min + 1 }, (_, index) => range.min + index);
    }
    const steps = new Set([range.min]);
    for (let decade = 1; decade <= range.max; decade *= 10) {
        for (const multiplier of ROUND_MULTIPLIERS) {
            const value = Math.round(decade * multiplier);
            if (value > range.min && value < range.max)
                steps.add(value);
        }
    }
    steps.add(range.max);
    return [...steps].sort((a, b) => a - b);
}
export function nearestStepIndex(steps, value) {
    if (!Number.isFinite(value) || value <= steps[0])
        return 0;
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
export function orderedAmounts(min, max, moved) {
    if (min <= max)
        return { min, max };
    return moved === 'min' ? { min, max: min } : { min: max, max };
}
export function shiftedRange(minIndex, maxIndex, delta, lastIndex) {
    const shift = Math.min(Math.max(delta, -minIndex), lastIndex - maxIndex);
    return { min: minIndex + shift, max: maxIndex + shift };
}
