<script lang="ts" module>
  export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: (event: MouseEvent) => void;
  }
</script>

<script lang="ts">
  import Papicon from '../icons/Papicon.svelte';
  import { getMessages } from '../config.svelte.js';

  const {
    back = undefined,
    items = [],
    ariaLabel,
  }: {
    back?: { label: string; href: string; onClick?: (event: MouseEvent) => void };
    items?: BreadcrumbItem[];
    ariaLabel?: string;
  } = $props();

  const msgs = $derived(getMessages());
</script>

{#if back}
  <nav class="kotbo-breadcrumbs" aria-label={ariaLabel ?? msgs.shell_breadcrumb()}>
    <a
      href={back.href}
      onclick={(e) => back.onClick?.(e)}
      class="kotbo-breadcrumbs__back"
    >
      <Papicon icon="chevron-left" size={14} />
      {back.label}
    </a>
  </nav>
{:else if items.length > 0}
  <nav class="kotbo-breadcrumbs" aria-label={ariaLabel ?? msgs.shell_breadcrumb()}>
    <ol class="kotbo-breadcrumbs__list">
      {#each items as item, index (item.label + index)}
        <li class="kotbo-breadcrumbs__item">
          {#if index > 0}
            <span class="kotbo-breadcrumbs__sep" aria-hidden="true">/</span>
          {/if}
          {#if item.href && index < items.length - 1}
            <a href={item.href} onclick={(e) => item.onClick?.(e)} class="kotbo-breadcrumbs__link">
              {item.label}
            </a>
          {:else}
            <span class="kotbo-breadcrumbs__current" aria-current={index === items.length - 1 ? 'page' : undefined}>
              {item.label}
            </span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style>
  .kotbo-breadcrumbs {
    margin-bottom: 1rem;
    user-select: none;
  }

  .kotbo-breadcrumbs__back {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: -0.25rem;
    padding: 0.125rem 0.25rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    text-decoration: none;
    transition: color 120ms ease;
  }

  .kotbo-breadcrumbs__back:hover {
    color: var(--color-on-surface, var(--on-surface));
  }

  .kotbo-breadcrumbs__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.8125rem;
  }

  .kotbo-breadcrumbs__item {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .kotbo-breadcrumbs__sep {
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    opacity: 0.6;
  }

  .kotbo-breadcrumbs__link {
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    text-decoration: none;
  }

  .kotbo-breadcrumbs__link:hover {
    color: var(--color-on-surface, var(--on-surface));
    text-decoration: underline;
  }

  .kotbo-breadcrumbs__current {
    color: var(--color-on-surface, var(--on-surface));
    font-weight: 600;
  }
</style>
