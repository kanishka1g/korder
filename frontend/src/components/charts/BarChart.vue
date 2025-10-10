<template>
	<div class="modern-bar-chart">
		<Bar :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
	import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
	import { Bar } from "vue-chartjs";
	import { computed } from "vue";
	import { useTheme } from "vuetify";

	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	const theme = useTheme();

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({}) },
		height: { type: Number, default: 300 },
		showLegend: { type: Boolean, default: true },
		showGrid: { type: Boolean, default: true },
		animated: { type: Boolean, default: true },
		horizontal: { type: Boolean, default: false },
	});

	const isDark = computed(() => theme.global.current.value.dark);

	const modernColors = computed(() => {
		const colors = theme.global.current.value.colors;
		return [colors.primary, colors.secondary, colors.success, colors.warning, colors.error, colors.info];
	});

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));
		copy.datasets = copy.datasets.map((ds, i) => ({
			...ds,
			backgroundColor: ds.backgroundColor || modernColors.value[i % modernColors.value.length],
			borderColor: ds.borderColor || modernColors.value[i % modernColors.value.length],
			borderWidth: ds.borderWidth || 2,
			borderRadius: ds.borderRadius || 8,
			borderSkipped: false,
		}));
		return copy;
	});

	const chartOptions = computed(() => {
		const baseOptions = {
			responsive: true,
			maintainAspectRatio: false,
			indexAxis: props.horizontal ? "y" : "x",
			interaction: {
				intersect: false,
				mode: "index",
			},
			plugins: {
				legend: {
					display: props.showLegend,
					position: "top",
					labels: {
						usePointStyle: true,
						pointStyle: "rect",
						padding: 20,
						font: {
							size: 12,
							weight: "500",
						},
						color: isDark.value ? "#ffffff" : "#1a1a1a",
					},
				},
				tooltip: {
					enabled: true,
					backgroundColor: isDark.value ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
					titleColor: isDark.value ? "#ffffff" : "#1a1a1a",
					bodyColor: isDark.value ? "#ffffff" : "#1a1a1a",
					borderColor: isDark.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
					borderWidth: 1,
					cornerRadius: 12,
					padding: 12,
					displayColors: true,
					usePointStyle: true,
					titleFont: {
						size: 14,
						weight: "600",
					},
					bodyFont: {
						size: 13,
						weight: "500",
					},
				},
			},
			scales: {
				x: {
					display: true,
					grid: {
						display: props.showGrid,
						color: isDark.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
						lineWidth: 1,
					},
					ticks: {
						color: isDark.value ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
						font: {
							size: 11,
							weight: "500",
						},
						padding: 8,
					},
					border: {
						color: isDark.value ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
					},
				},
				y: {
					display: true,
					grid: {
						display: props.showGrid,
						color: isDark.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
						lineWidth: 1,
					},
					ticks: {
						color: isDark.value ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
						font: {
							size: 11,
							weight: "500",
						},
						padding: 8,
					},
					border: {
						color: isDark.value ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
					},
				},
			},
			animation: props.animated
				? {
						duration: 1000,
						easing: "easeInOutQuart",
					}
				: false,
		};

		// Merge with custom options
		return { ...baseOptions, ...props.options };
	});
</script>

<style scoped lang="scss">
	.modern-bar-chart {
		position: relative;
		height: 300px;
		padding: 1rem;
		border-radius: 12px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.8) 0%,
			rgba(var(--v-theme-surface), 0.6) 100%
		);
		backdrop-filter: blur(10px);

		:deep(canvas) {
			border-radius: 8px;
		}
	}

	// Theme-specific styling
	.v-theme--dark {
		.modern-bar-chart {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
		}
	}

	.v-theme--light {
		.modern-bar-chart {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
		}
	}
</style>
