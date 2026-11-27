type $$ComponentProps = {
    onClick?: (event: MouseEvent) => void | Promise<void>;
    onclick?: (event: MouseEvent) => void | Promise<void>;
    loading?: boolean;
    label?: string;
    iconOnly?: boolean;
    ariaLabel?: string;
    className?: string;
    iconClass?: string;
};
declare const RefreshButton: import("svelte").Component<$$ComponentProps, {}, "">;
type RefreshButton = ReturnType<typeof RefreshButton>;
export default RefreshButton;
