<!--
  Tuiles de chiffres clés qui pilotent la courbe du dessous (Kotbo v3).
  RGAA 7.1 : radiogroup / radio quand interactive=true, liste statique sinon.
-->
<script lang="ts" module>
  export interface MetricTab {
    id: string;
    label: string;
    value: string;
    delta?: number | null;
    invert?: boolean;
    previous?: string;
    spark?: number[];
    color?: string;
    hint?: string;
    tag?: { text: string; badgeUrl?: string | null };
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import Papicon from '../icons/Papicon.svelte';
  import Sparkline from './Sparkline.svelte';
  import { getMessages, type KotboUiMessages } from '../config.svelte.js';
  import { fmtDelta } from './analyticsFormat.js';

  const {
    metrics,
    active,
    onchange,
    compare = false,
    label,
    interactive = true,
    deltaUnit = 'pct',
    autoScaleSpark = false,
    messages = undefined,
    badge = undefined,
  }: {
    metrics: MetricTab[];
    active: string;
    onchange: (id: string) => void;
    compare?: boolean;
    label?: string;
    interactive?: boolean;
    deltaUnit?: 'pct' | 'pts';
    autoScaleSpark?: boolean;
    messages?: Partial<KotboUiMessages>;
    badge?: Snippet<[MetricTab]>;
  } = $props();

  const msgs = $derived(getMessages(messages));
  const resolvedLabel = $derived(label ?? msgs.anx_metrics_label());

  function tone(metric: MetricTab): 'up' | 'down' | 'flat' {
    const d = metric.delta;
    if (d === undefined || d === null || Math.abs(d) < 0.05) return 'flat';
    return d > 0 ? 'up' : 'down';
  }

  function good(metric: MetricTab): boolean | null {
    const t = tone(metric);
    if (t === 'flat') return null;
    return (t === 'up') !== Boolean(metric.invert);
  }

  function onKeydown(event: KeyboardEvent, index: number) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = metrics[(index + delta + metrics.length) % metrics.length];
    if (!next) return;
    onchange(next.id);
    const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[(index + delta + metrics.length) % metrics.length]?.focus();
  }
</script>

{#snippet content(metric: MetricTab, selected: boolean, verdict: boolean | null)}
  <span class="metric-tab__label">
    {metric.label}
    {#if badge}
      {@render badge(metric)}
    {/if}
  </span>
  <span class="metric-tab__row">
    <span class="metric-tab__value">{metric.value}</span>
    {#if metric.spark && metric.spark.length > 1}
      <Sparkline
        values={metric.spark}
        color={selected ? (metric.color ?? 'var(--metric-color)') : 'var(--series-neutral, #8a9bb0)'}
        width={64}
        height={22}
        fill={selected}
        autoScale={autoScaleSpark}
      />
    {/if}
  </span>
  {#if compare && metric.previous !== undefined}
    <span class="metric-tab__delta metric-tab__delta--muted">
      {msgs.anx_previous_period({ value: metric.previous })}
    </span>
  {:else if compare && metric.delta !== undefined}
    <span
      class="metric-tab__delta {verdict === true ? 'metric-tab__delta--success' : verdict === false ? 'metric-tab__delta--error' : 'metric-tab__delta--muted'}"
    >
      {#if tone(metric) !== 'flat'}
        <Papicon icon={tone(metric) === 'up' ? 'trending-up' : 'trending-down'} size={12} />
      {/if}
      {fmtDelta(metric.delta ?? null, deltaUnit, msgs)}
      <span class="metric-tab__delta-sub">{msgs.anx_delta_vs_previous()}</span>
    </span>
  {/if}
{/snippet}

{#if interactive}
  <div class="metric-tabs" role="radiogroup" aria-label={resolvedLabel}>
    {#each metrics as metric, index (metric.id)}
      {@const selected = metric.id === active}
      <button
        type="button"
        role="radio"
        class="metric-tab"
        aria-checked={selected}
        tabindex={selected ? 0 : -1}
        title={metric.hint || undefined}
        style="--metric-color: {metric.color ?? 'var(--series-1)'};"
        onclick={() => onchange(metric.id)}
        onkeydown={(e) => onKeydown(e, index)}
      >
        {@render content(metric, selected, good(metric))}
      </button>
    {/each}
  </div>
{:else}
  <ul class="metric-tabs" aria-label={resolvedLabel}>
    {#each metrics as metric (metric.id)}
      <li class="metric-tab metric-tab--static" title={metric.hint || undefined} style="--metric-color: {metric.color ?? 'var(--series-1)'};">
        {@render content(metric, true, good(metric))}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .metric-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    border-radius: 0.75rem;
    background: var(--color-surface-container-low, var(--surface-container-low));
    overflow: hidden;
  }

  .metric-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    padding: 0.875rem 1rem;
    text-align: left;
    background: transparent;
    border: 0;
    border-right: 1px solid var(--color-outline-variant, var(--outline-variant));
    border-bottom: 1px solid var(--color-outline-variant, var(--outline-variant));
    margin: 0 -1px -1px 0;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  .metric-tab::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: transparent;
    z-index: 2;
  }

  .metric-tab:hover {
    background: var(--color-surface-container, var(--surface-container));
  }

  .metric-tab[aria-checked='true'] {
    background: var(--color-surface-container, var(--surface-container));
  }

  .metric-tab[aria-checked='true']::before {
    background: var(--metric-color);
  }

  .metric-tab--static,
  .metric-tab--static:hover {
    background: transparent;
    cursor: default;
  }

  .metric-tab:focus-visible {
    outline: 2px solid var(--color-primary, var(--primary-color));
    outline-offset: -2px;
  }

  .metric-tab__label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 0;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    flex-wrap: wrap;
    overflow-wrap: anywhere;
  }

  .metric-tab__row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    min-width: 0;
  }

  .metric-tab__value {
    font-family: var(--font-headline, var(--display));
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.15;
    color: var(--color-on-surface, var(--on-surface));
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .metric-tab__delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    flex-wrap: wrap;
  }

  .metric-tab__delta--success {
    color: var(--color-success, var(--ok, #16a34a));
  }

  .metric-tab__delta--error {
    color: var(--color-error, var(--danger, #dc2626));
  }

  .metric-tab__delta--muted,
  .metric-tab__delta-sub {
    font-weight: 400;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
