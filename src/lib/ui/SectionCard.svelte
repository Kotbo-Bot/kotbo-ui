<script lang="ts">
  import type { Snippet } from 'svelte';
  import Papicon from '../icons/Papicon.svelte';

  const {
    title = '',
    description = '',
    icon = '',
    flush = false,
    class: className = '',
    actions,
    children,
  }: {
    title?: string;
    description?: string;
    icon?: string;
    flush?: boolean;
    class?: string;
    actions?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<section class="section-card {flush ? 'kotbo-section-card--flush' : ''} {className}">
  {#if title || actions}
    <header class="kotbo-section-card__header {flush ? 'kotbo-section-card__header--flush' : ''}">
      <div class="kotbo-section-card__lead">
        {#if icon}
          <div class="kotbo-section-card__icon">
            <Papicon {icon} size={16} />
          </div>
        {/if}
        <div class="kotbo-section-card__titles">
          <h3 class="kotbo-section-card__title">{title}</h3>
          {#if description}
            <p class="kotbo-section-card__desc">{description}</p>
          {/if}
        </div>
      </div>
      {#if actions}
        <div class="kotbo-section-card__actions">
          {@render actions()}
        </div>
      {/if}
    </header>
  {/if}
  <div class={flush ? 'kotbo-section-card__body kotbo-section-card__body--flush' : 'kotbo-section-card__body'}>
    {@render children?.()}
  </div>
</section>

<style>
  .kotbo-section-card--flush {
    overflow: hidden;
  }

  .kotbo-section-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0.25rem;
  }

  .kotbo-section-card__header--flush {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
  }

  .kotbo-section-card__lead {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    min-width: 0;
  }

  .kotbo-section-card__icon {
    width: 2rem;
    height: 2rem;
    margin-top: 0.125rem;
    border-radius: 0.5rem;
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .kotbo-section-card__titles {
    min-width: 0;
  }

  .kotbo-section-card__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-section-card__desc {
    margin: 0.125rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-section-card__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .kotbo-section-card__body {
    padding: 1.25rem;
  }

  .kotbo-section-card__body--flush {
    padding: 0;
  }
</style>
