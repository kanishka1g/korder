<template>
	<Page title="Habits" :error="error">
		<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
			<VCardText>
				<VRow>
					<VCol v-for="stat in stats" :key="stat.title" cols="12" md="4">
						<StatCard
							:title="stat.title"
							:value="stat.items.length"
							:hide-view="stat.hideView"
							@view="handleViewStats(stat)"
						/>
					</VCol>
				</VRow>
				<VRow>
					<VCol cols="12" md="6" order-md="1" order="2">
						<VCard variant="outlined" class="mt-3">
							<VCardTitle> Active Habits </VCardTitle>
							<VCardText>
								<TableView
									v-model:active="showArchived"
									:headers="headers"
									:items="filteredHabits"
									active-label="Archive"
									@add="handleAdd"
								>
									<template #item.startDate="{ item }">
										<DisplayDateTime :value="parseDateTime(item.startDate)" date-only />
									</template>
									<template #item.endDate="{ item }">
										<DisplayDateTime :value="parseDateTime(item.endDate)" date-only />
									</template>
									<template #actions="{ item }">
										<VBtn
											icon="fa-solid fa-eye"
											size="x-small"
											variant="text"
											@click="handleView(item)"
										/>
										<VBtn
											icon="fa-solid fa-pencil"
											color="primary"
											size="x-small"
											variant="text"
											@click="handleEdit(item)"
										/>
										<VBtn
											icon="fa-solid fa-trash"
											color="error"
											size="x-small"
											variant="text"
											@click="handleDelete(item)"
										/>
									</template>
								</TableView>
							</VCardText>
						</VCard>
					</VCol>
					<VCol cols="12" md="6" order-md="2" order="1">
						<VCard variant="outlined" class="mt-3">
							<VCardTitle> Daily checkin </VCardTitle>
							<VCardText class="pa-3">
								<VRow>
									<VCol cols="6">
										<DateField v-model="filterDate" past-only show-day />
									</VCol>
								</VRow>
								<VRow v-for="habit in dayList" :key="habit.id" dense>
									<VCol>
										<VCheckbox
											v-model="habit.checked"
											color="primary"
											:label="habit.title"
											hide-details
											density="compact"
											:disabled="Boolean(foundMissedNote(habit))"
											@update:model-value="handleDailyCheck(habit)"
										/>
									</VCol>
									<VCol v-if="habit.showMissedNote" cols="12">
										<VTextField
											v-model="habit.missedNote"
											label="Missed Note"
											variant="outlined"
											density="compact"
											hide-details
										>
											<template #append-inner>
												<VBtn
													icon="fas fa-floppy-disk"
													size="small"
													variant="text"
													color="success"
													@click="handleDailyCheck(habit)"
												/>
											</template>
										</VTextField>
									</VCol>
									<!-- TODO: make this note bit nicer -->
									<VCol
										v-else-if="!habit.checked && foundMissedNote(habit)"
										cols="12"
										class="mt-n5 ml-4"
									>
										<span class="text-warning"> Note: </span>
										{{ foundMissedNote(habit) }}
										<VBtn
											icon="fas fa-pencil"
											size="x-small"
											variant="text"
											color="primary"
											@click="handleEditNote(habit)"
										/>
									</VCol>
									<VCol v-else cols="auto">
										<VBtn
											icon="fas fa-note-sticky"
											size="x-small"
											variant="text"
											color="primary"
											@click="habit.showMissedNote = true"
										/>
									</VCol>
								</VRow>
								<VRow v-if="!dayList.length" class="text-center text-medium-emphasis">
									<VCol> No habits for the day. Change the date or add a new habit. </VCol>
								</VRow>
							</VCardText>
						</VCard>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
		<VCard v-if="badData.length" class="mt-3" variant="tonal">
			<VCardTitle> Bad Habits Data </VCardTitle>
			<VCardText>
				<TableView :headers="badDataHeaders" :items="badData">
					<template #actions="{ item }">
						<!-- TODO: implement edit -->
						<!-- <VBtn
							icon="fa-solid fa-pencil"
							color="primary"
							size="x-small"
							variant="text"
							@click="handleEditBadData(item)"
						/> -->
						<VBtn
							icon="fa-solid fa-trash"
							color="error"
							size="x-small"
							variant="text"
							@click="handleDeleteBadData(item)"
						/>
					</template>
				</TableView>
			</VCardText>
		</VCard>
	</Page>
	<Modal
		v-model="habitModal.show"
		:title="`${habitModal.action} Habit`"
		confirm-icon="fas fa-floppy-disk"
		:confirm-text="habitModal.action"
		persistent
		@confirm="handleConfirm"
	>
		<VForm>
			<VRow>
				<VCol cols="12" md="6">
					<VTextField v-model="habitModal.data.title" label="Title" required />
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12" md="6">
					<DateField v-model="habitModal.data.startDate" label="Start Date" required />
				</VCol>
				<VCol cols="12" md="6">
					<DateField
						v-model="habitModal.data.endDate"
						label="End Date"
						required
						:min-date="habitModal.data.startDate.format(displayDateFormat)"
					/>
				</VCol>
			</VRow>
			<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
				<VCardTitle>
					<p class="title text-h6 font-weight-bold">Check-in Days</p>
				</VCardTitle>
				<VCardText>
					<VRow>
						<VCol v-for="day in weekdays" :key="day" cols="12" md="3" sm="4">
							<VCheckbox
								:model-value="habitModal.data.weekdays.includes(day.value)"
								multiple
								:label="day.title"
								color="primary"
								hide-details
								density="compact"
								@update:model-value="handleAddWeekday(day.value)"
							/>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
		</VForm>
	</Modal>
	<Modal v-model="viewModal.show" :title="viewModal.habit.title" size="small">
		<VCard>
			<VCardText>
				<VCard class="mb-3" variant="tonal">
					<VCardText>
						<VRow dense justify="space-between">
							<VCol cols="auto"> Title: </VCol>
							<VCol cols="auto"> {{ viewModal.habit.title }} </VCol>
						</VRow>
						<VRow dense justify="space-between">
							<VCol cols="auto"> Date Range: </VCol>
							<VCol cols="auto">
								<DisplayDateTime :value="parseDateTime(viewModal.habit.startDate)" date-only />
								to
								<DisplayDateTime :value="parseDateTime(viewModal.habit.endDate)" date-only />
							</VCol>
						</VRow>
						<VRow dense justify="space-between">
							<VCol cols="auto"> Check-in Days: </VCol>
							<VCol cols="auto">
								<DisplayWeekdays :selected-days="viewModal.habit.weekdays" />
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
				<VRow v-if="viewModal.habit.checkIns.length" justify="end" class="mb-3">
					<VCol cols="auto">
						Total missed:
						<span class="text-warning">
							{{ viewModal.habit.checkIns.filter((c) => !c.checked).length }}
						</span>
					</VCol>
				</VRow>
				<VRow v-for="check in viewModal.habit.checkIns" :key="check.id" justify="space-between" dense>
					<VCol>
						{{ dayjs(check.date).format("dddd, DD-MMM YYYY") }}
						<div v-if="check.missedNote" class="text-medium-emphasis text-caption text-warning">
							Note: {{ check.missedNote }}
						</div>
					</VCol>
					<VCol cols="auto">
						<VIcon
							:icon="check.checked ? 'fas fa-check-circle' : 'fas fa-circle-xmark'"
							size="small"
							:color="check.checked ? 'success' : 'error'"
						/>
					</VCol>
					<VDivider class="my-2" color="info" opacity="100" />
				</VRow>
				<div v-if="!viewModal.habit.checkIns.length">No check-ins</div>
			</VCardText>
		</VCard>
	</Modal>
	<Modal v-model="statsModal.show" :title="statsModal.title">
		<TableView :headers="headers" :items="statsModal.items" hide-active-toggle="">
			<template #item.startDate="{ item }">
				<DisplayDateTime :value="parseDateTime(item.startDate)" date-only />
			</template>
			<template #item.endDate="{ item }">
				<DisplayDateTime :value="parseDateTime(item.endDate)" date-only />
			</template>
			<template #actions="{ item }">
				<VBtn
					icon="fa-solid fa-pencil"
					color="primary"
					size="x-small"
					variant="text"
					@click="handleEdit(item)"
				/>
				<VBtn
					icon="fa-solid fa-trash"
					color="error"
					size="x-small"
					variant="text"
					@click="handleDelete(item)"
				/>
			</template>
		</TableView>
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
	import { displayDateFormat, dataDateFormat, parseDateTime } from "@/utils/time";

	import DateField from "@/components/common/DateField.vue";
	import StatCard from "@/components/common/StatCard.vue";
	import TableView from "@/components/common/TableView.vue";
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
					params: { date: filterDate.value.toDate() },
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
		reload();
	}

	async function handleDailyCheck(habit) {
		if (!habit.checked && !habit.missedNote) {
			const confirmed = await confirmation("Confirm", `Are you sure you want to check out of ${habit.title}?`);

			if (!confirmed) {
				habit.checked = true;
				return;
			}
		}

		loading.start();
		try {
			const res = await request.post(`habits/${habit._id}/check`, {
				habitId: habit._id,
				date: filterDate.value.format(dataDateFormat),
				missedNote: habit.missedNote || null,
				checked: habit.checked,
			});

			snackbar.success(res.data.message);
			habit.showMissedNote = false;
			await reload();
		} catch (err) {
			logger.error(err, "handleDailyCheck");
		} finally {
			loading.end();
		}
	}

	//TODO: Probably clean up this function
	async function handleConfirm() {
		if (!habitModal.value.data.weekdays.length) {
			snackbar.warning("Please select at least one weekday");
			return;
		}

		if (habitModal.value.action === "Add") {
			const res = await request.post("habits", {
				title: habitModal.value.data.title,
				startDate: habitModal.value.data.startDate.format(dataDateFormat),
				endDate: habitModal.value.data.endDate.format(dataDateFormat),
				weekdays: habitModal.value.data.weekdays,
			});

			snackbar.success(`${res.data.title} added`);
		} else if (habitModal.value.action === "Edit") {
			const res = await request.put(`habits/${habitModal.value.data._id}`, {
				title: habitModal.value.data.title,
				startDate: habitModal.value.data.startDate.format(dataDateFormat),
				endDate: habitModal.value.data.endDate.format(dataDateFormat),
				weekdays: habitModal.value.data.weekdays,
			});

			snackbar.success(`${res.data.title} edited`);
		}

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
		console.log(item);
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

	watch(filterDate, function (value) {
		if (value) {
			reload();
		} else {
			dayList.value = [];
		}
	});
</script>
