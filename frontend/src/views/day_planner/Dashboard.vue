<template>
	<VContainer fluid>
		<DayNavBar :week-days="weekDays" :selected-date="selectedDate" @select-day="onSelectDay" />
		<TimelineDay :tasks="tasksForSelectedDate" :date="selectedDate" />
	</VContainer>
	<VBtn fab large color="green" style="position: fixed; bottom: 24px; right: 24px" @click="addNewTask">
		<VIcon icon="fas fa-plus"></VIcon>
	</VBtn>
</template>

<script setup>
	import { ref, computed } from "vue";

	import DayNavBar from "@/components/day_planner/DayNavBar.vue";
	import TimelineDay from "@/components/day_planner/TimelineDay.vue";

	const allTasks = ref([
		{
			id: 1,
			date: "2025-02-19",
			startTime: "2025-02-19T17:10",
			endTime: "2025-02-19T17:25",
			title: "Hair/Eye Care",
			icon: "fas fa-umbrella",
			color: "#6ECB63",
			note: "Major strides in 3h 10m?",
			duration: 15,
		},
		{
			id: 2,
			date: "2025-02-19",
			startTime: "2025-02-19T17:30",
			endTime: "2025-02-19T17:45",
			title: "Vac Day",
			icon: "fas fa-umbrella-beach",
			color: "#aeb4bb",
			note: "Need a break of 5 min?",
			duration: 15,
		},
		{
			id: 3,
			date: "2025-02-19",
			startTime: "2025-02-19T20:15",
			endTime: "2025-02-19T21:00",
			title: "Read a book",
			icon: "fas fa-book-open",
			color: "#C78BEE",
			note: "Major strides in 2h 30m?",
			duration: 45,
		},
	]);

	const weekDays = ref([
		{
			label: "Mon",
			number: 17,
			date: "2025-02-17",
			summaryIcons: ["fas fa-book", "fas fa-running", "fas fa-briefcase"],
		},
		{ label: "Tue", number: 18, date: "2025-02-18", summaryIcons: ["fas fa-check", "fas fa-calendar-alt"] },
		{
			label: "Wed",
			number: 19,
			date: "2025-02-19",
			summaryIcons: ["fas fa-shower", "fas fa-book-open", "fas fa-calendar-heart"],
		},
		{ label: "Thu", number: 20, date: "2025-02-20", summaryIcons: ["fas fa-home", "fas fa-yoga"] },
		{ label: "Fri", number: 21, date: "2025-02-21", summaryIcons: ["fas fa-coffee"] },
		{ label: "Sat", number: 22, date: "2025-02-22", summaryIcons: ["fas fa-car", "fas fa-basketball-ball"] },
		{ label: "Sun", number: 23, date: "2025-02-23", summaryIcons: ["fas fa-walking", "fas fa-user"] },
	]);

	// Selected date
	const selectedDate = ref("2025-02-19");

	// Compute tasks just for the selected date
	const tasksForSelectedDate = computed(() => allTasks.value.filter((t) => t.date === selectedDate.value));

	function onSelectDay(newDate) {
		selectedDate.value = newDate;
	}

	// For the FAB
	function addNewTask() {
		console.log('Show "new task" form or dialog here.');
	}
</script>

<!-- We can do local styles or rely on parent layout's dark theme -->
<style scoped>
	/* Just ensuring text is lighter in the dark background */
	.v-main {
		color: #fff;
	}
</style>
