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
				:variant="selectedDays.includes(day.toLowerCase()) ? 'flat' : 'outlined'"
			>
				{{ day }}
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

	const allWeekdays = dayjs.weekdays();

	const weekdays = allWeekdays.slice(1, 6).map((d) => d.toLowerCase());
	const weekends = [allWeekdays[0], allWeekdays[6]].map((d) => d.toLowerCase());

	const label = computed(() => {
		const selected = props.selectedDays.map((d) => d.toLowerCase());

		if (selected.length === 7) return "All week";
		if (weekdays.every((d) => selected.includes(d)) && selected.length === 5) return "Weekdays";
		if (weekends.every((d) => selected.includes(d)) && selected.length === 2) return "Weekends";

		return null;
	});
</script>
