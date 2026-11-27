type $$ComponentProps = {
    id?: string;
    ariaLabel?: string;
    describedBy?: string | undefined;
    'aria-describedby'?: string | undefined;
    value?: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    className?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
};
declare const FormTextarea: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormTextarea = ReturnType<typeof FormTextarea>;
export default FormTextarea;
