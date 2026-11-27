type $$ComponentProps = {
    checked?: boolean;
    disabled?: boolean;
    onToggle?: (checked: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    activeClass?: string;
    id?: string | undefined;
    ariaLabel?: string | undefined;
};
declare const ToggleSwitch: import("svelte").Component<$$ComponentProps, {}, "">;
type ToggleSwitch = ReturnType<typeof ToggleSwitch>;
export default ToggleSwitch;
