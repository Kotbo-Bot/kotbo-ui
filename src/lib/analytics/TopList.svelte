<script lang="ts" module>
  export interface TopListItem {
    id: string;
    name: string | null;
    value: number;
    previous?: number;
    share?: number;
    spark?: number[];
    sub?: string;
    avatarUrl?: string | null;
    raw?: unknown;
  }
</script>

<script lang="ts" generics="T extends TopListItem">
  import type { Snippet } from 'svelte';
  import Button from '../ui/Button.svelte';
  import Callout from '../ui/Callout.svelte';
  import Modal from '../ui/Modal.svelte';
  import Papicon from '../icons/Papicon.svelte';
  import BarList from './BarList.svelte';
  import Sparkline from './Sparkline.svelte';
  import AnalyticsSkeleton from './AnalyticsSkeleton.svelte';
  import { getMessages } from '../config.svelte.js';
  import { fmtNumber } from './analyticsFormat.js';

  const {
    title,
    description = '',
    icon = '',
    entityLabel = '',
    items = [],
    total = 0,
    prevTotal = 0,
    available = true,
    loading = false,
    error = '',
    format = fmtNumber,
    compare = false,
    color = 'var(--series-1)',
    bare = false,
    onselect,
    onLoadFull,
    onExport,
    renderIdentity,
    renderRowName,
  }: {
    title: string;
    description?: string;
    icon?: string;
    entityLabel?: string;
    items: T[];
    total?: number;
    prevTotal?: number;
    available?: boolean;
    loading?: boolean;
    error?: string;
    format?: (value: number) => string;
    compare?: boolean;
    color?: string;
    bare?: boolean;
    onselect?: (item: T) => void;
    onLoadFull?: () => Promise<T[] | null>;
    onExport?: (items: T[]) => void | Promise<void>;
    renderIdentity?: Snippet<[T]>;
    renderRowName?: Snippet<[T]>;
  } = $props();

  const msgs = $derived(getMessages());
  const PAGE = 50;

  let mode = $state<'table' | 'chart'>('table');
  let fullOpen = $state(false);
  let fullItems = $state<T[] | null>(null);
  let fullLoading = $state(false);
  let search = $state('');
  let page = $state(1);

  async function openFull() {
    fullOpen = true;
    search = '';
    page = 1;
    if (!onLoadFull) {
      fullItems = items;
      return;
    }
    fullLoading = true;
    try {
      fullItems = await onLoadFull();
    } finally {
      fullLoading = false;
    }
  }

  const resolvedFull = $derived(fullItems ?? items);
  const ranked = $derived(resolvedFull.map((item, i) => ({ item, rank: i + 1 })));
  const filtered = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return q ? ranked.filter(({ item }) => (item.name ?? item.id).toLowerCase().includes(q)) : ranked;
  });
  const pages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE)));
  const visible = $derived(filtered.slice((page - 1) * PAGE, page * PAGE));

  $effect(() => {
    void search;
    page = 1;
  });

  const max = $derived(Math.max(1, ...items.map((i) => i.value)));
  const barItems = $derived(
    items.map((item) => ({
      id: item.id,
      label: item.name ?? item.id,
      value: item.value,
      display: format(item.value),
      raw: item,
    })),
  );
</script>

{#snippet row(item: T, rank: number, scale: number)}
  <div class="top-row-wrap" style="--fill: {Math.max(1.5, (item.value / scale) * 100)}%; --row-color: {color};">
    <span class="top-row__rank">{rank}</span>
    <span class="top-row__ident">
      {#if renderRowName}
        {@render renderRowName(item)}
      {:else}
        {#if renderIdentity}
          {@render renderIdentity(item)}
        {/if}
        {#if onselect}
          <button type="button" class="top-row__name-btn" onclick={() => onselect(item)}>
            {item.name ?? item.id}
          </button>
        {:else}
          <span class="top-row__name">{item.name ?? item.id}</span>
        {/if}
      {/if}
    </span>
    {#if item.spark && item.spark.length > 1}
      <span class="top-row__spark">
        <Sparkline values={item.spark} {color} width={56} height={18} fill={false} />
      </span>
    {/if}
    <span class="top-row__value">{format(item.value)}</span>
    {#if compare && item.previous !== undefined}
      <span class="top-row__delta" title={msgs.anx_delta_title()}>{format(item.previous)}</span>
    {/if}
  </div>
{/snippet}

<section class="top-list" class:top-list--bare={bare}>
  <header class="top-list__header">
    <div class="top-list__title-wrap">
      {#if icon}
        <span class="top-list__icon"><Papicon {icon} size={16} /></span>
      {/if}
      <div class="top-list__title-text">
        <h3 class="top-list__title">{title}</h3>
        {#if description}<p class="top-list__desc">{description}</p>{/if}
      </div>
    </div>
    <div class="icon-group" role="group" aria-label={msgs.anx_view_label()}>
      <button
        type="button"
        class="icon-group__btn"
        aria-pressed={mode === 'table'}
        aria-label={msgs.anx_view_table()}
        title={msgs.anx_view_table()}
        onclick={() => (mode = 'table')}
      >
        <Papicon icon="table" size={15} />
      </button>
      <button
        type="button"
        class="icon-group__btn"
        aria-pressed={mode === 'chart'}
        aria-label={msgs.anx_view_bar()}
        title={msgs.anx_view_bar()}
        onclick={() => (mode = 'chart')}
      >
        <Papicon icon="bar-chart-2" size={15} />
      </button>
    </div>
  </header>

  {#if loading && items.length === 0}
    <AnalyticsSkeleton compact />
  {:else if error}
    <Callout variant="danger">{error}</Callout>
  {:else if !available}
    <Callout variant="info">{msgs.anx_top_unavailable()}</Callout>
  {:else if items.length === 0}
    <p class="top-list__empty">{msgs.anx_top_empty()}</p>
  {:else}
    <div class="top-list__body" class:top-list__body--busy={loading}>
      {#if mode === 'table'}
        <div class="top-head" aria-hidden="true">
          <span class="top-head__entity">{entityLabel || msgs.anx_top_name()}</span>
          <span class="top-head__value">{msgs.anx_top_value()}</span>
          {#if compare}<span class="top-head__delta">{msgs.anx_table_previous()}</span>{/if}
        </div>
        <ol class="top-rows">
          {#each items as item, i (item.id)}
            <li>{@render row(item, i + 1, max)}</li>
          {/each}
        </ol>
      {:else}
        <BarList
          items={barItems}
          {color}
          onselect={onselect ? (b) => onselect(b.raw) : undefined}
        >
          {#snippet leading(b)}
            {#if renderIdentity}{@render renderIdentity(b.raw)}{/if}
          {/snippet}
        </BarList>
      {/if}
      <footer class="top-list__footer">
        <span class="top-list__total">
          {msgs.anx_top_total({ value: format(total) })}
          {#if compare && prevTotal > 0}
            · {msgs.anx_previous_period({ value: format(prevTotal) })}
          {/if}
        </span>
        {#if onLoadFull || items.length > 0}
          <Button size="sm" variant="ghost" iconRight="chevron-right" onclick={openFull}>
            {msgs.anx_top_see_all()}
          </Button>
        {/if}
      </footer>
    </div>
  {/if}
</section>

<Modal bind:open={fullOpen} {title} subtitle={description} size="lg" onClose={() => (fullOpen = false)}>
  <div class="top-modal-body">
    <div class="top-modal-toolbar">
      <label class="top-modal-search">
        <span class="sr-only">{msgs.anx_top_search()}</span>
        <input type="search" class="input" placeholder={msgs.anx_top_search()} bind:value={search} />
      </label>
      {#if onExport}
        <Button size="sm" icon="download" onclick={() => onExport(resolvedFull)} disabled={resolvedFull.length === 0}>
          {msgs.anx_top_export()}
        </Button>
      {/if}
    </div>
    {#if fullLoading && !fullItems}
      <AnalyticsSkeleton compact rows={8} />
    {:else if visible.length === 0}
      <p class="top-list__empty">{msgs.anx_top_empty()}</p>
    {:else}
      <div class="top-list top-list--modal">
        <ol class="top-rows">
          {#each visible as entry (entry.item.id)}
            <li>{@render row(entry.item, entry.rank, Math.max(1, resolvedFull[0]?.value ?? 1))}</li>
          {/each}
        </ol>
      </div>
      {#if pages > 1}
        <div class="top-modal-pager">
          <Button size="sm" variant="ghost" icon="chevron-left" disabled={page <= 1} onclick={() => (page -= 1)}>
            {msgs.anx_top_prev_page()}
          </Button>
          <span class="top-modal-page">{page} / {pages}</span>
          <Button size="sm" variant="ghost" iconRight="chevron-right" disabled={page >= pages} onclick={() => (page += 1)}>
            {msgs.anx_top_next_page()}
          </Button>
        </div>
      {/if}
    {/if}
  </div>
</Modal>

<style>
  .top-list {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
    padding: 1rem;
    border-radius: 0.875rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-lowest, var(--surface-container-lowest));
  }

  .top-list--modal,
  .top-list--bare {
    padding: 0;
    border: none;
    background: transparent;
  }

  .top-list__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .top-list__title-wrap {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .top-list__title-text {
    min-width: 0;
  }

  .top-list__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
  }

  .top-list__desc {
    margin: 0.125rem 0 0;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-list__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    border-radius: 0.5rem;
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-list__empty {
    padding: 1.5rem 0;
    margin: 0;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-list__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: opacity 150ms ease;
  }

  .top-list__body--busy { opacity: 0.55; }

  .top-list__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-outline-variant, var(--outline-variant));
  }

  .top-list__total {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-head {
    display: flex;
    gap: 0.75rem;
    padding: 0 0.5rem 0 2.25rem;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-head__entity {
    min-width: 0;
    flex: 1;
  }

  .top-head__value {
    min-width: 3.5rem;
    text-align: right;
  }

  .top-head__delta {
    min-width: 4.5rem;
    text-align: right;
  }

  .top-rows {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .top-row-wrap {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.3125rem 0.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .top-row-wrap::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--fill);
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--row-color) 14%, transparent);
    z-index: -1;
  }

  .top-row__rank {
    width: 1.25rem;
    flex-shrink: 0;
    text-align: right;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .top-row__ident {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }

  .top-row__name,
  .top-row__name-btn {
    min-width: 0;
    font-size: 0.875rem;
    color: var(--color-on-surface, var(--on-surface));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .top-row__name-btn {
    border: 0;
    background: transparent;
    padding: 0;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }

  .top-row__name-btn:hover {
    text-decoration: underline;
  }

  .top-row__spark { flex-shrink: 0; }

  .top-row__value {
    flex-shrink: 0;
    min-width: 3.5rem;
    text-align: right;
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface, var(--on-surface));
  }

  .top-row__delta {
    flex-shrink: 0;
    min-width: 4.5rem;
    text-align: right;
    font-size: 0.75rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .icon-group {
    display: inline-flex;
    padding: 0.125rem;
    gap: 0.125rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
  }

  .icon-group__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.875rem;
    height: 1.625rem;
    border: 0;
    background: transparent;
    border-radius: 0.375rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
  }

  .icon-group__btn:hover {
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface, var(--on-surface));
  }

  .icon-group__btn[aria-pressed='true'] {
    background: var(--color-surface-container-high, var(--surface-container-high));
    color: var(--color-on-surface, var(--on-surface));
  }

  .top-modal-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .top-modal-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .top-modal-search {
    min-width: 0;
    flex: 1;
  }

  .top-modal-pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .top-modal-page {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    font-variant-numeric: tabular-nums;
  }

  @container (max-width: 26rem) {
    .top-row__spark { display: none; }
  }

  @container (max-width: 19rem) {
    .top-row__delta,
    .top-head__delta { display: none; }
  }
</style>
