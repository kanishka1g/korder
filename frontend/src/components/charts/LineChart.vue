<template>
	<div class="modern-line-chart">
		<Line :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Filler,
	} from "chart.js";
	import { Line } from "vue-chartjs";
	import { computed } from "vue";
	import { useTheme } from "vuetify";

	ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

	const theme = useTheme();

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({}) },
		height: { type: Number, default: 300 },
		showLegend: { type: Boolean, default: true },
		showGrid: { type: Boolean, default: true },
		animated: { type: Boolean, default: true },
	});

	const isDark = computed(() => theme.global.current.value.dark);

	const modernColors = computed(() => {
		const colors = theme.global.current.value.colors;
		return [colors.primary, colors.secondary, colors.success, colors.warning, colors.error, colors.info];
	});

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));
		copy.datasets = copy.datasets.map((ds, i) => {
			// Only apply default colors if no colors are provided
			const defaultColor = modernColors.value[i % modernColors.value.length];

			return {
				...ds,
				// Respect existing colors, only use defaults as fallback
				borderColor: ds.borderColor || defaultColor,
				backgroundColor: ds.backgroundColor || defaultColor + "20",
				tension: ds.tension ?? 0.4,
				borderWidth: ds.borderWidth || 3,
				pointRadius: ds.pointRadius || 6,
				pointHoverRadius: ds.pointHoverRadius || 8,
				pointBackgroundColor: ds.pointBackgroundColor || ds.borderColor || defaultColor,
				pointBorderColor: ds.pointBorderColor || "#ffffff",
				pointBorderWidth: ds.pointBorderWidth || 2,
				fill: ds.fill !== undefined ? ds.fill : false,
			};
		});
		return copy;
	});

	const chartOptions = computed(() => {
		const baseOptions = {
			responsive: true,
			maintainAspectRatio: false,
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
						pointStyle: "circle",
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
							size: window.innerWidth < 768 ? 9 : 11,
							weight: "500",
						},
						padding: window.innerWidth < 768 ? 4 : 8,
						maxTicksLimit: window.innerWidth < 768 ? 6 : 10,
						maxRotation: window.innerWidth < 768 ? 45 : 0,
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
							size: window.innerWidth < 768 ? 9 : 11,
							weight: "500",
						},
						padding: window.innerWidth < 768 ? 4 : 8,
						maxTicksLimit: window.innerWidth < 768 ? 5 : 8,
					},
					border: {
						color: isDark.value ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
					},
				},
				y1: {
					type: "linear",
					display: true,
					position: "right",
					grid: {
						drawOnChartArea: false,
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
	.modern-line-chart {
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

		// Mobile responsiveness
		@media (max-width: 768px) {
			height: 250px;
			padding: 0.75rem;
			border-radius: 8px;
		}

		@media (max-width: 480px) {
			height: 200px;
			padding: 0.5rem;
			border-radius: 6px;
		}
	}

	// Theme-specific styling
	.v-theme--dark {
		.modern-line-chart {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
		}
	}

	.v-theme--light {
		.modern-line-chart {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
		}
	}
</style>
