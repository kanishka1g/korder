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
	import { computed } from "vue";
	import { defaultColors } from "@/utils/helpers";

	ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({ responsive: true }) },
	});

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
