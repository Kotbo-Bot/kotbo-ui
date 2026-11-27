export type DialogFocusOptions = {
    onEscape?: () => void;
};
/**
 * Piège le focus dans une fenêtre modale (RGAA 7.1, 12.8) et gère Échap.
 */
export declare function dialogFocus(node: HTMLElement, options: DialogFocusOptions): {
    update(next: DialogFocusOptions): void;
    destroy(): void;
};
