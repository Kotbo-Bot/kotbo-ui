<script lang="ts">
  import type { Snippet } from 'svelte';

  const {
    title = '',
    description = '',
    actions,
    children,
  }: {
    title?: string;
    description?: string;
    actions?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<section class="settings-group">
  {#if title || actions}
    <header class="settings-group__header">
      <div class="settings-group__lead">
        <h3 class="settings-group__title">{title}</h3>
        {#if description}
          <p class="settings-group__description">{description}</p>
        {/if}
      </div>
      {#if actions}
        <div class="settings-group__actions">{@render actions()}</div>
      {/if}
    </header>
  {/if}
  {@render children?.()}
</section>

<style>
  .settings-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .settings-group__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .settings-group__lead {
    min-width: 0;
  }

  .settings-group__actions {
    flex-shrink: 0;
  }

  .settings-group__title {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .settings-group__description {
    margin: 0.375rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
