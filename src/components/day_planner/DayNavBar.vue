<template>
	<VRow>
		<VCol v-for="day in weekDays" :key="day.date" class="d-flex flex-column align-center">
			<VBtn
				:color="selectedColour(day.date)"
				variant="tonal"
				rounded="lg"
				height="60px"
				@click="emit('select-day', day.date)"
			>
				<div class="text-body-1 font-weight-bold">{{ day.label }} {{ day.number }}</div>
			</VBtn>
		</VCol>
	</VRow>
</template>

<script setup>
	const props = defineProps({
		weekDays: {
			type: Array,
			default: () => [],
		},
		selectedDate: {
			type: String,
			default: "",
		},
	});

	const emit = defineEmits(["select-day"]);

	function selectedColour(date) {
		return date === props.selectedDate ? "primary" : "";
	}
</script>
