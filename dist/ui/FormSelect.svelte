<script lang="ts">
  import type { Snippet } from 'svelte';

  type SelectValue = string | string[];

  let {
    id = '',
    ariaLabel,
    describedBy = undefined,
    'aria-describedby': ariaDescribedBy = undefined,
    value = $bindable<SelectValue>(),
    multiple = false,
    disabled = false,
    className = '',
    onchange,
    children,
  }: {
    id?: string;
    ariaLabel?: string;
    describedBy?: string | undefined;
    'aria-describedby'?: string | undefined;
    value?: SelectValue;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    onchange?: (event: Event) => void;
    children?: Snippet;
  } = $props();

  const resolvedDescribedBy = $derived(ariaDescribedBy ?? describedBy);
</script>

{#if multiple}
  <select
    {id}
    aria-label={ariaLabel}
    aria-describedby={resolvedDescribedBy}
    bind:value
    multiple
    {disabled}
    {onchange}
    class="input {className} custom-select"
  >
    {#if children}
      {@render children()}
    {/if}
  </select>
{:else}
  <select
    {id}
    aria-label={ariaLabel}
    aria-describedby={resolvedDescribedBy}
    bind:value
    {disabled}
    {onchange}
    class="input {className} custom-select"
  >
    {#if children}
      {@render children()}
    {/if}
  </select>
{/if}

<style>
  .custom-select {
    appearance: none;
    padding-right: 2rem;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
  }

  :global(:root.dark .custom-select),
  :global(:root[data-theme="dark"] .custom-select) {
    color-scheme: dark;
  }

  :global(.custom-select option) {
    background-color: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface, var(--on-surface));
  }
</style>
