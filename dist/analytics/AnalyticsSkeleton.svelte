<script lang="ts">
  import Skeleton from '../ui/Skeleton.svelte';

  const { compact = false, rows = 5 }: { compact?: boolean; rows?: number } = $props();
</script>

{#if compact}
  <div class="anx-skel-compact" aria-busy="true">
    {#each Array(rows) as _}
      <div class="anx-skel-compact__row">
        <Skeleton width="2rem" height="2rem" rounded="0.5rem" />
        <div class="anx-skel-compact__lines">
          <Skeleton width="100%" height="0.75rem" />
          <Skeleton width="50%" height="0.5rem" />
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="anx-skel-page" aria-busy="true">
    <div class="anx-skel-kpis">
      {#each Array(4) as _}
        <div class="anx-skel-card">
          <div class="anx-skel-card__top">
            <Skeleton width="2.5rem" height="2.5rem" rounded="0.75rem" />
            <Skeleton width="4rem" height="0.75rem" />
          </div>
          <div class="anx-skel-card__bottom">
            <Skeleton width="6rem" height="2rem" />
            <Skeleton width="8rem" height="0.75rem" />
          </div>
        </div>
      {/each}
    </div>

    <div class="anx-skel-main">
      <div class="anx-skel-chart">
        <div class="anx-skel-chart__head">
          <div class="anx-skel-chart__ident">
            <Skeleton width="3rem" height="3rem" rounded="0.5rem" />
            <div class="anx-skel-compact__lines">
              <Skeleton width="8rem" height="1.25rem" />
              <Skeleton width="6rem" height="0.75rem" />
            </div>
          </div>
          <Skeleton width="5rem" height="2rem" rounded="0.75rem" />
        </div>
        <Skeleton width="100%" height="16rem" rounded="0.75rem" />
      </div>

      <div class="anx-skel-side">
        <div class="anx-skel-card">
          <Skeleton width="100%" height="10rem" rounded="0.5rem" />
          <Skeleton width="75%" height="1rem" />
          <Skeleton width="50%" height="0.75rem" />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .anx-skel-compact {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .anx-skel-compact__row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .anx-skel-compact__lines {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .anx-skel-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .anx-skel-kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
  }

  .anx-skel-card,
  .anx-skel-chart {
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-outline-variant, var(--outline-variant));
    background: var(--color-surface-container-low, var(--surface-container-low));
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .anx-skel-card__top,
  .anx-skel-chart__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .anx-skel-card__bottom {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .anx-skel-chart__ident {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .anx-skel-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .anx-skel-main {
      grid-template-columns: 2fr 1fr;
    }
  }

  .anx-skel-side {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
