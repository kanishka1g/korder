<template>
	<VContainer fluid class="habits-dashboard">
		<div class="dashboard-header mb-8">
			<div class="d-flex align-center justify-space-between">
				<div>
					<h1 class="text-h3 font-weight-bold mb-2 gradient-text">Habits Dashboard</h1>
					<p class="text-h6 text-medium-emphasis">Track your daily habits and build consistency</p>
				</div>
				<VBtn
					color="primary"
					variant="elevated"
					size="large"
					prepend-icon="fas fa-plus"
					@click="handleAdd"
					class="add-habit-btn"
				>
					<template #prepend>
						<VIcon icon="fas fa-plus" />
					</template>
					Add Habit
				</VBtn>
			</div>
		</div>
		<VRow class="mb-6">
			<VCol v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="4">
				<VCard
					class="modern-stat-card"
					:class="`stat-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`"
					elevation="0"
					@click="!stat.hideView && handleViewStats(stat)"
					:style="{ cursor: stat.hideView ? 'default' : 'pointer' }"
				>
					<VCardText class="pa-6">
						<div class="d-flex align-center justify-space-between">
							<div>
								<div class="text-h4 font-weight-bold mb-1">{{ stat.items.length }}</div>
								<div class="text-subtitle-1 text-medium-emphasis">{{ stat.title }}</div>
							</div>
							<VIcon
								:icon="getStatIcon(stat.title)"
								size="48"
								class="stat-icon"
								:color="getStatColor(stat.title)"
							/>
						</div>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>

		<!-- Main Content Grid -->
		<VRow>
			<!-- Today's Habits -->
			<VCol cols="12" lg="6">
				<VCard class="modern-card today-card fill-height" elevation="0">
					<VCardTitle class="pa-6 pb-0">
						<div class="d-flex align-center">
							<VIcon icon="fas fa-calendar-day" color="primary" class="mr-3" />
							<h3 class="text-h5 font-weight-bold">Today's Habits</h3>
						</div>
					</VCardTitle>
					<VCardText class="pa-6">
						<VRow class="mb-4">
							<VCol cols="12" sm="6">
								<DateField v-model="filterDate" past-only show-day />
							</VCol>
						</VRow>

						<div v-if="dayList.length" class="habits-list">
							<div v-for="habit in dayList" :key="habit.id" class="habit-item ">
								<VCard
									class="habit-card"
									:class="{
										'habit-completed': habit.checked,
										'habit-missed': !habit.checked && foundMissedNote(habit),
									}"
									variant="outlined"
								>
									<VCardText class="pa-4">
										<div class="d-flex align-center justify-space-between">
											<VCheckbox
												v-model="habit.checked"
												color="success"
												:label="habit.title"
												hide-details
												density="comfortable"
												:disabled="Boolean(foundMissedNote(habit))"
												@update:model-value="handleDailyCheck(habit)"
												class="habit-checkbox"
											/>
											<VBtn
												v-if="!habit.checked && !foundMissedNote(habit)"
												icon="fas fa-note-sticky"
												size="small"
												variant="text"
												color="warning"
												@click="habit.showMissedNote = true"
											/>
										</div>

										<!-- Missed Note Section -->
										<VExpandTransition>
											<div v-if="habit.showMissedNote" class="mt-3">
												<VTextarea
													v-model="habit.missedNote"
													label="Why did you miss this habit?"
													variant="outlined"
													density="compact"
													rows="2"
													class="mb-3"
												/>
												<div class="d-flex justify-end gap-2">
													<VBtn
														variant="text"
														size="small"
														@click="habit.showMissedNote = false"
													>
														Cancel
													</VBtn>
													<VBtn
														color="success"
														variant="elevated"
														size="small"
														@click="saveMissedNote(habit)"
													>
														Save Note
													</VBtn>
												</div>
											</div>
										</VExpandTransition>

										<!-- Existing Missed Note -->
										<VExpandTransition>
											<div
												v-if="!habit.checked && foundMissedNote(habit) && !habit.showMissedNote"
												class="mt-3"
											>
												<VAlert type="warning" variant="tonal" density="compact" class="mb-2">
													<strong>Note:</strong> {{ foundMissedNote(habit) }}
												</VAlert>
												<div class="d-flex justify-end gap-2">
													<VBtn
														icon="fas fa-pencil"
														size="small"
														variant="text"
														color="primary"
														@click="handleEditNote(habit)"
													/>
													<VBtn
														icon="fas fa-trash"
														size="small"
														variant="text"
														color="error"
														@click="handleRemoveNote(habit)"
													/>
												</div>
											</div>
										</VExpandTransition>
									</VCardText>
								</VCard>
							</div>
						</div>

						<VCard v-else variant="tonal" color="info" class="text-center pa-6">
							<VIcon icon="fas fa-calendar-plus" size="48" color="info" class="mb-3" />
							<div class="text-h6 mb-2">No habits for today</div>
							<div class="text-body-2 text-medium-emphasis">
								Change the date or add a new habit to get started
							</div>
						</VCard>
					</VCardText>
				</VCard>
			</VCol>

			<!-- Active Habits -->
			<VCol cols="12" lg="6">
				<VCard class="modern-card habits-table-card fill-height" elevation="0">
					<VCardTitle class="pa-6 pb-0">
						<div class="d-flex align-center justify-space-between">
							<div class="d-flex align-center">
								<VIcon icon="fas fa-list-check" color="primary" class="mr-3" />
								<h3 class="text-h5 font-weight-bold">Active Habits</h3>
							</div>
							<VChip :color="showArchived ? 'warning' : 'success'" variant="tonal" size="small">
								{{ showArchived ? "Archived" : "Active" }}
							</VChip>
						</div>
					</VCardTitle>
					<VCardText class="pa-6">
						<SelectionTable
							v-model:active="showArchived"
							:headers="headers"
							:items="filteredHabits"
							active-label="Show Archived"
							@add="handleAdd"
							searchable
						>
							<template #item.startDate="{ item }">
								<DisplayDateTime :value="item.startDate" date-only />
							</template>
							<template #item.endDate="{ item }">
								<DisplayDateTime :value="item.endDate" date-only />
							</template>
							<template #actions="{ item }">
								<div class="d-flex gap-1">
									<VBtn
										icon="fas fa-eye"
										size="small"
										variant="text"
										color="info"
										@click="handleView(item)"
									/>
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

		<!-- Bad Data Section -->
		<VRow v-if="badData.length" class="mt-6">
			<VCol cols="12">
				<VCard class="modern-card" elevation="0">
					<VCardTitle class="pa-6 pb-0">
						<div class="d-flex align-center">
							<VIcon icon="fas fa-exclamation-triangle" color="error" class="mr-3" />
							<h3 class="text-h5 font-weight-bold">Data Issues</h3>
						</div>
					</VCardTitle>
					<VCardText class="pa-6">
						<SelectionTable :headers="badDataHeaders" :items="badData">
							<template #actions="{ item }">
								<VBtn
									icon="fas fa-trash"
									color="error"
									size="small"
									variant="text"
									@click="handleDeleteBadData(item)"
								/>
							</template>
						</SelectionTable>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</VContainer>
	<!-- Modern Habit Modal -->
	<Modal
		v-model="habitModal.show"
		:title="`${habitModal.action} Habit`"
		:icon="habitModal.action === 'Add' ? 'fas fa-plus-circle' : 'fas fa-edit'"
		icon-color="primary"
		max-width="600"
		persistent
		show-default-actions
		:confirm-text="`${habitModal.action} Habit`"
		confirm-icon="fas fa-save"
		@confirm="handleConfirm"
		@cancel="habitModal.show = false"
	>
		<VForm ref="habitForm">
			<VRow>
				<VCol cols="12">
					<VTextField
						v-model="habitModal.data.title"
						label="Habit Title"
						variant="outlined"
						density="comfortable"
						prepend-inner-icon="fas fa-tag"
						required
						class="mb-4"
					/>
				</VCol>
			</VRow>

			<VRow>
				<VCol cols="12" md="6">
					<DateField
						v-model="habitModal.data.startDate"
						label="Start Date"
						variant="outlined"
						density="comfortable"
						required
					/>
				</VCol>
				<VCol cols="12" md="6">
					<DateField
						v-model="habitModal.data.endDate"
						label="End Date"
						variant="outlined"
						density="comfortable"
						required
						:min-date="habitModal.data.startDate"
					/>
				</VCol>
			</VRow>

			<VCard class="weekdays-card mt-4" variant="outlined" elevation="0">
				<VCardTitle class="pa-4">
					<div class="d-flex align-center">
						<VIcon icon="fas fa-calendar-week" color="primary" class="mr-3" />
						<h4 class="text-h6 font-weight-bold">Check-in Days</h4>
					</div>
				</VCardTitle>
				<VCardText class="pa-4">
					<VRow>
						<VCol v-for="day in weekdays" :key="day.value" cols="6" sm="4" md="3">
							<VCheckbox
								:model-value="habitModal.data.weekdays.includes(day.value)"
								:label="day.title"
								color="primary"
								hide-details
								density="comfortable"
								class="weekday-checkbox"
								@update:model-value="handleAddWeekday(day.value)"
							/>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
		</VForm>
	</Modal>
	<!-- Modern View Modal -->
	<Modal
		v-model="viewModal.show"
		:title="viewModal.habit.title"
		icon="fas fa-eye"
		icon-color="info"
		max-width="700"
		variant="info"
		show-default-actions
		:show-cancel-button="false"
		confirm-text="Close"
		confirm-color="primary"
		@confirm="viewModal.show = false"
	>
		<!-- Habit Details -->
		<VCard class="habit-details-card mb-4" variant="outlined" elevation="0">
			<VCardText class="pa-4">
				<VRow dense>
					<VCol cols="12" sm="6">
						<div class="detail-item">
							<VIcon icon="fas fa-calendar-alt" color="primary" size="16" class="mr-2" />
							<span class="text-subtitle-2 text-medium-emphasis">Date Range:</span>
						</div>
						<div class="ml-6 mt-1">
							<DisplayDateTime :value="viewModal.habit.startDate" date-only />
							<span class="mx-2">to</span>
							<DisplayDateTime :value="viewModal.habit.endDate" date-only />
						</div>
					</VCol>
					<VCol cols="12" sm="6">
						<div class="detail-item">
							<VIcon icon="fas fa-calendar-week" color="primary" size="16" class="mr-2" />
							<span class="text-subtitle-2 text-medium-emphasis">Check-in Days:</span>
						</div>
						<div class="ml-6 mt-1">
							<DisplayWeekdays :selected-days="viewModal.habit.weekdays" />
						</div>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>

		<!-- Progress Summary -->
		<VCard v-if="viewModal.habit.checkIns.length" class="progress-card mb-4" variant="tonal" color="info">
			<VCardText class="pa-4">
				<div class="d-flex align-center justify-space-between">
					<div class="d-flex align-center">
						<VIcon icon="fas fa-chart-pie" color="info" class="mr-3" />
						<span class="text-h6 font-weight-bold">Progress Summary</span>
					</div>
					<VChip
						:color="viewModal.habit.checkIns.filter((c) => !c.checked).length === 0 ? 'success' : 'warning'"
						variant="elevated"
					>
						{{ viewModal.habit.checkIns.filter((c) => c.checked).length }}/{{
							viewModal.habit.checkIns.length
						}}
						completed
					</VChip>
				</div>
			</VCardText>
		</VCard>

		<!-- Check-ins History -->
		<VCard class="checkins-card" variant="outlined" elevation="0">
			<VCardTitle class="pa-4">
				<div class="d-flex align-center">
					<VIcon icon="fas fa-history" color="primary" class="mr-3" />
					<h4 class="text-h6 font-weight-bold">Check-ins History</h4>
				</div>
			</VCardTitle>
			<VCardText class="pa-0">
				<div v-if="viewModal.habit.checkIns.length" class="checkins-list">
					<div
						v-for="check in viewModal.habit.checkIns.sort((a, b) => b.date - a.date)"
						:key="check.id"
						class="checkin-item pa-4"
						:class="{ 'checkin-completed': check.checked, 'checkin-missed': !check.checked }"
					>
						<div class="d-flex align-center justify-space-between">
							<div class="d-flex align-center">
								<VIcon
									:icon="check.checked ? 'fas fa-check-circle' : 'fas fa-times-circle'"
									:color="check.checked ? 'success' : 'error'"
									class="mr-3"
								/>
								<div>
									<div class="text-subtitle-1 font-weight-medium">
										{{ dayjs(check.date).format("dddd, DD-MMM YYYY") }}
									</div>
									<div v-if="check.missedNote" class="text-caption text-warning mt-1">
										<VIcon icon="fas fa-sticky-note" size="12" class="mr-1" />
										{{ check.missedNote }}
									</div>
								</div>
							</div>
							<VChip :color="check.checked ? 'success' : 'error'" size="small" variant="tonal">
								{{ check.checked ? "Completed" : "Missed" }}
							</VChip>
						</div>
						<VDivider class="mt-3" />
					</div>
				</div>
				<div v-else class="pa-8 text-center">
					<VIcon icon="fas fa-calendar-times" size="48" color="grey" class="mb-3" />
					<div class="text-h6 text-medium-emphasis">No check-ins yet</div>
					<div class="text-body-2 text-medium-emphasis">Start tracking this habit to see your progress</div>
				</div>
			</VCardText>
		</VCard>
	</Modal>
	<!-- Modern Stats Modal -->
	<Modal
		v-model="statsModal.show"
		:title="statsModal.title"
		icon="fas fa-chart-bar"
		icon-color="info"
		max-width="800"
		variant="info"
		show-default-actions
		:show-cancel-button="false"
		confirm-text="Close"
		confirm-color="primary"
		@confirm="statsModal.show = false"
	>
		<SelectionTable :headers="headers" :items="statsModal.items" hide-active-toggle>
			<template #item.startDate="{ item }">
				<DisplayDateTime :value="item.startDate" date-only />
			</template>
			<template #item.endDate="{ item }">
				<DisplayDateTime :value="item.endDate" date-only />
			</template>
			<template #actions="{ item }">
				<div class="d-flex gap-1">
					<VBtn
						icon="fas fa-pencil"
						color="primary"
						size="small"
						variant="text"
						@click="
							handleEdit(item);
							statsModal.show = false;
						"
					/>
					<VBtn icon="fas fa-trash" color="error" size="small" variant="text" @click="handleDelete(item)" />
				</div>
			</template>
		</SelectionTable>
	</Modal>
</template>

<script setup>
	import { ref, computed, watch } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import request from "@/utils/request";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/loading";
	import { snackbar, confirmation } from "@/utils/generic_modals";

	import DateField from "@/components/common/DateField.vue";
	import StatCard from "@/components/common/StatCard.vue";
	import SelectionTable from "@/components/common/SelectionTable.vue";
	import DisplayDateTime from "@/components/common/DisplayDateTime.vue";
	import DisplayWeekdays from "@/components/common/DisplayWeekdays.vue";

	const now = useNow();
	const loading = useLoading();
	const logger = useLogger();

	const headers = [
		{ title: "Title", key: "title" },
		{ title: "Start Date", key: "startDate" },
		{ title: "End Date", key: "endDate" },
	];

	const badDataHeaders = [
		{ title: "Habit", key: "habitTitle" },
		{ title: "Type", key: "type" },
	];

	const error = ref();
	const showArchived = ref(false);
	const filterDate = ref(now.value);
	const habits = ref([]);
	const badData = ref([]);
	const dayList = ref([]);
	const stats = ref([]);
	const habitForm = ref(null);
	const habitModal = ref({
		show: false,
		action: "Add",
		data: habitObject(),
	});
	const viewModal = ref({
		show: false,
		habit: habitObject(),
	});
	const statsModal = ref({
		show: false,
		items: [],
		title: "",
	});

	const filteredHabits = computed(function () {
		if (showArchived.value) {
			return habits.value.filter((habit) => {
				return now.value.isAfter(habit.endDate, "day");
			});
		}
		return habits.value.filter((habit) => {
			return now.value.isBetween(habit.startDate, habit.endDate, "day", "[]");
		});
	});

	const weekdays = computed(function () {
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

	async function reload() {
		try {
			const [badDataResponse, statsResponse, habitsResponse, dayListResponse] = await Promise.all([
				request.get("habits/bad-data"),
				request.get("habits/stats"),
				request.get("habits"),
				request.get(`habits/day-list`, {
					params: { date: filterDate.value },
				}),
			]);

			badData.value = badDataResponse.data;
			stats.value = statsResponse.data;
			habits.value = habitsResponse.data;
			dayList.value = dayListResponse.data.map((item) => {
				item.checked = item.checkIns.some((checkin) => {
					return filterDate.value.isSame(dayjs(checkin.date), "day") && checkin.checked;
				});

				return item;
			});
		} catch (e) {
			error.value = e;
		}
	}

	reload();

	function handleAdd() {
		habitModal.value.data = habitObject();
		habitModal.value.data.weekdays = weekdays.value.map((day) => day.value);
		habitModal.value.action = "Add";
		habitModal.value.show = true;
	}

	function handleEdit(habit) {
		habitModal.value.data = {
			...habit,
			startDate: dayjs(habit.startDate),
			endDate: dayjs(habit.endDate),
		};
		habitModal.value.action = "Edit";
		habitModal.value.show = true;
	}

	function handleAddWeekday(day) {
		if (habitModal.value.data.weekdays.includes(day)) {
			habitModal.value.data.weekdays = habitModal.value.data.weekdays.filter((d) => d !== day);
		} else {
			habitModal.value.data.weekdays.push(day);
		}
	}

	async function handleDelete(habit) {
		const confirmed = await confirmation("Delete", `Are you sure you want to delete ${habit.title}?`, true);

		if (!confirmed) {
			return;
		}

		const res = await request.delete(`habits/${habit._id}`);

		snackbar.success(res.data.message);
		statsModal.value.show = false;
		reload();
	}

	async function saveDailyCheck(habit) {
		loading.start();
		try {
			const res = await request.post(`habits/${habit._id}/check`, {
				habitId: habit._id,
				date: filterDate.value,
				missedNote: habit.missedNote || null,
				checked: habit.checked,
			});

			snackbar.success(res.data.message);
			habit.showMissedNote = false;
			await reload();
		} catch (err) {
			habit.checked = !habit.missedNote && !habit.checked;
			logger.error(err, "handleDailyCheck");
		} finally {
			loading.end();
		}
	}

	async function handleDailyCheck(habit, nullifyNote = false) {
		if (!habit.checked && !habit.missedNote) {
			const confirmed = await confirmation("Confirm", `Are you sure you want to check out of ${habit.title}?`);

			if (!confirmed) {
				habit.checked = true;
				return;
			}
		}

		await saveDailyCheck(habit);
	}

	async function saveMissedNote(habit) {
		if (!habit.missedNote) {
			snackbar.warning("Please enter a note");
			return;
		}

		await saveDailyCheck(habit);
	}

	async function handleRemoveNote(habit) {
		const confirmed = await confirmation(
			"Remove Note",
			`Are you sure you want to remove the missed note for ${habit.title}?`,
			true,
		);

		if (!confirmed) {
			return;
		}

		habit.missedNote = null;

		await saveDailyCheck(habit);
	}

	//TODO: Probably clean up this function
	async function handleConfirm() {
		if (!habitModal.value.data.weekdays.length) {
			return snackbar.warning("Please select at least one weekday");
		}

		const { action, data } = habitModal.value;
		const payload = {
			title: data.title,
			startDate: data.startDate,
			endDate: data.endDate,
			weekdays: data.weekdays,
		};

		const url = action === "Add" ? "habits" : `habits/${data._id}`;
		const method = action === "Add" ? request.post : request.put;

		const res = await method(url, payload);
		snackbar.success(`${res.data.title} ${action.toLowerCase()}ed`);
		reload();
		habitModal.value.show = false;
	}

	function handleView(habit) {
		viewModal.value.habit = habit;
		viewModal.value.show = true;
	}

	function foundMissedNote(habit) {
		return habit.checkIns.find((c) => dayjs(c.date).isSame(filterDate.value, "day"))?.missedNote;
	}

	function handleEditNote(habit) {
		habit.missedNote =
			habit.checkIns.find((c) => dayjs(c.date).isSame(filterDate.value, "day"))?.missedNote || null;
		habit.showMissedNote = true;
	}

	function handleViewStats(stat) {
		statsModal.value.items = stat.items;
		statsModal.value.title = stat.title;
		statsModal.value.show = true;
	}

	async function handleDeleteBadData(item) {
		const confirmed = await confirmation("Delete", `Are you sure you want to delete ${item.habitTitle}?`, true);

		if (!confirmed) {
			return;
		}

		const res = await request.delete(`habits/bad-data/${item.checkedId}`);

		snackbar.success(res.data.message);
		reload();
	}

	function habitObject() {
		return {
			title: null,
			startDate: now.value,
			endDate: now.value.add(7, "day"),
			weekdays: [],
		};
	}

	function getStatIcon(title) {
		const iconMap = {
			Active: "fas fa-play-circle",
			Completed: "fas fa-check-circle",
			Archived: "fas fa-archive",
			Total: "fas fa-chart-line",
		};
		return iconMap[title] || "fas fa-chart-bar";
	}

	function getStatColor(title) {
		const colorMap = {
			Active: "primary",
			Completed: "success",
			Archived: "warning",
			Total: "info",
		};
		return colorMap[title] || "primary";
	}

	watch(filterDate, function (value) {
		if (value) {
			reload();
		} else {
			dayList.value = [];
		}
	});
</script>

<style scoped lang="scss">
	.habits-dashboard {
		min-height: 100vh;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.8) 0%,
			rgba(var(--v-theme-background), 0.9) 100%
		);
	}

	.dashboard-header {
		.gradient-text {
			background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		.add-habit-btn {
			border-radius: 12px;
			text-transform: none;
			font-weight: 600;
			box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
			}
		}
	}

	.modern-stat-card {
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.95) 0%,
			rgba(var(--v-theme-surface), 0.8) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
			border-color: rgba(var(--v-theme-primary), 0.3);
		}

		.stat-icon {
			opacity: 0.8;
			transition: all 0.3s ease;
		}

		&:hover .stat-icon {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.modern-card {
		border-radius: 20px;
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
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
		}
	}

	.today-card {
		.habits-list {
			.habit-item {
				.habit-card {
					border-radius: 12px;
					transition: all 0.3s ease;
					border: 2px solid rgba(var(--v-border-color), 0.12);

					&:hover {
						border-color: rgba(var(--v-theme-primary), 0.3);
						transform: translateX(4px);
					}

					&.habit-completed {
						border-color: rgba(var(--v-theme-success), 0.5);
						background: linear-gradient(
							135deg,
							rgba(var(--v-theme-success), 0.05) 0%,
							rgba(var(--v-theme-success), 0.02) 100%
						);
					}

					&.habit-missed {
						border-color: rgba(var(--v-theme-warning), 0.5);
						background: linear-gradient(
							135deg,
							rgba(var(--v-theme-warning), 0.05) 0%,
							rgba(var(--v-theme-warning), 0.02) 100%
						);
					}

					.habit-checkbox {
						:deep(.v-selection-control__wrapper) {
							.v-selection-control__input {
								.v-icon {
									font-size: 1.5rem;
								}
							}
						}
					}
				}
			}
		}
	}

	.habits-table-card {
		.v-chip {
			font-weight: 600;
		}
	}

	// Theme-specific enhancements
	.v-theme--dark {
		.habits-dashboard {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
		}

		.modern-stat-card,
		.modern-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
		}
	}

	.v-theme--light {
		.habits-dashboard {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);
		}

		.modern-stat-card,
		.modern-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
		}
	}

	// Responsive design
	@media (max-width: 960px) {
		.dashboard-header {
			text-align: center;

			.d-flex {
				flex-direction: column;
				gap: 1rem;
			}
		}
	}

	@media (max-width: 600px) {
		.habits-dashboard {
			.v-container {
				padding: 1rem;
			}
		}

		.dashboard-header {
			h1 {
				font-size: 2rem !important;
			}
		}
	}
</style>

// Modal content specific styles .weekdays-card { border-radius: 12px; background: rgba(var(--v-theme-surface-variant),
0.3); backdrop-filter: blur(10px); transition: all 0.3s ease; &:hover { transform: translateY(-1px); box-shadow: 0 4px
16px rgba(0, 0, 0, 0.1); } .weekday-checkbox { :deep(.v-selection-control__wrapper) { .v-selection-control__input {
.v-icon { font-size: 1.2rem; transition: all 0.3s ease; } } } &:hover .v-selection-control__input .v-icon { transform:
scale(1.1); } } } .habit-details-card { background: rgba(var(--v-theme-info), 0.05); border-color:
rgba(var(--v-theme-info), 0.2); border-radius: 12px; transition: all 0.3s ease; &:hover { transform: translateY(-1px);
box-shadow: 0 4px 16px rgba(var(--v-theme-info), 0.1); } } .progress-card { border-radius: 12px; } .checkins-card {
.check ist { .checkin-item { transition: all 0.3s ease; border-left: 4px solid transparent; &:hover { background:
rgba(var(--v-theme-surface-variant), 0.3); } &.checkin-completed { border-left-color: rgb(var(--v-theme-success));
background: linear-gradient(90deg, rgba(var(--v-theme-success), 0.05) 0%, transparent 100%); } &.checkin-missed {
border-left-color: rgb(var(--v-theme-error)); background: linear-gradient(90deg, rgba(var(--v-theme-error), 0.05) 0%,
transparent 100%); } } } } // Theme-specific modal content styles .v-theme--dark { .weekdays-card { background: rgba(30,
41, 59, 0.6); } } .v-theme--light { .weekdays-card { background: rgba(255, 255, 255, 0.6); } }
