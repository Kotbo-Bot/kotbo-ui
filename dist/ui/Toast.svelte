<script lang="ts">
  import { toast, type Toast as ToastType } from '../stores/toast.svelte.js';
  import Papicon from '../icons/Papicon.svelte';
  import { getMessages } from '../config.svelte.js';

  const { item }: { item: ToastType } = $props();
  const msgs = $derived(getMessages());

  const iconName = $derived(
    {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    }[item.type],
  );

  let hovered = $state(false);
  let focused = $state(false);
  const paused = $derived(hovered || focused);

  $effect(() => {
    if (paused) toast.pause(item.id);
    else toast.resume(item.id);
  });
</script>

<div
  class="kotbo-toast kotbo-toast--{item.type}"
  role={item.type === 'error' ? 'alert' : undefined}
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onfocusin={() => (focused = true)}
  onfocusout={(e) => (focused = e.currentTarget.contains(e.relatedTarget as Node | null))}
>
  {#if item.undoable && item.duration}
    <span
      class="kotbo-toast__countdown"
      style="animation-duration: {item.duration}ms"
      style:animation-play-state={paused ? 'paused' : 'running'}
      aria-hidden="true"
    ></span>
  {/if}
  <span class="kotbo-toast__icon">
    <Papicon name={iconName} size={16} />
  </span>
  <p class="kotbo-toast__msg">{item.message}</p>
  {#if item.action}
    <button
      type="button"
      onclick={async () => {
        try {
          await item.action?.onClick();
        } catch (e) {
          console.error('Toast action failed:', e);
        }
        toast.remove(item.id);
      }}
      class="kotbo-toast__action"
    >
      {item.action.label}
    </button>
  {/if}
  <button
    type="button"
    onclick={() => toast.remove(item.id)}
    class="kotbo-toast__close"
    aria-label={msgs.common_close()}
  >
    <Papicon name="close" size={14} />
  </button>
</div>

<style>
  .kotbo-toast {
    --toast-tone: var(--color-primary, var(--primary-color));
    --toast-ink: var(--color-on-surface, var(--on-surface));
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--toast-tone) 30%, transparent);
    background: color-mix(in srgb, var(--toast-tone) 10%, var(--color-surface-container-lowest, var(--surface-container-lowest)));
    color: var(--toast-ink);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.16), 0 4px 10px -4px rgba(0, 0, 0, 0.08);
    animation: kotbo-toast-in 200ms ease-out both;
  }

  .kotbo-toast--success {
    --toast-tone: var(--color-success, var(--success-color));
    --toast-ink: var(--color-on-success-container, var(--on-success-container-color));
  }

  .kotbo-toast--error {
    --toast-tone: var(--color-error, var(--error-color));
    --toast-ink: var(--color-on-error-container, var(--on-error-container-color));
  }

  .kotbo-toast--warning {
    --toast-tone: var(--color-warning, var(--warning-color));
    --toast-ink: var(--color-on-warning-container, var(--on-warning-container-color));
  }

  .kotbo-toast--info {
    --toast-tone: var(--series-1, #2a78d6);
    --toast-ink: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-toast__countdown {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: currentColor;
    opacity: 0.4;
    transform-origin: left;
    animation-name: kotbo-toast-countdown;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .kotbo-toast__icon {
    display: inline-flex;
    flex-shrink: 0;
  }

  .kotbo-toast__msg {
    margin: 0;
    font-size: 0.875rem;
    flex: 1;
    min-width: 0;
  }

  .kotbo-toast__action {
    margin-left: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 0;
    border-radius: 0.25rem;
    background: color-mix(in srgb, currentColor 12%, transparent);
    color: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .kotbo-toast__action:hover {
    background: color-mix(in srgb, currentColor 20%, transparent);
  }

  .kotbo-toast__close {
    margin-left: auto;
    padding: 0.2rem;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
  }

  .kotbo-toast__close:hover {
    background: color-mix(in srgb, currentColor 12%, transparent);
  }

  @keyframes kotbo-toast-in {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes kotbo-toast-countdown {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .kotbo-toast__countdown { animation: none; }
  }
</style>
