type $$ComponentProps = {
    value?: string;
    presets?: string[];
    onchange?: (color: string) => void;
};
declare const FormColorPicker: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormColorPicker = ReturnType<typeof FormColorPicker>;
export default FormColorPicker;
