<script lang="ts">
  import Papicon from '../icons/Papicon.svelte';
  import { getMessages } from '../config.svelte.js';
  import { fmtDelta } from './analyticsFormat.js';

  const {
    label,
    value,
    delta = undefined,
    unit = 'pct',
    compare = false,
    invert = false,
    hint = '',
  }: {
    label: string;
    value: string;
    delta?: number | null;
    unit?: 'pct' | 'pts' | 'abs';
    compare?: boolean;
    invert?: boolean;
    hint?: string;
  } = $props();

  const msgs = $derived(getMessages());
  const direction = $derived(
    delta === undefined || delta === null ? 'flat' : Math.abs(delta) < 0.05 ? 'flat' : delta > 0 ? 'up' : 'down',
  );
  const verdict = $derived(direction === 'flat' ? null : (direction === 'up') !== invert);
</script>

<div class="kpi-tile" title={hint || undefined}>
  <span class="kpi-tile__label">{label}</span>
  <span class="kpi-tile__value">{value}</span>
  {#if compare && delta !== undefined}
    <span
      class="kpi-tile__delta {verdict === true ? 'kpi-tile__delta--up' : verdict === false ? 'kpi-tile__delta--down' : ''}"
      title={msgs.anx_delta_title()}
    >
      {#if direction !== 'flat'}
        <Papicon icon={direction === 'up' ? 'trending-up' : 'trending-down'} size={12} />
      {/if}
      {fmtDelta(delta ?? null, unit, msgs)}
      <span class="sr-only">{msgs.anx_delta_title()}</span>
    </span>
  {/if}
</div>

<style>
  .kpi-tile {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    padding: 1rem 1.125rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-low, var(--surface-container-low));
  }

  .kpi-tile__label {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kpi-tile__value {
    font-family: var(--font-headline, var(--display));
    font-size: 1.625rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-on-surface, var(--on-surface));
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kpi-tile__delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kpi-tile__delta--up {
    color: var(--color-success, var(--ok, #16a34a));
  }

  .kpi-tile__delta--down {
    color: var(--color-error, var(--danger, #dc2626));
  }
</style>
