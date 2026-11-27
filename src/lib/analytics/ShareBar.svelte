<script lang="ts" module>
  export interface ShareSegment {
    id: string;
    label: string;
    value: number;
    color: string;
  }
</script>

<script lang="ts">
  import { fmtNumber, fmtPct } from './analyticsFormat.js';

  const {
    segments,
    columns = 3,
    showCounts = false,
  }: {
    segments: ShareSegment[];
    columns?: number;
    showCounts?: boolean;
  } = $props();

  const pctOf = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);
  const total = $derived(segments.reduce((s, x) => s + x.value, 0));
  const visible = $derived(segments.filter((s) => s.value > 0));
</script>

<div class="share-wrap">
  <div class="share-bar" aria-hidden="true">
    {#if total === 0}
      <span class="share-bar__empty"></span>
    {:else}
      {#each visible as segment (segment.id)}
        <span
          class="share-bar__segment"
          style="flex: {segment.value} 1 0; background: {segment.color};"
          title={`${segment.label} : ${fmtPct(pctOf(segment.value, total))}`}
        ></span>
      {/each}
    {/if}
  </div>
  <ul class="share-legend" style="--cols: {columns};">
    {#each segments as segment (segment.id)}
      <li class="share-legend__item">
        <span class="share-legend__dot" style="background: {segment.color};"></span>
        <span class="share-legend__label">{segment.label}</span>
        <span class="share-legend__pct">
          {fmtPct(pctOf(segment.value, total))}
        </span>
        {#if showCounts}
          <span class="share-legend__count">{fmtNumber(segment.value)}</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .share-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .share-bar {
    display: flex;
    gap: 2px;
    height: 12px;
    border-radius: 999px;
    overflow: hidden;
  }

  .share-bar__segment {
    min-width: 3px;
    height: 100%;
  }

  .share-bar__empty {
    flex: 1;
    background: var(--color-surface-container, var(--surface-container));
  }

  .share-legend {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 0.5rem 1.25rem;
  }

  .share-legend__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  .share-legend__dot {
    width: 0.625rem;
    height: 0.625rem;
    flex-shrink: 0;
    border-radius: 0.125rem;
  }

  .share-legend__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
    color: var(--color-on-surface, var(--on-surface));
  }

  .share-legend__pct {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface, var(--on-surface));
  }

  .share-legend__count {
    flex-shrink: 0;
    font-size: 0.6875rem;
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  @media (max-width: 767px) {
    .share-legend {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 420px) {
    .share-legend {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
