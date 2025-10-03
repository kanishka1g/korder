<script setup>
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
	import { Doughnut } from "vue-chartjs";
	import { computed } from "vue";
	import { defaultColors } from "@/utils/helpers";

	ChartJS.register(Title, Tooltip, Legend, ArcElement);

	const props = defineProps({
		data: { type: Object, required: true },
		options: { type: Object, default: () => ({ responsive: true }) },
	});

	const chartData = computed(() => {
		const copy = JSON.parse(JSON.stringify(props.data));
		copy.datasets = copy.datasets.map((ds) => ({
			...ds,
			backgroundColor: ds.backgroundColor || defaultColors,
		}));
		return copy;
	});
</script>

<template>
	<Doughnut :data="chartData" :options="props.options" />
</template>
