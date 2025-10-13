<template>
	<Page title="Health Dashboard" :error="error" variant="dashboard" class="health-dashboard">
		<template #actions>
			<VBtn
				color="primary"
				variant="elevated"
				size="large"
				prepend-icon="fas fa-plus"
				@click="handleQuickAdd"
				class="add-btn"
			>
				<template #prepend>
					<VIcon icon="fas fa-plus" />
				</template>
				Quick Add
			</VBtn>
		</template>

		<div class="dashboard-subtitle mb-8">
			<p class="text-h6 text-medium-emphasis">Track your fitness journey and wellness goals</p>
		</div>

		<!-- Health Stats Overview -->
		<VRow class="mb-6">
			<VCol cols="12" sm="6" md="3">
				<VCard class="modern-stat-card weight-card fill-height" elevation="0">
					<VCardText class="pa-6">
						<div class="d-flex align-center justify-space-between">
							<div>
								<div class="text-h4 font-weight-bold mb-1">{{ latestWeight }}kg</div>
								<div class="text-subtitle-1 text-medium-emphasis">Current Weight</div>
							</div>
							<VIcon icon="fas fa-weight-scale" size="48" color="primary" class="stat-icon" />
						</div>
					</VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" sm="6" md="3">
				<VCard class="modern-stat-card calories-card fill-height" elevation="0">
					<VCardText class="pa-6">
						<div class="d-flex align-center justify-space-between">
							<div>
								<div class="text-h4 font-weight-bold mb-1">{{ avgCalories }}</div>
								<div class="text-subtitle-1 text-medium-emphasis">Avg Calories/Day</div>
							</div>
							<VIcon icon="fas fa-fire" size="48" color="warning" class="stat-icon" />
						</div>
					</VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" sm="6" md="3">
				<VCard class="modern-stat-card workout-card fill-height" elevation="0">
					<VCardText class="pa-6">
						<div class="d-flex align-center justify-space-between">
							<div>
								<div class="text-h4 font-weight-bold mb-1">0</div>
								<div class="text-subtitle-1 text-medium-emphasis">Workouts This Week</div>
							</div>
							<VIcon icon="fas fa-dumbbell" size="48" color="success" class="stat-icon" />
						</div>
					</VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" sm="6" md="3">
				<VCard class="modern-stat-card meals-card fill-height" elevation="0">
					<VCardText class="pa-6">
						<div class="d-flex align-center justify-space-between">
							<div>
								<div class="text-h4 font-weight-bold mb-1">0</div>
								<div class="text-subtitle-1 text-medium-emphasis">Meals Logged</div>
							</div>
							<VIcon icon="fas fa-utensils" size="48" color="info" class="stat-icon" />
						</div>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>

		<!-- Main Content with Tabs -->
		<VCard class="modern-card main-content-card" elevation="0">
			<VTabs v-model="activeTab" color="primary" class="health-tabs" density="comfortable">
				<VTab value="weight" class="tab-item">
					<VIcon icon="fas fa-weight-scale" class="mr-2" />
					Weight Tracking
				</VTab>
				<VTab value="workouts" class="tab-item">
					<VIcon icon="fas fa-dumbbell" class="mr-2" />
					Workouts
				</VTab>
				<VTab value="meals" class="tab-item">
					<VIcon icon="fas fa-utensils" class="mr-2" />
					Meals
				</VTab>
			</VTabs>

			<VTabsWindow v-model="activeTab" class="tabs-content">
				<!-- Weight Tracking Tab -->
				<VTabsWindowItem value="weight">
					<VRow class="pa-6">
						<!-- Weight Chart -->
						<VCol cols="12" lg="8">
							<VCard class="chart-card fill-height" elevation="0" variant="outlined">
								<VCardTitle class="pa-4">
									<div class="d-flex align-center">
										<VIcon icon="fas fa-chart-line" color="primary" class="mr-3" />
										<h4 class="text-h6 font-weight-bold">Weight & Calories Trend</h4>
									</div>
								</VCardTitle>
								<VCardText class="pa-4">
									<LineChart :data="lineChartData" />
								</VCardText>
							</VCard>
						</VCol>

						<!-- Weight Data Table -->
						<VCol cols="12" lg="4">
							<VCard class="data-card" elevation="0" variant="outlined">
								<VCardTitle class="pa-4">
									<div class="d-flex align-center justify-space-between">
										<div class="d-flex align-center">
											<VIcon icon="fas fa-table" color="primary" class="mr-3" />
											<h4 class="text-h6 font-weight-bold">Weight Log</h4>
										</div>
										<VBtn
											color="primary"
											variant="elevated"
											size="small"
											prepend-icon="fas fa-plus"
											@click="handleAdd"
										>
											Add
										</VBtn>
									</div>
								</VCardTitle>
								<VCardText class="pa-4">
									<VSelect
										v-model="filterLocation"
										:items="locations"
										label="Location"
										variant="outlined"
										density="compact"
										class="mb-4"
									/>
									<SelectionTable
										:headers="headers"
										:items="filterWeights"
										hide-active-toggle
										hideAdd
									>
										<template #item.date="{ item }">
											<DisplayDateTime :value="item.date" date-only />
										</template>
										<template #actions="{ item }">
											<div class="d-flex gap-1">
												<VBtn
													icon="fas fa-pencil"
													color="primary"
													size="small"
													variant="text"
													@click="handleEdit(item)"
												/>
												<VBtn
													icon="fas fa-trash"
													color="error"
													size="small"
													variant="text"
													@click="handleDelete(item)"
												/>
											</div>
										</template>
									</SelectionTable>
								</VCardText>
							</VCard>
						</VCol>
					</VRow>
				</VTabsWindowItem>

				<!-- Workouts Tab -->
				<VTabsWindowItem value="workouts">
					<div class="pa-6">
						<VCard class="coming-soon-card" elevation="0" variant="tonal" color="success">
							<VCardText class="pa-8 text-center">
								<VIcon icon="fas fa-dumbbell" size="80" color="success" class="mb-4" />
								<h3 class="text-h4 font-weight-bold mb-4">Workout Tracking</h3>
								<p class="text-h6 text-medium-emphasis mb-4">
									Track your exercises, sets, reps, and progress
								</p>
								<div class="d-flex flex-wrap justify-center gap-4 mb-6">
									<VChip color="success" variant="outlined" size="large">
										<VIcon icon="fas fa-stopwatch" class="mr-2" />
										Duration Tracking
									</VChip>
									<VChip color="success" variant="outlined" size="large">
										<VIcon icon="fas fa-chart-bar" class="mr-2" />
										Progress Analytics
									</VChip>
									<VChip color="success" variant="outlined" size="large">
										<VIcon icon="fas fa-trophy" class="mr-2" />
										Achievement Goals
									</VChip>
								</div>
								<VBtn
									color="success"
									variant="elevated"
									size="large"
									prepend-icon="fas fa-plus"
									disabled
								>
									Coming Soon
								</VBtn>
							</VCardText>
						</VCard>
					</div>
				</VTabsWindowItem>

				<!-- Meals Tab -->
				<VTabsWindowItem value="meals">
					<div class="pa-6">
						<VCard class="coming-soon-card" elevation="0" variant="tonal" color="info">
							<VCardText class="pa-8 text-center">
								<VIcon icon="fas fa-utensils" size="80" color="info" class="mb-4" />
								<h3 class="text-h4 font-weight-bold mb-4">Meal Planning</h3>
								<p class="text-h6 text-medium-emphasis mb-4">
									Plan your meals, track nutrition, and monitor calorie intake
								</p>
								<div class="d-flex flex-wrap justify-center gap-4 mb-6">
									<VChip color="info" variant="outlined" size="large">
										<VIcon icon="fas fa-apple-alt" class="mr-2" />
										Nutrition Tracking
									</VChip>
									<VChip color="info" variant="outlined" size="large">
										<VIcon icon="fas fa-calendar-alt" class="mr-2" />
										Meal Planning
									</VChip>
									<VChip color="info" variant="outlined" size="large">
										<VIcon icon="fas fa-calculator" class="mr-2" />
										Calorie Counter
									</VChip>
								</div>
								<VBtn color="info" variant="elevated" size="large" prepend-icon="fas fa-plus" disabled>
									Coming Soon
								</VBtn>
							</VCardText>
						</VCard>
					</div>
				</VTabsWindowItem>
			</VTabsWindow>
		</VCard>
		<!-- Modern Weight Modal -->
		<Modal
			v-model="weightModal.show"
			:title="`${weightModal.action} Weight Entry`"
			:icon="weightModal.action === 'Add' ? 'fas fa-plus-circle' : 'fas fa-edit'"
			icon-color="primary"
			max-width="500"
			persistent
			show-default-actions
			:confirm-text="`${weightModal.action} Entry`"
			confirm-icon="fas fa-save"
			@confirm="handleConfirm"
			@cancel="weightModal.show = false"
		>
			<VForm ref="weightForm">
				<VRow>
					<VCol cols="12">
						<VSelect
							v-model="weightModal.form.location"
							:items="locations"
							label="Location"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="fas fa-map-marker-alt"
							:disabled="weightModal.action === 'Edit'"
							class="mb-4"
						/>
					</VCol>
				</VRow>

				<VRow>
					<VCol cols="12">
						<DateField
							v-model="weightModal.form.date"
							label="Date"
							variant="outlined"
							density="comfortable"
							past-only
							class="mb-4"
						/>
					</VCol>
				</VRow>

				<VRow>
					<VCol cols="12" sm="6">
						<VTextField
							v-model="weightModal.form.weight"
							label="Weight (kg)"
							type="number"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="fas fa-weight-scale"
							:rules="weightRules"
							class="mb-4"
						/>
					</VCol>
					<VCol cols="12" sm="6">
						<VTextField
							v-model="weightModal.form.burnedCalories"
							label="Burned Calories"
							type="number"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="fas fa-fire"
							:rules="calorieRules"
							class="mb-4"
						/>
					</VCol>
				</VRow>
			</VForm>
		</Modal>
	</Page>
</template>

<script setup>
    import { computed, ref } from "vue";
    import { useTheme } from "vuetify";
    import { useNow } from "@/utils/now";
    import dayjs from "@/plugins/dayjs";
    import request from "@/utils/request";
    import { useLogger } from "@/utils/useLogger";
    import { useLoading } from "@/utils/loading";
    import { snackbar, confirmation } from "@/utils/generic_modals";
    import { displayLongMonthDayFormat } from "@/utils/time";

    import LineChart from "@/components/charts/LineChart.vue";
    import DateField from "@/components/common/DateField.vue";
    import SelectionTable from "@/components/common/SelectionTable.vue";
    import DisplayDateTime from "@/components/common/DisplayDateTime.vue";
    import Page from "@/components/global/Page.vue";

    const now = useNow();
    const theme = useTheme();

    const headers = [
    	{ title: "Date", key: "date" },
    	{ title: "Weight", key: "weight" },
    	{ title: "Burned Calories", key: "burnedCalories" },
    	{ title: "", key: "action" },
    ];

    const weightRules = [
    	(v) => !!v || "Weight is required",
    	(v) => v > 50 || "Weight must be greater than 50",
    	(v) => v < 100 || "Weight must be less than 100",
    ];

    const calorieRules = [
    	(v) => !!v || "Calorie is required",
    	(v) => v > 150 || "Calorie must be greater than 0",
    	(v) => v < 1000 || "Calorie must be less than 1000",
    ];

    const locations = ["home", "gym"];

    const error = ref();
    const activeTab = ref("weight");
    const weightModal = ref({
    	show: false,
    	action: "Add",
    	form: weightObject(),
    });
    const weightForm = ref(null);
    const weights = ref([]);
    const filterLocation = ref("home");

    const filterWeights = computed(() => {
    	return weights.value.filter((w) => w.location === filterLocation.value);
    });

    const latestWeight = computed(() => {
    	if (weights.value.length === 0) return 0;
    	const sortedWeights = [...weights.value].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
    	return sortedWeights[0]?.weight || 0;
    });

    const avgCalories = computed(() => {
    	if (weights.value.length === 0) return 0;
    	const total = weights.value.reduce((sum, w) => sum + (w.burnedCalories || 0), 0);
    	return Math.round(total / weights.value.length);
    });

 const lineChartData = computed(() => {
	const sortedWeights = [...weights.value].sort((a, b) =>
		dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
	);

	// Group data by week (using ISO week for consistency)
	const weeklyData = {};
	for (const w of sortedWeights) {
		const weekKey = dayjs(w.date).isoWeek(); // e.g. 41, 42, 43
		const year = dayjs(w.date).year(); // handle year crossover
		const key = `${year}-W${weekKey}`;

		if (!weeklyData[key]) {
			weeklyData[key] = { weights: [], calories: [] };
		}

		weeklyData[key].weights.push(w.weight);
		weeklyData[key].calories.push(w.burnedCalories);
	}

	// Calculate weekly averages
	const weeklyAverages = Object.entries(weeklyData).map(([key, values]) => {
		const avgWeight =
			values.weights.reduce((a, b) => a + b, 0) / values.weights.length;
		const avgCalories =
			values.calories.reduce((a, b) => a + b, 0) / values.calories.length;

		// Use the first date of the week for the label
		const [year, weekNum] = key.split("-W");
		const weekStart = dayjs().year(Number(year)).isoWeek(Number(weekNum)).startOf("week");

		return {
			label: weekStart.format("MMM D"), // e.g. "Oct 7"
			avgWeight,
			avgCalories,
		};
	});

	// Sort by week order (in case of year crossover)
	weeklyAverages.sort(
		(a, b) => dayjs(a.label, "MMM D").valueOf() - dayjs(b.label, "MMM D").valueOf()
	);

	// Get actual theme colors
	const colors = theme.global.current.value.colors;

	return {
		labels: weeklyAverages.map((x) => x.label),
		datasets: [
			{
				label: "Avg Weight (kg)",
				data: weeklyAverages.map((x) => x.avgWeight),
				yAxisID: "y",
				borderColor: colors.primary,
				backgroundColor: colors.primary + "20",
				tension: 0.4,
				fill: true,
			},
			{
				label: "Avg Burned Calories",
				data: weeklyAverages.map((x) => x.avgCalories),
				yAxisID: "y1",
				borderColor: colors.warning,
				backgroundColor: colors.warning + "20",
				tension: 0.4,
				fill: true,
			},
		],
	};
});

    function handleAdd() {
    	weightModal.value.form = weightObject();
    	weightModal.value.form.location = filterLocation.value;
    	weightModal.value.action = "Add";
    	weightModal.value.show = true;
    }

    function handleEdit(item) {
    	weightModal.value.form = {
    		_id: item._id,
    		location: item.location,
    		date: dayjs(item.date),
    		weight: item.weight.toString(),
    		burnedCalories: item.burnedCalories.toString(),
    	};
    	weightModal.value.action = "Edit";
    	weightModal.value.show = true;
    }

    async function handleDelete(item) {
    	const confirmed = await confirmation("Delete", "Are you sure you want to delete this item?", true);

    	if (!confirmed) {
    		return;
    	}

    	const res = await request.delete(`weights/${item._id}`);

    	snackbar.success(res.data.message);
    	reload();
    }

    async function handleConfirm() {
    	const { valid } = await weightForm.value.validate();
    	if (!valid) {
    		snackbar.warning("Please fix the highlighted fields.");
    		return;
    	}

    	if (
    		weights.value.some(
    			(w) => w.date.isSame(weightModal.value.form.date, "day") && w._id !== weightModal.value.form._id,
    		)
    	) {
    		snackbar.warning("You have already logged weight for this date.");
    		return;
    	}

    	if (weightModal.value.action === "Add") {
    		const res = await request.post("weights", {
    			date: weightModal.value.form.date,
    			weight: weightModal.value.form.weight,
    			burnedCalories: weightModal.value.form.burnedCalories,
    			location: weightModal.value.form.location,
    		});

    		snackbar.success("successfully added");
    	} else if (weightModal.value.action === "Edit") {
    		const res = await request.put(`weights/${weightModal.value.form._id}`, {
    			date: weightModal.value.form.date,
    			weight: weightModal.value.form.weight,
    			burnedCalories: weightModal.value.form.burnedCalories,
    			location: weightModal.value.form.location,
    		});

    		snackbar.success("Weight edited successfully");
    	}

    	reload();
    	weightModal.value.show = false;
    }

    async function reload() {
    	try {
    		// TODO: load meal plan
    		const [weightsResponse] = await Promise.all([request.get("weights")]);

    		weights.value = weightsResponse.data;
    	} catch (e) {
    		error.value = e;
    	}
    }

    reload();

    function handleQuickAdd() {
    	// Quick add based on active tab
    	if (activeTab.value === "weight") {
    		handleAdd();
    	} else if (activeTab.value === "workouts") {
    		// TODO: Implement workout quick add
    		console.log("Quick add workout");
    	} else if (activeTab.value === "meals") {
    		// TODO: Implement meal quick add
    		console.log("Quick add meal");
    	}
    }

    function weightObject() {
    	return {
    		location: "home",
    		date: now.value,
    		weight: null,
    		burnedCalories: null,
    	};
    }
</script>
<style scoped lang="scss">
.health-dashboard {
	// Dashboard-specific styles (background handled by Page component)
}

.dashboard-subtitle {
	text-align: left;
}

.add-btn {
	border-radius: 12px;
	text-transform: none;
	font-weight: 600;
	box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
	}
}

.modern-stat-card {
	border-radius: 16px;
	background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.95) 0%, rgba(var(--v-theme-surface), 0.8) 100%);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(var(--v-border-color), 0.12);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
	}

	.stat-icon {
		opacity: 0.8;
		transition: all 0.3s ease;
	}

	&:hover .stat-icon {
		opacity: 1;
		transform: scale(1.1);
	}

	&.weight-card:hover {
		border-color: rgba(var(--v-theme-primary), 0.3);
	}

	&.calories-card:hover {
		border-color: rgba(var(--v-theme-warning), 0.3);
	}

	&.workout-card:hover {
		border-color: rgba(var(--v-theme-success), 0.3);
	}

	&.meals-card:hover {
		border-color: rgba(var(--v-theme-info), 0.3);
	}
}

.modern-card {
	border-radius: 20px;
	background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.95) 0%, rgba(var(--v-theme-surface), 0.8) 100%);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(var(--v-border-color), 0.12);
	overflow: hidden;

	&.main-content-card {
		min-height: 600px;
	}
}

.health-tabs {
	border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
	background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.5) 0%, rgba(var(--v-theme-surface), 0.2) 100%);

	.tab-item {
		text-transform: none;
		font-weight: 600;
		font-size: 0.95rem;
		min-height: 64px;

		&:hover {
			background: rgba(var(--v-theme-primary), 0.08);
		}
	}

	:deep(.v-tab--selected) {
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-primary), 0.1) 0%,
			rgba(var(--v-theme-primary), 0.05) 100%
		);
		border-bottom: 3px solid rgb(var(--v-theme-primary));
	}
}

.tabs-content {
	min-height: 500px;

	.chart-card,
	.data-card {
		border-radius: 12px;
		background: rgba(var(--v-theme-surface), 0.6);
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		}
	}

	.coming-soon-card {
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.8) 0%,
			rgba(var(--v-theme-surface), 0.6) 100%
		);
		backdrop-filter: blur(15px);

		.v-chip {
			font-weight: 600;

			.v-icon {
				font-size: 1rem;
			}
		}
	}
}

// Theme-specific enhancements (background handled by Page component)
.v-theme--dark {
	.modern-stat-card,
	.modern-card {
		background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
	}

	.health-tabs {
		background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.2) 100%);
	}

	.chart-card,
	.data-card {
		background: rgba(30, 41, 59, 0.6);
	}

	.coming-soon-card {
		background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
	}
}

.v-theme--light {
	.modern-stat-card,
	.modern-card {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
	}

	.health-tabs {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.2) 100%);
	}

	.chart-card,
	.data-card {
		background: rgba(255, 255, 255, 0.6);
	}

	.coming-soon-card {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
	}
}

// Responsive design
@media (max-width: 960px) {
	.dashboard-subtitle {
		text-align: center;
	}

	.health-tabs {
		.tab-item {
			min-height: 56px;
			font-size: 0.875rem;

			.v-icon {
				display: none;
			}
		}
	}
}

@media (max-width: 600px) {
	// Responsive styles now handled by Page component

	.modern-stat-card {
		.stat-icon {
			font-size: 2rem !important;
		}

		.text-h4 {
			font-size: 1.5rem !important;
		}
	}

	.tabs-content {
		.coming-soon-card {
			.v-icon {
				font-size: 3rem !important;
			}

			h3 {
				font-size: 1.5rem !important;
			}

			.d-flex {
				flex-direction: column;

				.v-chip {
					width: 100%;
					justify-content: center;
				}
			}
		}
	}
}

// Animation enhancements
.modern-stat-card,
.chart-card,
.data-card {
	animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// Stagger animation for stat cards
.modern-stat-card {
	&:nth-child(1) {
		animation-delay: 0.1s;
	}
	&:nth-child(2) {
		animation-delay: 0.2s;
	}
	&:nth-child(3) {
		animation-delay: 0.3s;
	}
	&:nth-child(4) {
		animation-delay: 0.4s;
	}
}
</style>
