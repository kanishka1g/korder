<template>
	<div class="modern-doughnut-chart">
		<Doughnut :data="chartData" :options="chartOptions" />
		<div v-if="showCenterText" class="center-text">
			<div class="center-value">{{ centerValue }}</div>
			<div class="center-label">{{ centerLabel }}</div>
		</div>
	</div>
</template>

<script setup>
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
	import { Doughnut } from "vue-chartjs";
	import { computed } from "vue";
	import { useTheme } from "vuetify";

	ChartJS.register(Title, Tooltip, Legend, ArcElement);

	const theme = useTheme();

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({}) },
		height: { type: Number, default: 300 },
		showLegend: { type: Boolean, default: true },
		animated: { type: Boolean, default: true },
		showCenterText: { type: Boolean, default: false },
		centerValue: { type: [String, Number], default: "" },
		centerLabel: { type: String, default: "" },
		cutout: { type: [String, Number], default: "60%" },
	});

	const isDark = computed(() => theme.global.current.value.dark);

	const modernColors = computed(() => {
		const colors = theme.global.current.value.colors;
		return [colors.primary, colors.secondary, colors.success, colors.warning, colors.error, colors.info];
	});

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));
		copy.datasets = copy.datasets.map((ds) => ({
			...ds,
			backgroundColor: ds.backgroundColor || modernColors.value,
			borderColor: ds.borderColor || (isDark.value ? "#1e293b" : "#ffffff"),
			borderWidth: ds.borderWidth || 3,
			hoverBorderWidth: ds.hoverBorderWidth || 4,
			hoverOffset: ds.hoverOffset || 8,
		}));
		return copy;
	});

	const chartOptions = computed(() => {
		const baseOptions = {
			responsive: true,
			maintainAspectRatio: false,
			cutout: props.cutout,
			interaction: {
				intersect: false,
			},
			plugins: {
				legend: {
					display: props.showLegend,
					position: "bottom",
					labels: {
						usePointStyle: true,
						pointStyle: "circle",
						padding: 20,
						font: {
							size: 12,
							weight: "500",
						},
						color: isDark.value ? "#ffffff" : "#1a1a1a",
						generateLabels: (chart) => {
							const data = chart.data;
							if (data.labels.length && data.datasets.length) {
								return data.labels.map((label, i) => {
									const dataset = data.datasets[0];
									const backgroundColor = Array.isArray(dataset.backgroundColor)
										? dataset.backgroundColor[i]
										: dataset.backgroundColor;

									return {
										text: label,
										fillStyle: backgroundColor,
										strokeStyle: backgroundColor,
										lineWidth: 0,
										pointStyle: "circle",
										hidden: false,
										index: i,
									};
								});
							}
							return [];
						},
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
					callbacks: {
						label: function (context) {
							const label = context.label || "";
							const value = context.parsed;
							const total = context.dataset.data.reduce((a, b) => a + b, 0);
							const percentage = ((value / total) * 100).toFixed(1);
							return `${label}: ${value} (${percentage}%)`;
						},
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
	.modern-doughnut-chart {
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

		.center-text {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			pointer-events: none;

			.center-value {
				font-size: 2rem;
				font-weight: 700;
				color: rgb(var(--v-theme-primary));
				line-height: 1;
			}

			.center-label {
				font-size: 0.875rem;
				font-weight: 500;
				color: rgba(var(--v-theme-on-surface), 0.7);
				margin-top: 0.25rem;
			}
		}
	}

	// Theme-specific styling
	.v-theme--dark {
		.modern-doughnut-chart {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
		}
	}

	.v-theme--light {
		.modern-doughnut-chart {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
		}
	}
</style>
