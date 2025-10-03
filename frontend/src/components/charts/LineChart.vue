<template>
	<Line :data="chartData" :options="props.options" />
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
	} from "chart.js";
	import { Line } from "vue-chartjs";
	import { defineProps, computed } from "vue";

	ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({ responsive: true }) },
	});

	const defaultColors = ["#3f51b5", "#e91e63", "#ff9800", "#4caf50", "#2196f3", "#9c27b0", "#00bcd4"];

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));
		copy.datasets = copy.datasets.map((ds, i) => ({
			...ds,
			borderColor: ds.borderColor || defaultColors,
			backgroundColor: ds.backgroundColor || "#ffffff",
			tension: ds.tension ?? 0.4,
		}));
		return copy;
	});
</script>
