<script lang="ts" module>
  export interface BarListItem {
    id: string;
    label: string;
    value: number;
    display?: string;
    sub?: string;
    color?: string;
  }
</script>

<script lang="ts" generics="T extends BarListItem">
  import type { Snippet } from 'svelte';
  import { fmtNumber } from './analyticsFormat.js';

  const {
    items,
    color = 'var(--series-1)',
    leading,
    trailing,
    onselect,
    empty = '',
    max = undefined,
  }: {
    items: T[];
    color?: string;
    leading?: Snippet<[T]>;
    trailing?: Snippet<[T]>;
    onselect?: (item: T) => void;
    empty?: string;
    max?: number;
  } = $props();

  const scale = $derived(max ?? Math.max(1, ...items.map((i) => i.value)));
  const tip = (item: T) => `${item.label} : ${item.display ?? fmtNumber(item.value)}`;
</script>

{#if items.length === 0}
  <p class="bar-empty">{empty}</p>
{:else}
  <ul class="bar-list">
    {#each items as item, i (`${item.id}:${i}`)}
      <li>
        {#if onselect}
          <button type="button" class="bar-row bar-row--button" onclick={() => onselect(item)} title={tip(item)}>
            {@render row(item)}
          </button>
        {:else}
          <div class="bar-row" title={tip(item)}>
            {@render row(item)}
          </div>
        {/if}
      </li>
    {/each}
  </ul>

  {#snippet row(item: T)}
    {#if leading}{@render leading(item)}{/if}
    <span class="bar-row__content">
      <span class="bar-row__head">
        <span class="bar-row__label">{item.label}</span>
        {#if item.sub}<span class="bar-row__sub">{item.sub}</span>{/if}
      </span>
      <span class="bar-track" aria-hidden="true">
        <span class="bar-fill" style="width: {Math.max(1.5, (item.value / scale) * 100)}%; background: {item.color ?? color};"></span>
      </span>
    </span>
    {#if trailing}{@render trailing(item)}{/if}
    <span class="bar-row__val">{item.display ?? fmtNumber(item.value)}</span>
  {/snippet}
{/if}

<style>
  .bar-empty {
    padding: 0.5rem 0;
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .bar-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    text-align: left;
    border-radius: 0.5rem;
  }

  .bar-row--button {
    border: 0;
    background: transparent;
    padding: 0.25rem 0.375rem;
    margin: -0.25rem -0.375rem;
    width: calc(100% + 0.75rem);
    cursor: pointer;
  }

  .bar-row--button:hover {
    background: var(--color-surface-container, var(--surface-container));
  }

  .bar-row--button:focus-visible {
    outline: 2px solid var(--color-primary, var(--primary-color));
    outline-offset: 1px;
  }

  .bar-row__content {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.25rem;
  }

  .bar-row__head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
  }

  .bar-row__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
    color: var(--color-on-surface, var(--on-surface));
  }

  .bar-row__sub {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .bar-row__val {
    flex-shrink: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface, var(--on-surface));
  }

  .bar-track {
    display: block;
    height: 6px;
    border-radius: 999px;
    background: var(--color-surface-container, var(--surface-container));
    overflow: hidden;
  }

  .bar-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
  }
</style>
