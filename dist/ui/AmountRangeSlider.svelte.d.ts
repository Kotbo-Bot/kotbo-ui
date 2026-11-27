type $$ComponentProps = {
    range: {
        min: number;
        max: number;
    };
    min: number;
    max: number;
    labelMin: string;
    labelMax: string;
    labelRange: string;
    disabled?: boolean;
};
declare const AmountRangeSlider: import("svelte").Component<$$ComponentProps, {}, "max" | "min">;
type AmountRangeSlider = ReturnType<typeof AmountRangeSlider>;
export default AmountRangeSlider;
