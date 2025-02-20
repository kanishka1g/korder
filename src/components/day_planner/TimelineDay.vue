<template>
	<div class="timeline-wrapper">
		<div class="timeline-vertical-line">
			<!-- For illustration, we place an indicator for the "current time" or just a top red line -->
			<div class="timeline-indicator" style="top: 150px"></div>
		</div>

		<div class="timeline-tasks">
			<div v-for="task in tasks" :key="task.id">
				<TimelineTask :task="task" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { defineProps } from "vue";
	import TimelineTask from "@/components/day_planner/TimelineTask.vue";

	const props = defineProps({
		tasks: {
			type: Array,
			default: () => [],
		},
		date: {
			type: String,
			default: "",
		},
	});
</script>

<style scoped>
	.timeline-wrapper {
		position: relative;
		min-height: 600px; /* adjust as needed */
		padding-left: 60px; /* space for the vertical line */
	}

	/* The dotted vertical line down the center */
	.timeline-vertical-line {
		position: absolute;
		top: 0;
		left: 30px;
		width: 2px;
		height: 100%;
		border-left: 2px dashed #666;
	}

	/* An example "current time" marker (red dashed line).
     You could compute its position from real time. */
	.timeline-indicator {
		position: absolute;
		left: -2px;
		width: 4px;
		height: 20px;
		border-left: 2px dashed red;
	}

	/* Where tasks are placed (relative to vertical line) */
	.timeline-tasks {
		position: relative;
		margin-left: 60px;
		padding-bottom: 100px;
	}
</style>
