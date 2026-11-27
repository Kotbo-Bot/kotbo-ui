<!--
  Mini-courbe sans axe Kotbo v3, décorative : la valeur exacte est toujours affichée à côté.
-->
<script lang="ts">
  const {
    values,
    color = 'var(--series-1)',
    width = 72,
    height = 22,
    fill = true,
    autoScale = false,
  }: {
    values: number[];
    color?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    autoScale?: boolean;
  } = $props();

  const id = $props.id();
  const gradId = `spark-grad-${id}`;
  const PAD = 1.5;

  const points = $derived.by(() => {
    if (!values || values.length < 2) return [];
    const rawMax = Math.max(...values);
    const rawMin = Math.min(...values);
    let max = rawMax;
    let min = Math.min(0, rawMin);
    if (autoScale) {
      const diff = rawMax - rawMin;
      const padding = diff > 0 ? diff * 0.25 : rawMax > 0 ? rawMax * 0.1 : 1;
      max = rawMax + padding;
      min = Math.max(0, rawMin - padding);
    }
    const span = max - min || 1;
    const step = (width - PAD * 2) / (values.length - 1);
    return values.map((v, i) => [PAD + i * step, height - PAD - ((v - min) / span) * (height - PAD * 2)] as const);
  });

  const line = $derived(points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
  const area = $derived(
    points.length > 0
      ? `M${points[0]![0].toFixed(1)},${height} L${line.replaceAll(' ', ' L')} L${points[points.length - 1]![0].toFixed(1)},${height} Z`
      : '',
  );
</script>

{#if points.length > 0}
  <svg class="sparkline" viewBox="0 0 {width} {height}" {width} {height} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color={color} stop-opacity="0.22" />
        <stop offset="100%" stop-color={color} stop-opacity="0" />
      </linearGradient>
    </defs>
    {#if fill}
      <path d={area} fill="url(#{gradId})" />
    {/if}
    <polyline points={line} style="stroke: {color};" fill="none" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
  </svg>
{/if}

<style>
  .sparkline {
    display: block;
    flex-shrink: 0;
    overflow: visible;
  }
</style>
