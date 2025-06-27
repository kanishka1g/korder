<template>
	<VContainer>
		<VRow>
			<VCol v-for="(day, index) in daysInView" :key="index">
				<VBtn
					:color="selectedDate.isSame(day, 'day') ? 'success' : 'primary'"
					:variant="selectedDate.isSame(day, 'day') ? 'tonal' : 'text'"
					rounded="lg"
					height="60px"
					@click="selectedDate = day"
				>
					{{ day.format(displayLongMonthDayFormat) }}
				</VBtn>
			</VCol>
		</VRow>

		<VTimeline>
			<VTimelineItem v-for="hour in hours" :key="hour" :dot-color="'primary'" side="start">
				<template #opposite>
					{{ hour.title }}
				</template>
				<VCard v-for="task in tasksForHour(hour.value)" :key="task._id">
					<VCardText>
						<VListItem>
							<VListItemTitle>{{ task.title }}</VListItemTitle>
							<VListItemSubtitle>{{ task.description }}</VListItemSubtitle>
						</VListItem>

						<!-- <VBtn class="mt-2" small color="primary" @click="openAddTaskDialog(hour)">
							<VIcon icon="fas fa-plus" class="me-2" />
							Add Task
						</VBtn> -->
					</VCardText>
				</VCard>
			</VTimelineItem>
		</VTimeline>

		<VBtn class="floating-add-btn" color="primary" @click="showAddTaskDialog = true">
			<VIcon icon="fas fa-plus" class="me-2" />
			Add Task
		</VBtn>

		<VDialog v-model="showAddTaskDialog" max-width="500">
			<VCard>
				<VCardTitle> Add New Task </VCardTitle>
				<VCardText>
					<VTextField v-model="newTask.title" label="Task Title" required />
					<VTextField v-model="newTask.description" label="Task Description" />
				</VCardText>
				<VCardActions>
					<VBtn color="primary" @click="addTask">Save</VBtn>
					<VBtn text @click="showAddTaskDialog = false">Cancel</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useTasksStore } from "@/stores/useTaskStore";
	import { useNow } from "@/utils/now";
	import { displayLongMonthDayFormat, displayLongFullDateFormat, parseTime } from "@/utils/time";
	import { rangeArray } from "@/utils/range.js";
	import dayjs from "@/plugins/dayjs";

	import TimelineDay from "@/components/day_planner/TimelineDay.vue";

	const tasksStore = useTasksStore();
	const now = useNow();

	const showAddTaskDialog = ref(false);
	const newTask = ref({
		title: null,
		description: null,
	});

	const hours = rangeArray(24).map((x) => {
		return {
			title: parseTime(x.toString()).toString("time"),
			value: x,
		};
	});
	const hourOptions = hours.map((h) => ({
		title: h === 0 ? "12 AM" : h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`,
		value: h,
	}));

	const formatHour = (hour) =>
		hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;

	function tasksForHour(hour) {
		console.log(tasksStore.tasksForSelectedDate);
		tasksStore.tasksForSelectedDate.filter((task) => task.hour === hour);
	}

	const daysInView = computed(() => {
		const start = now.value.subtract(3, "day");
		return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
	});

	const selectedDate = computed({
		get: () => tasksStore.selectedDate,
		set: (val) => tasksStore.setDate(val),
	});

	function selectDate(date) {
		selectedDate.value = date;
	}

	async function addTask() {
		if (!newTask.value.title) return;
		await tasksStore.addTask({
			title: newTask.value.title,
			date: selectedDate.value,
			description: newTask.value.description,
		});
		newTask.value.title = null;
		newTask.value.description = null;
		showAddTaskDialog.value = false;
	}

	onMounted(() => {
		tasksStore.fetchTasks();
	});
</script>

<style lang="scss" scoped>
	/* Floating Add Button (bottom-right corner) */
	.floating-add-btn {
		position: fixed;
		right: 16px;
		bottom: 16px;
	}
</style>
