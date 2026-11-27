export declare function amountSteps(range: {
    min: number;
    max: number;
}): number[];
export declare function nearestStepIndex(steps: number[], value: number): number;
export declare function orderedAmounts(min: number, max: number, moved: 'min' | 'max'): {
    min: number;
    max: number;
};
export declare function shiftedRange(minIndex: number, maxIndex: number, delta: number, lastIndex: number): {
    min: number;
    max: number;
};
