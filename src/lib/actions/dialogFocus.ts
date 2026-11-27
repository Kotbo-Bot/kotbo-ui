export type DialogFocusOptions = {
  onEscape?: () => void;
};

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusables(node: HTMLElement): HTMLElement[] {
  return [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => !element.closest('[hidden], [inert], [aria-hidden="true"]'),
  );
}

function isTopmost(node: HTMLElement): boolean {
  const modals = document.querySelectorAll('[aria-modal="true"]');
  return modals[modals.length - 1] === node;
}

/**
 * Piège le focus dans une fenêtre modale (RGAA 7.1, 12.8) et gère Échap.
 */
export function dialogFocus(node: HTMLElement, options: DialogFocusOptions) {
  let onEscape = options.onEscape;
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const frame = requestAnimationFrame(() => {
    if (node.contains(document.activeElement)) return;
    const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? node;
    target.focus({ preventScroll: true });
  });

  function onKeyDown(event: KeyboardEvent) {
    if (!isTopmost(node)) return;

    if (event.key === 'Escape') {
      if (!onEscape || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      onEscape();
      return;
    }

    if (event.key !== 'Tab') return;
    const list = focusables(node);
    if (list.length === 0) {
      event.preventDefault();
      return;
    }

    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === node)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  node.addEventListener('keydown', onKeyDown);

  return {
    update(next: DialogFocusOptions) {
      onEscape = next.onEscape;
    },
    destroy() {
      cancelAnimationFrame(frame);
      node.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    },
  };
}
