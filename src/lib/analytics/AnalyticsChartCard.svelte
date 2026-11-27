<script lang="ts" module>
  import type { Aggregate } from './timeSeries.js';

  export interface AnalyticsCardMetric {
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
    format?: (value: number) => string;
    values: (number | null)[];
    previousValues?: (number | null)[];
    aggregate?: Aggregate;
    canForecast?: boolean;
    forecastData?: {
      dates: string[];
      labels?: string[];
      values: number[];
      low?: number[];
      high?: number[];
    } | null;
  }

  export interface AnalyticsFact {
    label: string;
    value: string;
    sub?: string;
    tone?: 'success' | 'error' | 'neutral';
    wide?: boolean;
    title?: string;
  }

  export interface AnalyticsViewOption {
    id: string;
    icon: string;
    label: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import Papicon from '../icons/Papicon.svelte';
  import FilterPills, { type FilterOption } from '../ui/FilterPills.svelte';
  import MetricTabs, { type MetricTab } from './MetricTabs.svelte';
  import TimeSeriesChart, { type ChartMarker, type ChartMode } from './TimeSeriesChart.svelte';
  import { getMessages } from '../config.svelte.js';
  import { fmtDelta, fmtNumber, shortDate } from './analyticsFormat.js';
  import { movingAverage, trendPct } from './timeSeries.js';

  let {
    metrics,
    active = $bindable(''),
    onActiveChange = undefined,
    labels,
    periodOptions = [],
    period = '',
    onPeriodChange = undefined,
    views = undefined,
    view = $bindable('line'),
    compare = false,
    onToggleCompare = undefined,
    smooth = $bindable(false),
    showForecast = $bindable(false),
    smoothingWindowSize = 7,
    autoScaleSpark = false,
    markers = [],
    facts = undefined,
    tableHeaders = undefined,
    tableRows = undefined,
    storageKey = '',
    busy = false,
    height = 280,
    onChartSelect = undefined,
    toolbarExtra = undefined,
    layersExtra = undefined,
    beforePlot = undefined,
    customPlot = undefined,
    metricBadge = undefined,
    footer = undefined,
  }: {
    metrics: AnalyticsCardMetric[];
    active?: string;
    onActiveChange?: (id: string) => void;
    labels: string[];
    periodOptions?: FilterOption<string>[];
    period?: string;
    onPeriodChange?: (value: string) => void;
    views?: AnalyticsViewOption[];
    view?: string;
    compare?: boolean;
    onToggleCompare?: () => void;
    smooth?: boolean;
    showForecast?: boolean;
    smoothingWindowSize?: number;
    autoScaleSpark?: boolean;
    markers?: ChartMarker[];
    facts?: AnalyticsFact[];
    tableHeaders?: string[];
    tableRows?: Array<{ key?: string; label: string; cells: string[] }>;
    storageKey?: string;
    busy?: boolean;
    height?: number;
    onChartSelect?: (index: number) => void;
    toolbarExtra?: Snippet;
    layersExtra?: Snippet;
    beforePlot?: Snippet;
    customPlot?: Snippet<[string]>;
    metricBadge?: Snippet<[MetricTab]>;
    footer?: Snippet;
  } = $props();

  const msgs = $derived(getMessages());

  const initialStorageKey = untrack(() => storageKey);
  if (initialStorageKey && typeof window !== 'undefined') {
    try {
      const saved = JSON.parse(localStorage.getItem(initialStorageKey) ?? '{}');
      if (saved.view) view = saved.view;
      if (typeof saved.smooth === 'boolean') smooth = saved.smooth;
      if (typeof saved.forecast === 'boolean') showForecast = saved.forecast;
    } catch {
      /* stockage indisponible */
    }
  }

  $effect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ view, smooth, forecast: showForecast }));
    } catch {
      /* stockage indisponible */
    }
  });

  const resolvedActive = $derived(active || metrics[0]?.id || '');
  const metric = $derived(metrics.find((mt) => mt.id === resolvedActive) ?? metrics[0]);

  function selectMetric(id: string) {
    active = id;
    onActiveChange?.(id);
  }

  const defaultViews = $derived<AnalyticsViewOption[]>([
    { id: 'line', icon: 'line-chart', label: msgs.anx_view_line() },
    { id: 'bar', icon: 'bar-chart-2', label: msgs.anx_view_bar() },
    { id: 'table', icon: 'table', label: msgs.anx_view_table() },
  ]);

  const resolvedViews = $derived(views ?? defaultViews);
  const isCustomView = $derived(view !== 'line' && view !== 'bar' && view !== 'table');
  const layersDisabled = $derived(isCustomView || view === 'table');

  const forecastAllowed = $derived.by(() => {
    if (!metric) return false;
    if (metric.canForecast === false) return false;
    if (metric.forecastData) return true;
    const valid = metric.values.filter((v): v is number => v !== null);
    return valid.length >= 2;
  });

  const projectionData = $derived.by(() => {
    if (!showForecast || !forecastAllowed || !metric || isCustomView || view === 'bar' || view === 'table') {
      return null;
    }
    if (metric.forecastData) {
      const fc = metric.forecastData;
      const projLabels = fc.labels ?? fc.dates.map((d) => shortDate(d));
      return {
        labels: projLabels,
        values: fc.values,
        low: fc.low,
        high: fc.high,
      };
    }
    const valid = metric.values.filter((v): v is number => v !== null);
    if (valid.length < 2) return null;
    const lastVal = valid[valid.length - 1]!;
    const prevVal = valid[valid.length - 2]!;
    const step = (lastVal - prevVal) * 0.5;
    const values = [1, 2, 3].map((k) => Math.max(0, Math.round((lastVal + step * k) * 10) / 10));
    return {
      labels: ['+1', '+2', '+3'],
      values,
      low: undefined,
      high: undefined,
    };
  });

  const pad = (n: number) => new Array<null>(n).fill(null);
  const chartLabels = $derived(projectionData ? [...labels, ...projectionData.labels] : labels);

  const chartMain = $derived.by(() => {
    if (!metric) return null;
    return {
      label: metric.label,
      color: metric.color ?? 'var(--series-1, #2a78d6)',
      values: projectionData ? [...metric.values, ...pad(projectionData.values.length)] : metric.values,
    };
  });

  const chartPrevious = $derived.by(() => {
    if (!compare || !metric?.previousValues || metric.previousValues.length === 0 || isCustomView) return null;
    return {
      label: msgs.anx_trend_previous(),
      values: projectionData ? [...metric.previousValues, ...pad(projectionData.values.length)] : metric.previousValues,
    };
  });

  const chartSmoothed = $derived.by(() => {
    if (!smooth || !metric || isCustomView || view === 'bar') return null;
    const ma = movingAverage(metric.values, smoothingWindowSize);
    return {
      label: msgs.anx_series_smoothed(),
      values: projectionData ? [...ma, ...pad(projectionData.values.length)] : ma,
    };
  });

  const chartProjection = $derived.by(() => {
    if (!projectionData || !metric) return null;
    const last = metric.values[metric.values.length - 1] ?? 0;
    const lead = pad(Math.max(0, metric.values.length - 1));
    return {
      label: msgs.anx_series_forecast(),
      values: [...lead, last, ...projectionData.values],
      low: projectionData.low ? [...lead, last, ...projectionData.low] : undefined,
      high: projectionData.high ? [...lead, last, ...projectionData.high] : undefined,
    };
  });

  const computedFacts = $derived.by<AnalyticsFact[]>(() => {
    if (facts) return facts;
    if (!metric) return [];
    const fmt = metric.format ?? ((v: number) => fmtNumber(v));
    const vals = metric.values;
    const valid = vals.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v !== null);
    if (valid.length === 0) return [];
    const total = valid.reduce((s, x) => s + x.v, 0);
    const avg = total / valid.length;
    let peak = valid[0]!;
    let low = valid[0]!;
    for (const item of valid) {
      if (item.v > peak.v) peak = item;
      if (item.v < low.v) low = item;
    }
    const agg = metric.aggregate ?? 'sum';
    const tr = trendPct(valid.map((x) => x.v));
    const list: AnalyticsFact[] = [
      {
        label: agg === 'sum' ? msgs.anx_fact_total() : msgs.anx_fact_average(),
        value: fmt(agg === 'sum' ? total : Math.round(avg * 10) / 10),
      },
    ];
    if (agg === 'sum') {
      list.push({
        label: msgs.anx_fact_average(),
        value: fmt(Math.round(avg * 10) / 10),
      });
    }
    list.push({
      label: msgs.anx_fact_peak(),
      value: fmt(peak.v),
      sub: labels[peak.i] ?? '',
    });
    if (agg === 'avg') {
      list.push({
        label: msgs.anx_fact_min(),
        value: fmt(low.v),
        sub: labels[low.i] ?? '',
      });
    }
    list.push({
      label: msgs.anx_fact_trend(),
      value: fmtDelta(tr, 'pct', msgs),
      sub: msgs.anx_trend_vs_start(),
      tone: tr === null || Math.abs(tr) < 0.05 ? 'neutral' : (tr > 0) !== Boolean(metric.invert) ? 'success' : 'error',
      title: msgs.anx_trend_vs_start(),
    });
    return list;
  });

  const metricTabs = $derived<MetricTab[]>(
    metrics.map((mt) => ({
      id: mt.id,
      label: mt.label,
      value: mt.value,
      delta: mt.delta,
      invert: mt.invert,
      previous: mt.previous,
      spark: mt.spark,
      color: mt.color,
      hint: mt.hint,
      tag: mt.tag,
    })),
  );

  const chartMode: ChartMode = $derived(view === 'bar' ? 'bar' : 'line');
  const formatVal = $derived(metric?.format ?? ((v: number) => fmtNumber(v)));
</script>

<section class="chart-card" aria-busy={busy}>
  <MetricTabs
    metrics={metricTabs}
    active={resolvedActive}
    onchange={selectMetric}
    {compare}
    {autoScaleSpark}
    badge={metricBadge}
    label={msgs.anx_metrics_label()}
  />

  <div class="chart-card__toolbar">
    <div class="chart-card__toolbar-left">
      {#if periodOptions.length > 0 && onPeriodChange}
        <FilterPills label={msgs.anx_table_period()} options={periodOptions} value={period} onchange={onPeriodChange} />
      {/if}
      {#if toolbarExtra}
        {@render toolbarExtra()}
      {/if}
    </div>

    <div class="chart-card__tools">
      <div class="icon-group" role="group" aria-label={msgs.anx_view_label()}>
        {#each resolvedViews as option (option.id)}
          <button
            type="button"
            class="icon-group__btn"
            aria-pressed={view === option.id}
            aria-label={option.label}
            title={option.label}
            disabled={option.disabled}
            onclick={() => (view = option.id)}
          >
            <Papicon icon={option.icon} size={16} />
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="chart-card__layers">
    <button
      type="button"
      class="filter-pill"
      aria-pressed={smooth}
      disabled={layersDisabled || view === 'bar'}
      onclick={() => (smooth = !smooth)}
    >
      {msgs.anx_opt_smooth()}
    </button>
    {#if onToggleCompare}
      <button
        type="button"
        class="filter-pill"
        aria-pressed={compare}
        disabled={isCustomView}
        onclick={onToggleCompare}
      >
        {msgs.anx_opt_previous()}
      </button>
    {/if}
    {#if metric && metric.canForecast !== false}
      <button
        type="button"
        class="filter-pill"
        aria-pressed={showForecast && forecastAllowed}
        disabled={layersDisabled || view === 'bar' || !forecastAllowed}
        title={forecastAllowed ? undefined : msgs.anx_forecast_unavailable()}
        onclick={() => (showForecast = !showForecast)}
      >
        {msgs.anx_opt_forecast()}
      </button>
    {/if}
    {#if layersExtra}
      {@render layersExtra()}
    {/if}
  </div>

  {#if beforePlot}
    {@render beforePlot()}
  {/if}

  <div class="chart-card__plot" class:chart-card__plot--busy={busy}>
    {#if view === 'table'}
      <div class="table-wrap chart-card__table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">{msgs.anx_table_period()}</th>
              {#if tableHeaders && tableRows}
                {#each tableHeaders as header, i (i)}
                  <th scope="col" class="num">{header}</th>
                {/each}
              {:else if metric}
                <th scope="col" class="num">{metric.label}</th>
                {#if compare && metric.previousValues}
                  <th scope="col" class="num">{msgs.anx_table_previous()}</th>
                {/if}
              {/if}
            </tr>
          </thead>
          <tbody>
            {#if tableHeaders && tableRows}
              {#each tableRows as row, i (row.key ?? i)}
                <tr>
                  <th scope="row">{row.label}</th>
                  {#each row.cells as cell, j (j)}
                    <td class="num">{cell}</td>
                  {/each}
                </tr>
              {/each}
            {:else if metric}
              {#each labels as lbl, i (i)}
                <tr>
                  <th scope="row">{lbl}</th>
                  <td class="num">{metric.values[i] != null ? formatVal(metric.values[i]!) : 'N/A'}</td>
                  {#if compare && metric.previousValues}
                    <td class="num chart-card__muted">
                      {metric.previousValues[i] != null ? formatVal(metric.previousValues[i]!) : 'N/A'}
                    </td>
                  {/if}
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    {:else if isCustomView && customPlot}
      {@render customPlot(view)}
    {:else}
      <TimeSeriesChart
        labels={chartLabels}
        mode={chartMode}
        main={chartMain}
        previous={chartPrevious}
        smoothed={chartSmoothed}
        projection={chartProjection}
        {markers}
        format={formatVal}
        {height}
        onselect={onChartSelect}
      />
    {/if}
  </div>

  {#if computedFacts.length > 0}
    <dl class="facts">
      {#each computedFacts as fact, i (fact.label + i)}
        <div class="facts__item" class:facts__item--wide={fact.wide}>
          <dt title={fact.title}>{fact.label}</dt>
          <dd class={fact.tone === 'success' ? 'facts__val--success' : fact.tone === 'error' ? 'facts__val--error' : ''}>
            {fact.value}
            {#if fact.sub}
              <span class="facts__sub">{fact.sub}</span>
            {/if}
          </dd>
        </div>
      {/each}
    </dl>
  {/if}

  {#if footer}
    {@render footer()}
  {/if}
</section>

<style>
  .chart-card {
    display: flex;
    flex-direction: column;
    gap: var(--kotbo-chart-card-gap, 0.875rem);
    min-width: 0;
    padding: var(--kotbo-chart-card-padding, 1rem);
    border-radius: var(--kotbo-chart-card-radius, 0.875rem);
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--kotbo-chart-card-bg, var(--color-surface-container-lowest, var(--surface-container-lowest)));
  }

  .chart-card__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 1rem;
  }

  .chart-card__toolbar-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .chart-card__tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chart-card__layers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
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
    width: 2rem;
    height: 1.75rem;
    border: 0;
    background: transparent;
    border-radius: 0.375rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
    cursor: pointer;
  }

  .icon-group__btn:hover:not(:disabled) {
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface, var(--on-surface));
  }

  .icon-group__btn[aria-pressed='true'] {
    background: var(--color-surface-container-high, var(--surface-container-high));
    color: var(--color-on-surface, var(--on-surface));
  }

  .icon-group__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .chart-card__plot {
    min-width: 0;
    transition: opacity 150ms ease;
  }

  .chart-card__plot--busy {
    opacity: 0.55;
  }

  .chart-card__table-wrap {
    max-height: 22rem;
    overflow: auto;
  }

  .chart-card__table-wrap .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .chart-card__muted {
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .facts {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 0.5rem 1.5rem;
    padding-top: var(--kotbo-facts-padding-top, 0.75rem);
    border-top: 1px solid var(--color-outline-variant, var(--outline-variant));
  }

  .facts__item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .facts__item--wide {
    grid-column: 1 / -1;
  }

  .facts__item dt {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .facts__item dd {
    margin: 0;
    font-size: var(--kotbo-fact-value-size, 0.9375rem);
    font-weight: var(--kotbo-fact-value-weight, 600);
    font-variant-numeric: tabular-nums;
    color: var(--color-on-surface, var(--on-surface));
  }

  .facts__val--success {
    color: var(--color-success, var(--ok, #16a34a)) !important;
  }

  .facts__val--error {
    color: var(--color-error, var(--danger, #dc2626)) !important;
  }

  .facts__sub {
    margin-left: 0.25rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
