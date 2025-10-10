<template>
	<VCard class="schedule-overview-card pa-6 rounded-xl fill-height" elevation="8">
		<VCardTitle class="pa-0 mb-6">
			<div class="d-flex align-center justify-space-between">
				<div class="d-flex align-center">
					<VIcon icon="fas fa-calendar-check" color="primary" size="24" class="mr-3" />
					<h3 class="text-h4 font-weight-bold planner-title">Schedule Overview</h3>
				</div>
				<VSelect
					v-model="dayPlanType"
					:items="dayPlanTypes"
					variant="outlined"
					density="compact"
					hide-details
					class="plan-selector"
					style="max-width: 160px"
				/>
			</div>
		</VCardTitle>

		<VCardText class="pa-0">
			<VRow>
				<VCol v-for="(item, index) in filteredItems" :key="item.date" v-bind="colProps">
					<VCard
						class="plan-item-card rounded-xl fill-height"
						:color="defaultColors[index % defaultColors.length]"
						variant="elevated"
						elevation="4"
					>
						<VCardTitle class="pa-4 pb-2">
							<div class="d-flex align-center justify-space-between text-black">
								<div class="text-h5 font-weight-bold">
									{{ item.label }}
								</div>
								<VChip
									color="white"
									variant="elevated"
									size="small"
									class="text-black font-weight-bold"
								>
									{{ item.tasksAndEvents.length }}
								</VChip>
							</div>
						</VCardTitle>

						<VCardText class="pa-4 pt-0">
							<TransitionGroup name="task-fade" tag="div">
								<div
									v-for="(task, i) in limitedTasks(item)"
									:key="task.title + i"
									class="task-item d-flex align-center justify-space-between pa-3 mb-2 rounded-lg"
								>
									<div class="d-flex align-center flex-grow-1">
										<VIcon
											:icon="
												task.source === 'TASK' ? 'fas fa-check-circle' : 'fas fa-calendar-day'
											"
											size="18"
											class="mr-3 task-icon"
											color="black"
										/>
										<div>
											<div class="text-body-1 font-weight-medium text-black">
												{{ task.title }}
											</div>
										</div>
									</div>
									<VChip
										v-if="task.time"
										color="black"
										variant="tonal"
										size="small"
										class="time-chip"
									>
										{{ task.time }}
									</VChip>
								</div>
							</TransitionGroup>

							<div
								v-if="filteredItems.length !== 1 && item.tasksAndEvents.length > 5"
								class="text-center mt-4"
							>
								<VBtn
									@click="item.showAll = !item.showAll"
									variant="text"
									color="white"
									size="small"
									:append-icon="item.showAll ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
									class="expand-btn"
								>
									{{ item?.showAll ? "Show Less" : `Show ${item.tasksAndEvents.length - 5} More` }}
								</VBtn>
							</div>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { parseDate } from "@/utils/time";
	import { defaultColors } from "@/utils/helpers";
	import { useNow } from "@/utils/now";

	const now = useNow();

	const props = defineProps({
		dates: {
			type: Array,
			required: true,
		},
	});

	const dayPlanTypes = [
		{ title: "Today", value: "today" },
		{ title: "Next 7 Days", value: "next_7_days" },
	];

	const dayPlanType = ref("today");

	const filteredItems = computed(() => {
		if (dayPlanType.value === "next_7_days") {
			return props.dates;
		}
		return props.dates.filter((item) => parseDate(item.date).isSame(now.value, "day"));
	});

	const colProps = computed(() => {
		if (filteredItems.value.length === 1) {
			return { cols: 12, sm: 12, md: 12, lg: 12, xl: 12 };
		}
		return { cols: 12, sm: 6, md: 12, lg: 6, xl: 4 };
	});

	function limitedTasks(item) {
		return item?.showAll || filteredItems.value.length === 1
			? item.tasksAndEvents
			: item.tasksAndEvents.slice(0, 5);
	}
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";

	.schedule-overview-card {
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.95) 0%,
			rgba(var(--v-theme-surface), 0.8) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		}
	}

	.planner-title {
		background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.plan-selector {
		:deep(.v-field) {
			border-radius: 12px;
		}
	}

	.plan-item-card {
		transition: all 0.3s ease;
		overflow: hidden;
		position: relative;

		&:hover {
			transform: translateY(-4px) scale(1.02);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
		}

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			pointer-events: none;
		}
	}

	.task-item {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.25);
			transform: translateX(4px);
		}

		&:last-child {
			margin-bottom: 0;
		}
	}

	.task-icon {
		transition: all 0.3s ease;
	}

	.task-item:hover .task-icon {
		transform: scale(1.2);
	}

	.time-chip {
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		font-weight: 600;
		font-size: 0.75rem;
	}

	.expand-btn {
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		font-weight: 600;

		&:hover {
			background: rgba(255, 255, 255, 0.2);
			transform: scale(1.05);
		}
	}

	// Theme-specific enhancements
	.v-theme--dark {
		.schedule-overview-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
		}
	}

	.v-theme--light {
		.schedule-overview-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
		}
	}

	// Animations
	.task-fade-enter-active,
	.task-fade-leave-active {
		transition: all 0.4s ease;
	}

	.task-fade-enter-from {
		opacity: 0;
		transform: translateX(-20px);
	}

	.task-fade-leave-to {
		opacity: 0;
		transform: translateX(20px);
	}

	.task-fade-move {
		transition: transform 0.4s ease;
	}

	// Staggered animation for task items
	.task-item {
		animation: slideInLeft 0.6s ease-out;
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	// Mobile responsiveness
	@media (max-width: 768px) {
		.schedule-overview-card {
			padding: 1rem;
		}

		.planner-title {
			font-size: 1.25rem !important;
		}

		.plan-item-card {
			.text-h5 {
				font-size: 1.1rem !important;
			}
		}

		.task-item {
			padding: 0.75rem;

			.text-body-1 {
				font-size: 0.9rem;
			}
		}

		.plan-selector {
			max-width: 140px !important;
		}
	}

	@media (max-width: 480px) {
		.schedule-overview-card {
			padding: 0.75rem;
		}

		.d-flex.justify-space-between {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.plan-selector {
			align-self: stretch;
			max-width: none !important;
		}
	}
</style>
