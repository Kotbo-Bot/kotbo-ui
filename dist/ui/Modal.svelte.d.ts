import type { Snippet } from 'svelte';
type $$ComponentProps = {
    open?: boolean;
    onClose?: (e?: unknown) => void;
    title?: string;
    ariaLabel?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'screen';
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    aboveCase?: boolean;
    flush?: boolean;
    children?: Snippet;
    footer?: Snippet;
};
declare const Modal: import("svelte").Component<$$ComponentProps, {}, "open">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
