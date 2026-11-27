/**
 * Action Svelte qui téléporte un élément dans document.body
 * pour échapper aux contextes d'empilement des parents (transform, backdrop-filter, overflow).
 */
export declare function portal(node: HTMLElement, target?: HTMLElement | string): {
    update(newTarget: HTMLElement | string): void;
    destroy(): void;
};
