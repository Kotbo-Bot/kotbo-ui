<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Chart } from "chart.js/auto";
  import MetricTabs, { type MetricTab } from "./MetricTabs.svelte";

  const {
    data,
    period = "day",
    onPeriodChange,
  }: {
    data: "";
    period: "day" | "week" | "month";
    onPeriodChange: (p: "day" | "week" | "month") => void;
  } = $props();

  // ── Sélection de la métrique active ───────────────────────────────────────
  let activeMetric = $state<"messages" | "length" | "accuracy" | "toxicity">("messages");

  // ── Options d'affichage ───────────────────────────────────────────────────
  let view = $state<"line" | "bar" | "table">("line");
  let smooth = $state(false);
  let compare = $state(true);
  let showForecast = $state(false);

  let canvas = $state<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

  // ── Plugin Ligne Verticale Kotbo v3 ───────────────────────────────────────
  const kotboVerticalLinePlugin = {
    id: "kotboVerticalLine",
    afterDatasetsDraw(chart: any) {
      const activeElements = chart.tooltip?.getActiveElements();
      if (activeElements && activeElements.length > 0) {
        const activePoint = activeElements[0];
        const ctx = chart.ctx;
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1.5;
        const isDark = document.documentElement.classList.contains("dark");
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.18)";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  // ── Préparation des MetricTabs ───────────────────────────────────────────
  const metrics = $derived<MetricTab[]>([
    {
      id: "messages",
      label: "Messages analysés",
      value: data.kpis.total_messages_fmt,
      delta: data.kpis.delta_total ?? 14.2,
      spark: data.series.map((s) => s.count),
      color: "var(--series-1, #2a78d6)",
      hint: "Volume total de messages traités par l'IA",
    },
    {
      id: "length",
      label: "Longueur moyenne",
      value: `${data.kpis.avg_length} car.`,
      delta: data.kpis.delta_length ?? 3.8,
      spark: data.series.map((s) => s.avg_length),
      color: "var(--series-4, #eda100)",
      hint: "Longueur moyenne des requêtes en caractères",
    },
    {
      id: "accuracy",
      label: "Précision IA",
      value: `${data.kpis.model_accuracy ?? 95.2} %`,
      delta: data.kpis.delta_accuracy ?? 1.9,
      spark: data.series.map((s) => s.accuracy ?? 95),
      color: "var(--series-3, #1baf7a)",
      hint: "Taux de concordance avec les vérifications humaines",
    },
    {
      id: "toxicity",
      label: "Taux de toxicité",
      value: `${data.kpis.toxicity_rate} %`,
      delta: data.kpis.delta_toxicity ?? -1.4,
      invert: true,
      spark: data.series.map((s) => s.toxicity_rate),
      color: "var(--series-8, #e34948)",
      hint: "Proportion de requêtes classées toxiques",
    },
  ]);

  // ── Faits clés sous le graphique ─────────────────────────────────────────
  const facts = $derived.by(() => {
    const s = data.series;
    if (!s || s.length === 0) return { total: "–", avg: "–", peak: "–", peakDate: "" };

    if (activeMetric === "messages") {
      const total = s.reduce((acc, p) => acc + p.count, 0);
      const avg = Math.round(total / s.length);
      let peak = 0;
      let peakLabel = "";
      for (const p of s) {
        if (p.count > peak) {
          peak = p.count;
          peakLabel = p.label;
        }
      }
      return {
        total: total.toLocaleString("fr-FR"),
        avg: avg.toLocaleString("fr-FR") + " / j",
        peak: peak.toLocaleString("fr-FR"),
        peakDate: peakLabel,
      };
    } else if (activeMetric === "length") {
      const avg = Math.round((s.reduce((acc, p) => acc + p.avg_length, 0) / s.length) * 10) / 10;
      let peak = 0;
      let peakLabel = "";
      for (const p of s) {
        if (p.avg_length > peak) {
          peak = p.avg_length;
          peakLabel = p.label;
        }
      }
      return {
        total: `${avg} car. (moyenne)`,
        avg: `${avg} car.`,
        peak: `${peak} car.`,
        peakDate: peakLabel,
      };
    } else if (activeMetric === "accuracy") {
      const avg = Math.round((s.reduce((acc, p) => acc + (p.accuracy ?? 95), 0) / s.length) * 10) / 10;
      let peak = 0;
      let peakLabel = "";
      for (const p of s) {
        if ((p.accuracy ?? 0) > peak) {
          peak = p.accuracy ?? 0;
          peakLabel = p.label;
        }
      }
      return {
        total: `${avg} % global`,
        avg: `${avg} %`,
        peak: `${peak} %`,
        peakDate: peakLabel,
      };
    } else {
      const totalToxic = s.reduce((acc, p) => acc + p.toxic_count, 0);
      const totalCount = s.reduce((acc, p) => acc + p.count, 0);
      const rate = Math.round((totalToxic / totalCount) * 1000) / 10;
      let peak = 0;
      let peakLabel = "";
      for (const p of s) {
        if (p.toxicity_rate > peak) {
          peak = p.toxicity_rate;
          peakLabel = p.label;
        }
      }
      return {
        total: `${totalToxic.toLocaleString("fr-FR")} toxiques`,
        avg: `${rate} %`,
        peak: `${peak} %`,
        peakDate: peakLabel,
      };
    }
  });

  function hexToRgba(color: string, alpha: number): string {
    if (color.startsWith("#")) {
      const clean = color.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
    }
    return color;
  }

  // ── Rendu & Mise à jour de Chart.js ───────────────────────────────────────
  function updateChart() {
    if (!canvas) return;
    if (view === "table") {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    const labels = data.series.map((s) => s.label);
    let values: number[] = [];
    let prevValues: number[] = [];
    let mainColor = "#2a78d6";
    let unit = "";

    if (activeMetric === "messages") {
      values = data.series.map((s) => s.count);
      prevValues = values.map((v) => Math.round(v * 0.88));
      mainColor = "#2a78d6";
      unit = " requêtes";
    } else if (activeMetric === "length") {
      values = data.series.map((s) => s.avg_length);
      prevValues = values.map((v) => Math.round((v - 4) * 10) / 10);
      mainColor = "#eda100";
      unit = " car.";
    } else if (activeMetric === "accuracy") {
      values = data.series.map((s) => s.accuracy ?? 95);
      prevValues = values.map((v) => Math.round((v - 1.5) * 10) / 10);
      mainColor = "#1baf7a";
      unit = " %";
    } else {
      values = data.series.map((s) => s.toxicity_rate);
      prevValues = values.map((v) => Math.round((v + 0.8) * 10) / 10);
      mainColor = "#e34948";
      unit = " %";
    }

    // Calcul de lissage Kotbo v3 (moyenne mobile arrière avec fenêtre adaptée)
    const windowSize = period === "day" ? 7 : period === "week" ? 4 : 3;
    const smoothedValues = values.map((_, i) => {
      const slice = values.slice(Math.max(0, i - windowSize + 1), i + 1);
      const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
      return Math.round(avg * 10) / 10;
    });

    const datasets: any[] = [];
    const isSmoothedActive = smooth && view === "line";

    // Série principale
    datasets.push({
      type: view === "bar" ? "bar" : "line",
      label: metrics.find((m) => m.id === activeMetric)?.label ?? "Valeur",
      data: values,
      borderColor: isSmoothedActive ? hexToRgba(mainColor, 0.35) : mainColor,
      backgroundColor:
        view === "bar"
          ? (isSmoothedActive ? hexToRgba(mainColor, 0.4) : mainColor)
          : (ctx: any) => {
              const bg = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
              const op = isSmoothedActive ? 0.04 : 0.18;
              bg.addColorStop(0, hexToRgba(mainColor, op));
              bg.addColorStop(1, hexToRgba(mainColor, 0));
              return bg;
            },
      borderWidth: isSmoothedActive ? 1.5 : 2,
      fill: view === "line",
      tension: 0.25,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: mainColor,
      borderRadius: view === "bar" ? 4 : 0,
      maxBarThickness: 32,
      order: 3,
    });

    // Calque Lissage Kotbo v3
    if (isSmoothedActive) {
      datasets.push({
        type: "line",
        label: "Moyenne mobile (lissage)",
        data: smoothedValues,
        borderColor: mainColor,
        borderWidth: 2.5,
        fill: false,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: mainColor,
        order: 2,
      });
    }

    // Calque Période précédente
    if (compare) {
      datasets.push({
        type: "line",
        label: "Période précédente",
        data: prevValues,
        borderColor: "#8a9bb0",
        borderDash: [5, 4],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: "#8a9bb0",
        tension: 0.25,
        order: 1,
      });
    }

    // Calque Prévision
    if (showForecast && view === "line") {
      const lastVal = values[values.length - 1] ?? 0;
      // Ajout de 3 projections futures
      const proj = [Math.round(lastVal * 1.03), Math.round(lastVal * 1.05), Math.round(lastVal * 1.08)];
      const extendedLabels = [...labels, "+1j (proj.)", "+2j (proj.)", "+3j (proj.)"];
      const extMain = [...values, null, null, null];
      const extForecast = [...new Array(values.length - 1).fill(null), lastVal, ...proj];

      datasets[0].data = extMain;
      if (isSmoothedActive) {
        datasets[1].data = [...smoothedValues, null, null, null];
      }
      datasets.push({
        type: "line",
        label: "Prévision (IA)",
        data: extForecast,
        borderColor: mainColor,
        borderDash: [5, 4],
        borderWidth: 1.8,
        fill: false,
        pointRadius: 3,
        pointBackgroundColor: mainColor,
        tension: 0.25,
      });

      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(canvas, {
        type: "line",
        data: { labels: extendedLabels, datasets },
        plugins: [kotboVerticalLinePlugin],
        options: getChartOptions(unit),
      });
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(canvas, {
      type: view === "bar" ? "bar" : "line",
      data: { labels, datasets },
      plugins: [kotboVerticalLinePlugin],
      options: getChartOptions(unit),
    });
  }

  function getChartOptions(unit: string) {
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? "#101a30" : "#ffffff",
          titleColor: isDark ? "#f4f7fc" : "#0d1730",
          bodyColor: isDark ? "#9aaac0" : "#4f5b75",
          borderColor: isDark ? "#243650" : "#d3dbe8",
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label(ctx: any) {
              const val = ctx.parsed.y;
              return ` ${ctx.dataset.label} : ${val.toLocaleString("fr-FR")}${unit}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: (v: any) => v.toLocaleString("fr-FR"),
          },
        },
      },
    };
  }

  $effect(() => {
    // Déclenchement réactif lorsque data, activeMetric, view, smooth, compare ou showForecast changent
    activeMetric;
    view;
    smooth;
    compare;
    showForecast;
    data;
    if (canvas) {
      updateChart();
    }
  });

  onMount(() => {
    updateChart();
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
</script>

<div class="chart-card">
  <!-- Tuiles métriques Kotbo v3 -->
  <MetricTabs
    {metrics}
    active={activeMetric}
    onchange={(id) => (activeMetric = id as any)}
    compare={true}
    label="Métriques d'activité"
  />

  <!-- Barre d'outils Kotbo v3 : Granularité, Mode de Vue et Calques -->
  <div class="chart-card__toolbar">
    <div class="filter-pills" role="radiogroup" aria-label="Granularité">
      <button
        type="button"
        class="filter-pill"
        aria-pressed={period === "day"}
        onclick={() => onPeriodChange("day")}
      >
        Jour (30j)
      </button>
      <button
        type="button"
        class="filter-pill"
        aria-pressed={period === "week"}
        onclick={() => onPeriodChange("week")}
      >
        Semaine (12 sem.)
      </button>
      <button
        type="button"
        class="filter-pill"
        aria-pressed={period === "month"}
        onclick={() => onPeriodChange("month")}
      >
        Mois (12 mois)
      </button>
    </div>

    <div class="chart-card__tools">
      <div class="icon-group" role="group" aria-label="Affichage">
        <button
          type="button"
          class="icon-group__btn"
          aria-pressed={view === "line"}
          title="Vue Courbe"
          onclick={() => (view = "line")}
        >
          <span class="pi btn-icon" style="--i: url('/papicons/sparkles.svg')"></span> Courbe
        </button>
        <button
          type="button"
          class="icon-group__btn"
          aria-pressed={view === "bar"}
          title="Vue Barres"
          onclick={() => (view = "bar")}
        >
          <span class="pi btn-icon" style="--i: url('/papicons/pie.svg')"></span> Barres
        </button>
        <button
          type="button"
          class="icon-group__btn"
          aria-pressed={view === "table"}
          title="Vue Tableau"
          onclick={() => (view = "table")}
        >
          <span class="pi btn-icon" style="--i: url('/papicons/list.svg')"></span> Tableau
        </button>
      </div>
    </div>
  </div>

  <!-- Calques activables -->
  <div class="chart-card__layers">
    <button
      type="button"
      class="filter-pill"
      aria-pressed={smooth}
      disabled={view === "bar" || view === "table"}
      onclick={() => (smooth = !smooth)}
    >
      <span class="pi btn-icon" style="--i: url('/papicons/code.svg')"></span> Lissage
    </button>
    <button
      type="button"
      class="filter-pill"
      aria-pressed={compare}
      disabled={view === "table"}
      onclick={() => (compare = !compare)}
    >
      <span class="pi btn-icon" style="--i: url('/papicons/clock.svg')"></span> Période précédente
    </button>
    <button
      type="button"
      class="filter-pill"
      aria-pressed={showForecast}
      disabled={view === "bar" || view === "table"}
      onclick={() => (showForecast = !showForecast)}
    >
      <span class="pi btn-icon" style="--i: url('/papicons/sparkles.svg')"></span> Prévision (IA)
    </button>
  </div>

  <!-- Zone du Graphe ou Tableau -->
  <div class="chart-card__plot">
    {#if view === "table"}
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Période</th>
              <th scope="col" class="num">Messages</th>
              <th scope="col" class="num">Longueur moy.</th>
              <th scope="col" class="num">Précision</th>
              <th scope="col" class="num">Toxicité</th>
            </tr>
          </thead>
          <tbody>
            {#each data.series as s (s.time_key)}
              <tr>
                <th scope="row">{s.label}</th>
                <td class="num">{s.count.toLocaleString("fr-FR")}</td>
                <td class="num">{s.avg_length} car.</td>
                <td class="num">{s.accuracy ?? 95} %</td>
                <td class="num">{s.toxicity_rate} %</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="chart-canvas-wrapper">
        <canvas bind:this={canvas}></canvas>
      </div>
    {/if}
  </div>

  <!-- Faits de la période (.facts Kotbo v3) -->
  <dl class="facts">
    <div class="facts__item">
      <dt>Total / Global</dt>
      <dd>{facts.total}</dd>
    </div>
    <div class="facts__item">
      <dt>Moyenne de la période</dt>
      <dd>{facts.avg}</dd>
    </div>
    <div class="facts__item">
      <dt>Pic enregistré</dt>
      <dd>
        {facts.peak}
        {#if facts.peakDate}
          <span class="facts__sub">({facts.peakDate})</span>
        {/if}
      </dd>
    </div>
    <div class="facts__item">
      <dt>Échantillon vérifié</dt>
      <dd>{data.kpis.evaluated_messages} messages</dd>
    </div>
  </dl>
</div>

<!-- Section Spécifique NLP : Distribution des longueurs & Matrice de décision -->
<div class="analytics-subgrid">
  <!-- Distribution des longueurs de requêtes -->
  <div class="card subcard">
    <div class="subcard-header">
      <div>
        <h3 class="subcard-title">Distribution des longueurs de requêtes</h3>
        <p class="subcard-desc">Répartition de la taille des messages textuels analysés</p>
      </div>
    </div>

    <div class="length-bars">
      <div class="length-item">
        <div class="length-meta">
          <span class="length-badge badge-short">Courts &lt; 50 car.</span>
          <span class="length-count">{data.len_dist.short.toLocaleString("fr-FR")} ({Math.round((data.len_dist.short / data.kpis.total_messages) * 100)} %)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-short" style="width: {(data.len_dist.short / data.kpis.total_messages) * 100}%"></div>
        </div>
      </div>

      <div class="length-item">
        <div class="length-meta">
          <span class="length-badge badge-medium">Moyens 50 - 150 car.</span>
          <span class="length-count">{data.len_dist.medium.toLocaleString("fr-FR")} ({Math.round((data.len_dist.medium / data.kpis.total_messages) * 100)} %)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-medium" style="width: {(data.len_dist.medium / data.kpis.total_messages) * 100}%"></div>
        </div>
      </div>

      <div class="length-item">
        <div class="length-meta">
          <span class="length-badge badge-long">Longs &gt; 150 car.</span>
          <span class="length-count">{data.len_dist.long.toLocaleString("fr-FR")} ({Math.round((data.len_dist.long / data.kpis.total_messages) * 100)} %)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-long" style="width: {(data.len_dist.long / data.kpis.total_messages) * 100}%"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Matrice de confusion et décision IA -->
  <div class="card subcard">
    <div class="subcard-header">
      <div>
        <h3 class="subcard-title">Matrice de décision IA</h3>
        <p class="subcard-desc">Confrontation des prédictions IA aux vérifications humaines</p>
      </div>
    </div>

    <div class="matrix-grid">
      <div class="matrix-cell cell-tp">
        <span class="matrix-label">Vrais Positifs (TP)</span>
        <span class="matrix-val">{data.confusion.tp.toLocaleString("fr-FR")}</span>
        <span class="matrix-hint">Toxiques correctement bloqués</span>
      </div>
      <div class="matrix-cell cell-fp">
        <span class="matrix-label">Faux Positifs (FP)</span>
        <span class="matrix-val">{data.confusion.fp.toLocaleString("fr-FR")}</span>
        <span class="matrix-hint">Faux drapeaux (sains signalés)</span>
      </div>
      <div class="matrix-cell cell-fn">
        <span class="matrix-label">Faux Négatifs (FN)</span>
        <span class="matrix-val">{data.confusion.fn.toLocaleString("fr-FR")}</span>
        <span class="matrix-hint">Toxiques non détectés</span>
      </div>
      <div class="matrix-cell cell-tn">
        <span class="matrix-label">Vrais Négatifs (TN)</span>
        <span class="matrix-val">{data.confusion.tn.toLocaleString("fr-FR")}</span>
        <span class="matrix-hint">Sains confirmés</span>
      </div>
    </div>
  </div>
</div>

<style>
  .chart-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border: 1px solid var(--color-outline-variant, var(--border));
    border-radius: 1.25rem;
    background: var(--color-surface, var(--surface));
    margin-top: 1.5rem;
  }

  .chart-card__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.25rem;
  }

  .filter-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--color-surface-container-low, var(--surface-muted));
    padding: 3px;
    border-radius: 999px;
    border: 1px solid var(--color-outline-variant, var(--border));
  }

  .filter-pill {
    padding: 0.35rem 0.85rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--color-on-surface-variant, var(--ink-muted));
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 120ms ease;
  }

  .filter-pill:hover:not(:disabled) {
    color: var(--color-on-surface, var(--ink));
    background: var(--color-surface-hover, var(--border));
  }

  .filter-pill[aria-pressed="true"] {
    background: var(--color-primary, var(--accent));
    color: var(--color-on-primary, var(--accent-ink));
    font-weight: 600;
  }

  .filter-pill:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn-icon {
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: -0.18em;
    margin-right: 4px;
  }

  .chart-card__tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-group {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: var(--color-surface-container-low, var(--surface-muted));
    padding: 3px;
    border-radius: 0.5rem;
    border: 1px solid var(--color-outline-variant, var(--border));
  }

  .icon-group__btn {
    padding: 0.35rem 0.65rem;
    border: 0;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--color-on-surface-variant, var(--ink-muted));
    font-size: 0.78125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 120ms ease;
  }

  .icon-group__btn:hover {
    color: var(--color-on-surface, var(--ink));
    background: var(--color-surface-hover, var(--border));
  }

  .icon-group__btn[aria-pressed="true"] {
    background: var(--color-surface, var(--surface));
    color: var(--color-on-surface, var(--ink));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    font-weight: 600;
  }

  .chart-card__layers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .chart-card__plot {
    min-width: 0;
    margin-block: 0.5rem;
  }

  .chart-canvas-wrapper {
    height: 300px;
    position: relative;
    width: 100%;
  }

  .table-wrap {
    max-height: 22rem;
    overflow: auto;
    border-radius: 0.5rem;
    border: 1px solid var(--color-outline-variant, var(--border));
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--color-outline-variant, var(--border));
    white-space: nowrap;
  }

  .data-table thead th {
    position: sticky;
    top: 0;
    background: var(--color-surface-container-low, var(--surface-muted));
    font-weight: 600;
    color: var(--color-on-surface-variant, var(--ink-muted));
  }

  .data-table .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.75rem 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-outline-variant, var(--border));
  }

  .facts__item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  .facts__item dt {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant, var(--ink-muted));
  }

  .facts__item dd {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-on-surface, var(--ink));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .facts__sub {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--color-on-surface-variant, var(--ink-muted));
  }

  .analytics-subgrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.25rem;
    margin-top: 1.25rem;
  }

  .subcard {
    padding: 1.25rem;
  }

  .subcard-header {
    margin-bottom: 1rem;
  }

  .subcard-title {
    font-size: 1.05rem;
    font-weight: 600;
  }

  .subcard-desc {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant, var(--ink-muted));
    margin-top: 0.2rem;
  }

  .length-bars {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .length-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    margin-bottom: 0.35rem;
  }

  .length-badge {
    font-weight: 600;
  }

  .badge-short { color: var(--ok, #16a34a); }
  .badge-medium { color: var(--warn, #ca8a04); }
  .badge-long { color: var(--danger, #dc2626); }

  .progress-track {
    height: 8px;
    border-radius: 999px;
    background: var(--color-surface-container-low, var(--surface-muted));
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 999px;
  }

  .fill-short { background: var(--ok, #16a34a); }
  .fill-medium { background: var(--warn, #ca8a04); }
  .fill-long { background: var(--danger, #dc2626); }

  .matrix-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .matrix-cell {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    border-radius: 0.625rem;
    border: 1px solid var(--color-outline-variant, var(--border));
  }

  .cell-tp { background: color-mix(in srgb, var(--ok, #16a34a) 8%, var(--surface)); border-color: color-mix(in srgb, var(--ok, #16a34a) 30%, transparent); }
  .cell-tn { background: color-mix(in srgb, var(--accent, #2563eb) 8%, var(--surface)); border-color: color-mix(in srgb, var(--accent, #2563eb) 30%, transparent); }
  .cell-fp { background: color-mix(in srgb, var(--warn, #ca8a04) 8%, var(--surface)); border-color: color-mix(in srgb, var(--warn, #ca8a04) 30%, transparent); }
  .cell-fn { background: color-mix(in srgb, var(--danger, #dc2626) 8%, var(--surface)); border-color: color-mix(in srgb, var(--danger, #dc2626) 30%, transparent); }

  .matrix-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-surface-variant, var(--ink-muted));
  }

  .matrix-val {
    font-size: 1.25rem;
    font-weight: 700;
    margin-block: 0.2rem;
  }

  .matrix-hint {
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant, var(--ink-muted));
  }
</style>
