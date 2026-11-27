<script lang="ts">
  import { getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';

  const {
    onClick,
    onclick,
    loading = false,
    label,
    iconOnly = false,
    ariaLabel,
    className = '',
    iconClass = '',
  }: {
    onClick?: (event: MouseEvent) => void | Promise<void>;
    onclick?: (event: MouseEvent) => void | Promise<void>;
    loading?: boolean;
    label?: string;
    iconOnly?: boolean;
    ariaLabel?: string;
    className?: string;
    iconClass?: string;
  } = $props();

  const msgs = $derived(getMessages());
</script>

<button
  type="button"
  onclick={onClick ?? onclick}
  aria-label={ariaLabel ?? msgs.common_refresh()}
  aria-busy={loading}
  title={label ?? msgs.common_refresh()}
  class="kotbo-refresh-btn {iconOnly ? className : ''}"
>
  <span class="kotbo-refresh-btn__icon {loading ? 'kotbo-refresh-btn__icon--spin' : ''} {iconClass}">
    <Papicon icon="refresh-cw" size={16} />
  </span>
</button>

<style>
  .kotbo-refresh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .kotbo-refresh-btn:hover {
    color: var(--color-on-surface, var(--on-surface));
    background: var(--color-surface-container, var(--surface-container));
  }

  .kotbo-refresh-btn__icon {
    display: inline-flex;
  }

  .kotbo-refresh-btn__icon--spin {
    animation: kotbo-refresh-spin 1s linear infinite;
  }

  @keyframes kotbo-refresh-spin {
    to { transform: rotate(360deg); }
  }
</style>
