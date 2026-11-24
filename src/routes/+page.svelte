<script lang="ts">
	import { Sparkline, MetricTabs } from '#lib';

	const MSimulation = {
		anx_delta_vs_previous: function () {
			return `vs période d'avant`;
		},
        anx_previous_period: function ({ value }: { value: string }) {
			return `Période précédente : ${value}`;
		},
        anx_delta_new: function () { return "nouveau" },
        anx_unit_points: function ({ value }: { value: string }) { return `${value} pts` }
	};
</script>

<Sparkline values={[0, 1, 10, 0.5, 5]} color="#8a9bb0" width={200} height={100} />

<MetricTabs
	metrics={[
		{
			id: 'revenue',
			label: "Chiffre d'affaires",
			value: '148 920 €',
			delta: 12.4,
			invert: false,
			previous: '132 490 €',
			spark: [104, 111, 108, 119, 126, 132, 141, 149],
			color: '#2563eb',
			hint: 'Total HT facturé sur la période sélectionnée.'
		},
		{
			id: 'churn',
			label: 'Taux de désabonnement',
			value: '2,8 %',
			delta: -0.6,
			invert: true,
			previous: '3,4 %',
			spark: [4.1, 3.9, 3.7, 3.8, 3.5, 3.4, 3.1, 2.8],
			color: '#16a34a',
			hint: 'Une baisse est favorable (invert: true).'
		},
		{
			id: 'nps',
			label: 'Score NPS',
			value: '64',
			delta: 5,
			invert: false,
			previous: '59',
			spark: [48, 51, 53, 55, 58, 59, 62, 64],
			color: '#7c3aed',
			hint: 'Mesuré sur les réponses des 30 derniers jours.'
		},
		{
			id: 'latency',
			label: 'Latence moyenne API',
			value: '184 ms',
			delta: 9.2,
			invert: true,
			previous: '168 ms',
			spark: [152, 155, 160, 158, 164, 168, 177, 184],
			color: '#ea580c',
			hint: 'Hausse de latence pénalisante (invert: true).'
		},
		{
			id: 'conversion',
			label: 'Taux de conversion',
			value: '4,15 %',
			delta: null,
			invert: false,
			previous: '4,15 %',
			spark: [4.0, 4.1, 4.2, 4.05, 4.15, 4.12, 4.18, 4.15],
			color: '#0891b2',
			hint: 'Variation non disponible sur ce segment.'
		}
	]}
	active="revenue"
	onchange={(id) => console.log('Onglet actif :', id)}
	compare={true}
	label="Indicateurs de performance"
	interactive={true}
	deltaUnit="pct"
	messages={MSimulation}
/>
