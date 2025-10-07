<!-- WeekdaysDisplay.vue -->
<template>
	<div class="d-flex flex-wrap ga-2">
		<template v-if="label">
			<VChip density="compact" color="primary" text-color="white" variant="flat">
				{{ label }}
			</VChip>
		</template>
		<template v-else>
			<VChip
				v-for="day in allWeekdays"
				:key="day"
				color="primary"
				class="text-caption"
				density="compact"
				:variant="selectedDays.includes(day.value) ? 'flat' : 'outlined'"
			>
				{{ day.title }}
			</VChip>
		</template>
	</div>
</template>

<script setup>
	import { computed } from "vue";
	import dayjs from "@/plugins/dayjs";

	const props = defineProps({
		selectedDays: {
			type: Array,
			default: () => [],
		},
	});

	const allWeekdays = computed(function () {
		const days = [];
		for (let i = 0; i < 7; i++) {
			const day = dayjs()
				.day(i + 1)
				.format("dddd");
			days.push({
				title: day,
				value: day.toLocaleLowerCase(),
			});
		}
		return days;
	});

	const weekdays = allWeekdays.value.slice(0, 5).map((d) => d.value);
	const weekends = [allWeekdays.value[5], allWeekdays.value[6]].map((d) => d.value);

	const label = computed(() => {
		const selected = props.selectedDays.map((d) => d.toLowerCase());

		if (selected.length === 7) return "All week";
		if (weekdays.every((d) => selected.includes(d)) && selected.length === 5) return "Weekdays";
		if (weekends.every((d) => selected.includes(d)) && selected.length === 2) return "Weekends";

		return null;
	});
</script>
