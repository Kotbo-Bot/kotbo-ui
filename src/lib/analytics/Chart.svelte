<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getLocale, getMessages } from '../config.svelte.js';
  import { chartTable, nearestHeadingText } from './chartTable.js';
  import {
    Chart,
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    DoughnutController,
    Filler,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PieController,
    PointElement,
    Title,
    Tooltip,
    type ChartConfiguration,
    type ChartTypeRegistry,
  } from 'chart.js';

  Chart.register(
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    DoughnutController,
    PieController,
    ArcElement,
    CategoryScale,
    LinearScale,
    Filler,
    Legend,
    Title,
    Tooltip,
  );

  const {
    data,
    type = 'line',
    options = {},
    height = 300,
    width = null as number | null,
    plugins = [] as any[],
    label = '',
  }: {
    data: any;
    type?: keyof ChartTypeRegistry;
    options?: any;
    height?: number;
    width?: number | null;
    plugins?: any[];
    label?: string;
  } = $props();

  const msgs = $derived(getMessages());
  const numberFmt = $derived(new Intl.NumberFormat(getLocale()));
  const table = $derived(chartTable(data, (n) => numberFmt.format(n)));

  let container = $state<HTMLDivElement | null>(null);
  let headingLabel = $state('');
  $effect(() => {
    if (container) headingLabel = nearestHeadingText(container);
  });

  let canvas = $state<HTMLCanvasElement | null>(null);
  let chart = $state<Chart | null>(null);

  const PALETTE = [
    'var(--series-1, var(--color-primary))',
    'var(--series-2, var(--color-tertiary))',
    'var(--series-3, #1baf7a)',
    'var(--series-4, #eda100)',
    'var(--series-5, #e87ba4)',
    'var(--series-6, #008300)',
    'var(--series-7, #4a3aa7)',
    'var(--series-8, #e34948)',
  ];
  const PALETTE_FALLBACK = '#2a78d6';

  const COLOR_KEYS = [
    'borderColor',
    'backgroundColor',
    'pointBackgroundColor',
    'pointBorderColor',
    'hoverBackgroundColor',
    'hoverBorderColor',
  ] as const;

  function cssVar(name: string): string {
    if (typeof document === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function isDarkMode(): boolean {
    if (typeof document === 'undefined') return false;
    const root = document.documentElement;
    if (root.classList.contains('dark') || root.dataset.theme === 'dark') return true;
    if (root.dataset.theme === 'light' || root.classList.contains('light')) return false;
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }

  let probe: CanvasRenderingContext2D | null = null;

  function toRgb(color: string): [number, number, number] {
    probe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!probe) return [42, 120, 214];
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = PALETTE_FALLBACK;
    probe.fillStyle = color;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }

  function withAlpha(color: string, alpha: number): string {
    const [r, g, b] = toRgb(color);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function resolveColor(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(resolveColor);
    if (typeof value !== 'string' || !value.includes('var(')) return value;

    const wrapped = value.match(/^rgba?\(\s*var\((--[\w-]+)\)\s*(?:,\s*([\d.]+)\s*)?\)$/);
    if (wrapped) {
      const base = cssVar(wrapped[1]);
      return withAlpha(base || PALETTE_FALLBACK, wrapped[2] ? Number(wrapped[2]) : 1);
    }
    return value.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_, name, fallback) => {
      return cssVar(name) || fallback?.trim() || PALETTE_FALLBACK;
    });
  }

  function paletteColor(index: number): string {
    return resolveColor(PALETTE[index % PALETTE.length]) as string;
  }

  function hasColor(dataset: any): boolean {
    return dataset.borderColor != null || dataset.backgroundColor != null || !!dataset.gradient;
  }

  function prepareData(raw: any) {
    const snapped = $state.snapshot(raw) as any;
    const circular = type === 'doughnut' || type === 'pie';

    return {
      ...snapped,
      datasets: (snapped?.datasets || []).map((dataset: any, index: number) => {
        const d = { ...dataset };

        if (!hasColor(d)) {
          if (circular) {
            d.backgroundColor = (d.data || []).map((_: unknown, i: number) => paletteColor(i));
            d.borderWidth ??= 0;
          } else {
            const color = paletteColor(index);
            d.borderColor = color;
            d.backgroundColor = type === 'bar' ? withAlpha(color, 0.8) : withAlpha(color, 0.12);
            d.pointBackgroundColor ??= color;
            if (type === 'bar') d.borderRadius ??= 4;
          }
        }

        for (const key of COLOR_KEYS) {
          if (d[key] != null) d[key] = resolveColor(d[key]);
        }

        const gradientColors = d.gradient?.backgroundColor?.colors;
        if (gradientColors) {
          const colors: Record<string, unknown> = {};
          for (const key in gradientColors) colors[key] = resolveColor(gradientColors[key]);
          d.gradient = {
            ...d.gradient,
            backgroundColor: { ...d.gradient.backgroundColor, colors },
          };
        }

        return d;
      }),
    };
  }

  function initChart() {
    if (!canvas) return;
    if (chart) chart.destroy();

    const dark = isDarkMode();
    const textColor = cssVar('--color-on-surface-variant') || (dark ? '#9aaac0' : '#64748b');
    const gridColor = dark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    const surfaceBg = cssVar('--color-surface-container-lowest') || (dark ? '#101a30' : '#ffffff');
    const inkColor = cssVar('--color-on-surface') || (dark ? '#f4f7fc' : '#0f172a');
    const borderColor = cssVar('--color-outline-variant') || (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');

    const processedData = prepareData(data);

    const verticalLinePlugin = {
      id: 'verticalLine',
      afterDatasetsDraw: (chartInstance: any) => {
        if (type !== 'line' && type !== 'bar') return;
        const activeElements = chartInstance.tooltip?.getActiveElements();
        if (activeElements && activeElements.length > 0) {
          const activePoint = activeElements[0];
          const ctx = chartInstance.ctx;
          const x = activePoint.element.x;
          const topY = chartInstance.scales.y.top;
          const bottomY = chartInstance.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = isDarkMode() ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.16)';
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.restore();
        }
      },
    };

    const locale = getLocale();
    const config: ChartConfiguration = {
      type: type as any,
      data: processedData,
      plugins: [verticalLinePlugin, ...plugins],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 600,
          easing: 'easeOutQuart',
        },
        scales:
          type === 'doughnut' || type === 'pie'
            ? undefined
            : {
                x: {
                  grid: { display: false },
                  ticks: {
                    color: textColor,
                    font: { size: 11 },
                    autoSkip: true,
                    maxRotation: 0,
                  },
                },
                y: {
                  grid: {
                    color: gridColor,
                    drawTicks: false,
                  },
                  border: {
                    dash: [4, 4],
                    display: false,
                  },
                  ticks: {
                    color: textColor,
                    font: { size: 11 },
                    callback: (value: any) => {
                      if (typeof value === 'number' && value >= 1000) return `${value / 1000}k`;
                      return value;
                    },
                  },
                },
              },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: surfaceBg,
            titleColor: inkColor,
            bodyColor: inkColor,
            borderColor,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            displayColors: true,
            usePointStyle: true,
            boxWidth: 6,
            boxHeight: 6,
            boxPadding: 5,
            callbacks: {
              label: (context: any) => {
                let lbl = context.dataset.label || '';
                if (lbl) lbl += ': ';
                if (context.parsed.y !== null && context.parsed.y !== undefined) {
                  lbl += context.parsed.y.toLocaleString(locale);
                }
                return lbl;
              },
            },
          },
        },
        ...options,
      },
    };

    chart = new Chart(canvas, config);
  }

  $effect(() => {
    if (data && chart) {
      chart.data = prepareData(data);
      chart.update();
    }
  });

  onMount(() => {
    initChart();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
          initChart();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onScheme = () => initChart();
    mq?.addEventListener?.('change', onScheme);

    return () => {
      observer.disconnect();
      mq?.removeEventListener?.('change', onScheme);
    };
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div bind:this={container} class="chart-container" style="height: {height}px; width: {width ? width + 'px' : '100%'}">
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>
{#if table.rows.length > 0}
  <div class="sr-only">
    <table>
      <caption>{label || headingLabel || msgs.anx_chart_caption()}</caption>
      <thead>
        <tr>
          <th scope="col">{msgs.anx_chart_label_col()}</th>
          {#each table.series as serie, i (i)}<th scope="col">{serie}</th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each table.rows as row, r (r)}
          <tr>
            <th scope="row">{row.label}</th>
            {#each row.values as value, i (i)}<td>{value}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .chart-container {
    position: relative;
    width: 100%;
  }
</style>
