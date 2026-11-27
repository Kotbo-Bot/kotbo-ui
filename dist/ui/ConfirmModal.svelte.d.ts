interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    requireInput?: string;
    impacts?: string[];
    loading?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}
declare const ConfirmModal: import("svelte").Component<Props, {}, "open">;
type ConfirmModal = ReturnType<typeof ConfirmModal>;
export default ConfirmModal;
