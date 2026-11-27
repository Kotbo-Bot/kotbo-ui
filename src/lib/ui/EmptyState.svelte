<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getMessages } from '../config.svelte.js';
  import Papicon from '../icons/Papicon.svelte';
  import Button from './Button.svelte';

  const {
    icon = 'inbox',
    title,
    description = '',
    action,
    actionLabel = '',
    actionHref = undefined,
    actionIcon = 'plus',
    onAction = undefined,
    reason = undefined,
  }: {
    icon?: string;
    title?: string;
    description?: string;
    action?: Snippet;
    actionLabel?: string;
    actionHref?: string;
    actionIcon?: string;
    onAction?: () => void;
    reason?: 'all-clear' | 'accumulating' | 'nothing-matches' | 'read-only' | 'instruction';
  } = $props();

  const msgs = $derived(getMessages());
</script>

<div class="kotbo-empty">
  <div class="kotbo-empty__icon {reason === 'all-clear' ? 'kotbo-empty__icon--clear' : ''}">
    <Papicon {icon} size={22} />
  </div>
  <p class="kotbo-empty__title">{title ?? msgs.empty_default_title()}</p>
  {#if description}
    <p class="kotbo-empty__desc">{description}</p>
  {/if}
  {#if action}
    <div class="kotbo-empty__action">
      {@render action()}
    </div>
  {:else if actionLabel && (actionHref || onAction)}
    <div class="kotbo-empty__action">
      <Button variant="primary" icon={actionIcon} href={actionHref} onclick={onAction}>{actionLabel}</Button>
    </div>
  {/if}
</div>

<style>
  .kotbo-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3.5rem 1.5rem;
    gap: 0.375rem;
  }

  .kotbo-empty__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-empty__icon--clear {
    background: color-mix(in srgb, var(--color-success, var(--success-color)) 12%, transparent);
    color: var(--color-on-success-container, var(--on-success-container-color));
  }

  .kotbo-empty__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-empty__desc {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.55;
    max-width: 24rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-empty__action {
    margin-top: 0.75rem;
  }
</style>
