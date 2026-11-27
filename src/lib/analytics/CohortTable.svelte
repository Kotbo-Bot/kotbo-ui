<script lang="ts" module>
  export interface CohortRow {
    week: string;
    size: number;
    retention: (number | null)[];
  }
</script>

<script lang="ts">
  import Callout from '../ui/Callout.svelte';
  import SectionCard from '../ui/SectionCard.svelte';
  import AnalyticsSkeleton from './AnalyticsSkeleton.svelte';
  import { getMessages } from '../config.svelte.js';
  import { fmtNumber, shortDate } from './analyticsFormat.js';

  const {
    title,
    description = '',
    cohorts = [],
    weeks = 0,
    loading = false,
    error = '',
    notice = '',
    columnPrefix = 'S',
  }: {
    title: string;
    description?: string;
    cohorts?: CohortRow[];
    weeks?: number;
    loading?: boolean;
    error?: string;
    notice?: string;
    columnPrefix?: string;
  } = $props();

  const msgs = $derived(getMessages());

  function cellStyle(value: number | null): string {
    if (value === null) return '';
    const strength = Math.round(8 + Math.min(100, value) * 0.8);
    return `background: color-mix(in srgb, var(--color-primary, var(--primary-color)) ${strength}%, var(--color-surface-container-lowest, var(--surface-container-lowest)));${strength > 55 ? ' color: var(--color-on-primary, var(--on-primary-color));' : ''}`;
  }

  const average = $derived.by(() => {
    if (weeks <= 0 || cohorts.length === 0) return [];
    return Array.from({ length: weeks }, (_, offset) => {
      let weighted = 0;
      let size = 0;
      for (const c of cohorts) {
        const v = c.retention[offset];
        if (v === null || v === undefined || c.size === 0) continue;
        weighted += v * c.size;
        size += c.size;
      }
      return size > 0 ? Math.round((weighted / size) * 10) / 10 : null;
    });
  });
</script>

<SectionCard {title} {description}>
  {#if error}
    <Callout variant="danger">{error}</Callout>
  {:else if loading}
    <AnalyticsSkeleton />
  {:else}
    {#if notice}
      <Callout variant="info">{notice}</Callout>
    {/if}
    <div class="cohort-wrap">
      <table class="cohort">
        <thead>
          <tr>
            <th scope="col" class="cohort__head">{msgs.anx_cohort_week()}</th>
            <th scope="col" class="cohort__num">{msgs.anx_cohort_size()}</th>
            {#each Array.from({ length: weeks }, (_, i) => i) as offset (offset)}
              <th scope="col" class="cohort__num">{columnPrefix}{offset}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each cohorts as cohort (cohort.week)}
            <tr>
              <th scope="row" class="cohort__head">{shortDate(cohort.week)}</th>
              <td class="cohort__num">{fmtNumber(cohort.size)}</td>
              {#each cohort.retention as value, offset (offset)}
                <td class="cohort__cell" style={cellStyle(cohort.size > 0 ? value : null)}>
                  {value === null || cohort.size === 0 ? '' : `${fmtNumber(Math.round(value))} %`}
                </td>
              {/each}
            </tr>
          {/each}
          {#if cohorts.length > 0}
            <tr class="cohort__avg">
              <th scope="row" class="cohort__head">{msgs.anx_cohort_average()}</th>
              <td></td>
              {#each average as value, offset (offset)}
                <td class="cohort__num">{value === null ? '' : `${fmtNumber(Math.round(value))} %`}</td>
              {/each}
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</SectionCard>

<style>
  .cohort-wrap {
    overflow-x: auto;
    margin-top: 0.5rem;
  }

  .cohort {
    width: 100%;
    border-collapse: separate;
    border-spacing: 2px;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  .cohort th,
  .cohort td {
    padding: 0.375rem 0.4375rem;
    white-space: nowrap;
  }

  .cohort thead th {
    font-weight: 500;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cohort__head {
    text-align: left;
    font-weight: 500;
    color: var(--color-on-surface, var(--on-surface));
  }

  .cohort__num {
    text-align: right;
    color: var(--color-on-surface-variant, var(--on-surface-variant));
  }

  .cohort__cell {
    min-width: 2.75rem;
    text-align: center;
    border-radius: 0.25rem;
    color: var(--color-on-surface, var(--on-surface));
  }

  .cohort__avg th,
  .cohort__avg td {
    border-top: 1px solid var(--color-outline-variant, var(--outline-variant));
    font-weight: 600;
    color: var(--color-on-surface, var(--on-surface));
  }
</style>
