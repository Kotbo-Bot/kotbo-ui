export declare function lockBodyScroll(): void;
export declare function unlockBodyScroll(): void;
/** Action Svelte qui bloque le défilement du body tant que l'élément est monté. */
export declare function scrollLock(_node: HTMLElement): {
    destroy: typeof unlockBodyScroll;
};
