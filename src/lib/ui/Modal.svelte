<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getMessages } from '../config.svelte.js';
  import { portal } from '../actions/portal.js';
  import { dialogFocus } from '../actions/dialogFocus.js';
  import { scrollLock } from '../actions/scrollLock.js';
  import Papicon from '../icons/Papicon.svelte';

  let {
    open = $bindable(false),
    onClose = () => {},
    title = '',
    ariaLabel = '',
    subtitle = '',
    size = 'md',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    aboveCase = false,
    flush = false,
    children,
    footer,
  }: {
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
  } = $props();

  const msgs = $derived(getMessages());
  const isScreen = $derived(size === 'screen');
  const titleId = $props.id();

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnBackdropClick && e.currentTarget === e.target) {
      open = false;
      onClose(e);
    }
  }

  function close() {
    open = false;
    onClose();
  }
</script>

{#if open}
  <div
    use:portal
    use:scrollLock
    class="kotbo-modal {aboveCase ? 'kotbo-modal--above-case' : ''} {isScreen ? 'kotbo-modal--screen' : ''}"
    role="presentation"
  >
    <div class="kotbo-modal__backdrop" onclick={handleBackdropClick} aria-hidden="true"></div>

    <div
      use:dialogFocus={{ onEscape: closeOnEscape ? close : undefined }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel || undefined}
      tabindex="-1"
      class="kotbo-modal__panel kotbo-modal__panel--{size}"
    >
      {#if title || showCloseButton}
        <header class="kotbo-modal__header">
          <div class="kotbo-modal__titles">
            {#if title}
              <h3 id={titleId} class="kotbo-modal__title">{title}</h3>
            {/if}
            {#if subtitle}
              <p class="kotbo-modal__subtitle">{subtitle}</p>
            {/if}
          </div>
          {#if showCloseButton}
            <button
              type="button"
              onclick={close}
              class="kotbo-modal__close"
              aria-label={msgs.common_close()}
            >
              <Papicon icon="x" size={14} />
            </button>
          {/if}
        </header>
      {/if}

      <div class="kotbo-modal__body {flush ? 'kotbo-modal__body--flush' : ''}">
        {@render children?.()}
      </div>

      {#if footer}
        <footer class="kotbo-modal__footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .kotbo-modal {
    position: fixed;
    inset: 0;
    z-index: var(--layer-modal, 9999);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .kotbo-modal--above-case {
    z-index: var(--layer-popover, 15000);
  }

  .kotbo-modal--screen {
    padding: 0;
  }

  @media (min-width: 640px) {
    .kotbo-modal--screen {
      padding: 1rem;
    }
  }

  .kotbo-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  .kotbo-modal__panel {
    position: relative;
    width: 100%;
    max-height: 90vh;
    border-radius: 0.75rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-lowest, var(--surface-container-lowest));
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: kotbo-modal-in 150ms ease-out both;
  }

  .kotbo-modal__panel:focus {
    outline: none;
  }

  .kotbo-modal__panel--sm { max-width: 24rem; }
  .kotbo-modal__panel--md { max-width: 32rem; }
  .kotbo-modal__panel--lg { max-width: 42rem; }
  .kotbo-modal__panel--xl { max-width: 56rem; }
  .kotbo-modal__panel--full { max-width: 72rem; }

  .kotbo-modal__panel--screen {
    max-width: none;
    max-height: none;
    height: 100%;
    border-radius: 0;
  }

  @media (min-width: 640px) {
    .kotbo-modal__panel--screen {
      height: calc(100vh - 2rem);
      border-radius: 0.75rem;
    }
  }

  @keyframes kotbo-modal-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .kotbo-modal__header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .kotbo-modal__titles {
    min-width: 0;
    flex: 1;
  }

  .kotbo-modal__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-modal__subtitle {
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-modal__close {
    margin-left: 0.75rem;
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;
  }

  .kotbo-modal__close:hover {
    background: var(--color-surface-container-high, var(--surface-container-high));
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-modal__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1.25rem;
  }

  .kotbo-modal__body--flush {
    padding: 0;
  }

  .kotbo-modal__footer {
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-lowest, var(--surface-container-lowest));
    flex-shrink: 0;
  }
</style>
