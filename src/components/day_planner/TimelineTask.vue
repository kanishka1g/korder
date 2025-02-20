<template>
	<div class="task-bubble" :style="bubbleStyle">
		<div class="task-icon" :style="{ backgroundColor: task.color || '#ccc' }">
			<VIcon>{{ task.icon || "fas fa-calendar" }}</VIcon>
		</div>

		<div class="task-info">
			<div class="task-time">{{ formattedTimeRange }} ({{ task.duration }} min)</div>
			<div class="task-title">
				{{ task.title }}
			</div>
			<div v-if="task.note" class="task-note">
				{{ task.note }}
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from "vue";
	import { defineProps } from "vue";

	const props = defineProps({
		task: {
			type: Object,
			required: true,
		},
	});

	// Format the start/end times into something like "5:10 PM - 5:25 PM"
	const formattedTimeRange = computed(() => {
		const start = formatTime(props.task.startTime);
		const end = formatTime(props.task.endTime);
		return `${start} – ${end}`;
	});

	function formatTime(isoString) {
		if (!isoString) return "";
		const d = new Date(isoString);
		return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
	}

	// For a rough absolute positioning approach, we map the startTime to "top" style
	// e.g., 1 hour = 100px, so 5:00 pm (17:00) -> 1700 minutes from midnight => 1700 px
	// This is just a quick demonstration. Tweak for your real design.
	const bubbleStyle = computed(() => {
		const start = new Date(props.task.startTime);
		const hour = start.getHours();
		const minute = start.getMinutes();
		const totalMinutes = hour * 60 + minute;

		// example scale: 1 minute = 1.5 px
		const top = totalMinutes * 1.5 * 0.4; // the 0.4 is to reduce scale slightly
		return {
			top: `${top}px`,
		};
	});
</script>

<style scoped>
	.task-bubble {
		position: absolute;
		background-color: #2c2c2c;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
		width: 300px;
		color: #fff;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	/* Icon bubble on the left */
	.task-icon {
		height: 40px;
		width: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		color: #fff;
	}

	/* Task info text */
	.task-info {
		display: flex;
		flex-direction: column;
	}

	.task-time {
		font-size: 0.8rem;
		color: #aaa;
		margin-bottom: 4px;
	}

	.task-title {
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 4px;
	}

	.task-note {
		font-size: 0.8rem;
		color: #6fed84; /* example green highlight for times or notes */
	}
</style>
