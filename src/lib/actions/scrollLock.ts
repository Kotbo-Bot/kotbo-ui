let locks = 0;
let savedScrollY = 0;

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  locks += 1;
  if (locks > 1) return;

  savedScrollY = window.scrollY;
  const { body } = document;
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  locks = Math.max(0, locks - 1);
  if (locks > 0) return;

  const { body } = document;
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';

  window.scrollTo({ top: savedScrollY, behavior: 'instant' as ScrollBehavior });
}

/** Action Svelte qui bloque le défilement du body tant que l'élément est monté. */
export function scrollLock(_node: HTMLElement) {
  lockBodyScroll();
  return { destroy: unlockBodyScroll };
}
