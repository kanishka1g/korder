<template>
	<Bar :data="chartData" :options="props.options" />
</template>

<script setup>
	import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
	import { Bar } from "vue-chartjs";
	import { computed } from "vue";
	import { defaultColors } from "@/utils/helpers";

	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({ responsive: true }) },
	});

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));

		copy.datasets = copy.datasets.map((ds, i) => ({
			...ds,
			backgroundColor: ds.backgroundColor || defaultColors,
		}));
		return copy;
	});
</script>
