<script lang="ts">
  import Papicon from '../icons/Papicon.svelte';

  type TileVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

  const {
    icon,
    tone = '',
    variant = undefined,
    value,
    label,
    class: className = '',
  }: {
    icon: string;
    tone?: string;
    variant?: TileVariant;
    value: string | number;
    label: string;
    class?: string;
  } = $props();

  const resolvedVariant = $derived(variant ?? (!tone ? 'neutral' : undefined));
</script>

<div class="kotbo-stat-tile {className}">
  <div
    class="kotbo-stat-tile__icon {resolvedVariant ? `kotbo-stat-tile__icon--${resolvedVariant}` : ''} {tone}"
  >
    <Papicon {icon} size={20} />
  </div>
  <div class="kotbo-stat-tile__body">
    <span class="kotbo-stat-tile__value">{value}</span>
    <span class="kotbo-stat-tile__label">{label}</span>
  </div>
</div>

<style>
  .kotbo-stat-tile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--color-surface-container-high, var(--surface-container-high)) 35%, transparent);
    min-width: 0;
  }

  .kotbo-stat-tile__icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .kotbo-stat-tile__icon--primary {
    background: color-mix(in srgb, var(--color-primary, var(--primary-color)) 12%, transparent);
    color: var(--color-primary, var(--primary-color));
  }

  .kotbo-stat-tile__icon--success {
    background: color-mix(in srgb, var(--color-success, var(--success-color)) 12%, transparent);
    color: var(--color-on-success-container, var(--on-success-container-color));
  }

  .kotbo-stat-tile__icon--warning {
    background: color-mix(in srgb, var(--color-warning, var(--warning-color)) 12%, transparent);
    color: var(--color-on-warning-container, var(--on-warning-container-color));
  }

  .kotbo-stat-tile__icon--danger {
    background: color-mix(in srgb, var(--color-error, var(--error-color)) 12%, transparent);
    color: var(--color-on-error-container, var(--on-error-container-color));
  }

  .kotbo-stat-tile__icon--neutral {
    background: var(--color-surface-container, var(--surface-container));
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .kotbo-stat-tile__body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .kotbo-stat-tile__value {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--color-on-surface, var(--on-surface));
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .kotbo-stat-tile__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }
</style>
