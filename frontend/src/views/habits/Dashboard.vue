<template>
	<VContainer fluid>
		<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
			<VCardTitle>
				<VRow justify="end">
					<VCol>
						<p class="title text-h5 font-weight-bold">Habits</p>
					</VCol>
				</VRow>
			</VCardTitle>
			<VCardText>
				<VRow>
					<VCol cols="12" md="6" order-md="1" order="2">
						<VCard variant="outlined" class="mt-3">
							<VCardTitle>
								<VRow justify="end">
									<VCol cols="auto">
										<VSwitch
											v-model="showArchived"
											label="Archive"
											color="warning"
											density="compact"
										/>
									</VCol>
									<VCol cols="auto">
										<VBtn prepend-icon="fa-solid fa-plus" color="primary" @click="handleAdd">
											Add Habit
										</VBtn>
									</VCol>
								</VRow>
							</VCardTitle>
							<VCardText>
								<VDataTable
									v-if="$vuetify.display.mdAndUp"
									:headers="headers"
									:items="filteredHabits"
									hide-default-footer
								>
									<template #item.startDate="{ item }">
										{{ dayjs(item.startDate).format("YYYY-MM-DD") }}
									</template>
									<template #item.endDate="{ item }">
										{{ dayjs(item.endDate).format("YYYY-MM-DD") }}
									</template>
									<template #item.action="{ item }">
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
								</VDataTable>
								<VRow v-for="habit in filteredHabits" v-else :key="habit.id" dense>
									<VCol cols="12">
										<VCard class="mb-2">
											<VCardText>
												<VRow dense>
													<VCol> Title </VCol>
													<VCol cols="auto">
														{{ habit.title }}
													</VCol>
												</VRow>
												<VRow dense>
													<VCol> Start Date </VCol>
													<VCol cols="auto">
														{{ dayjs(habit.startDate).format("YYYY-MM-DD") }}
													</VCol>
												</VRow>
												<VRow dense>
													<VCol> End Date </VCol>
													<VCol cols="auto">
														{{ dayjs(habit.endDate).format("YYYY-MM-DD") }}
													</VCol>
												</VRow>
											</VCardText>
											<VCardActions>
												<VRow justify="end" no-gutters>
													<VCol cols="auto">
														<VBtn prepend-icon="fa-solid fa-eye" @click="handleView(habit)">
														</VBtn>
														<VBtn
															prepend-icon="fa-solid fa-pencil"
															color="primary"
															@click="handleEdit(habit)"
														>
														</VBtn>
														<VBtn
															prepend-icon="fa-solid fa-trash"
															color="error"
															@click="handleDelete(habit)"
														>
														</VBtn>
													</VCol>
												</VRow>
											</VCardActions>
										</VCard>
									</VCol>
								</VRow>
							</VCardText>
						</VCard>
					</VCol>
					<VCol cols="12" md="6" order-md="2" order="1">
						<VCard variant="outlined" class="mt-3">
							<VCardTitle>
								<VRow>
									<VCol> Daily checkin </VCol>
									<VCol>
										<DateField v-model="filterDate" />
									</VCol>
								</VRow>
							</VCardTitle>
							<VCardText v-if="dayList.length">
								<VRow v-for="habit in dayList" :key="habit.id" dense>
									<VCol>
										<VCheckbox
											v-model="habit.checked"
											color="primary"
											:label="habit.title"
											hide-details
											density="compact"
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
									<VCol v-else-if="!habit.checked" cols="auto">
										<div v-if="foundMissedNote(habit)">
											{{ foundMissedNote(habit) }}
											<VBtn
												icon="fas fa-pencil"
												size="x-small"
												variant="text"
												color="primary"
												@click="handleEditNote(habit)"
											/>
										</div>

										<div v-else>
											<VBtn
												icon="fas fa-note-sticky"
												size="x-small"
												variant="text"
												color="primary"
												@click="habit.showMissedNote = true"
											/>
										</div>
									</VCol>
								</VRow>
							</VCardText>
							<VCardText v-else class="text-center text-medium-emphasis">
								No habits for the day. Change the date or add a new habit.
							</VCardText>
						</VCard>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
	</VContainer>
	<Modal
		v-model="habitModal.show"
		:title="`${habitModal.action} Habit`"
		confirm-icon="fas fa-floppy-disk"
		:confirm-text="habitModal.action"
		@confirm="handleConfirm"
	>
		<VForm>
			<VRow>
				<VCol cols="12" md="6">
					<VTextField v-model="habitModal.data.title" label="Title" variant="outlined" required />
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12" md="6">
					<!-- <VTextField
						v-model="habitModal.data.startDate"
						label="Start Date"
						type="date"
						variant="outlined"
						required
					/> -->
					<DateField v-model="habitModal.data.startDate" label="Start Date" required />
				</VCol>
				<VCol cols="12" md="6">
					<!-- <VTextField
						v-model="habitModal.data.endDate"
						label="End Date"
						type="date"
						variant="outlined"
						required
					/> -->
					<DateField v-model="habitModal.data.endDate" label="End Date" required />
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
					<VCardTitle class="text-body-1">Habit Details</VCardTitle>
					<VCardText>
						<VRow>
							<VCol>
								Date Range:
								<span class="text-medium-emphasis">
									{{ dayjs(viewModal.habit.startDate).format("DD-MM-YYYY") }} to
									{{ dayjs(viewModal.habit.endDate).format("DD-MM-YYYY") }}
								</span>
								Weekdays:
								<!-- TODO: create a util for text that can make first letter capital and make weekday capital -->
								<span class="text-medium-emphasis">{{ viewModal.habit.weekdays.join(", ") }}</span>
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
</template>

<script setup>
	import { ref, computed, watch } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import request from "@/utils/request";
	import { useAuthStore } from "@/stores/auth_store";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/loading";
	import { snackbar, confirmation } from "@/utils/generic_modals";
	import DateField from "@/components/common/DateField.vue";

	const now = useNow();
	const authStore = useAuthStore();
	const loading = useLoading();
	const logger = useLogger();

	const headers = [
		{ title: "Title", key: "title" },
		{ title: "Start Date", key: "startDate" },
		{ title: "End Date", key: "endDate" },
		{ title: "", key: "action", align: "end", width: "150px" },
	];

	const showArchived = ref(false);
	const filterDate = ref(now.value);
	const habits = ref([]);
	const dayList = ref([]);
	const habitModal = ref({
		show: false,
		action: "Add",
		data: habitObject(),
	});
	const viewModal = ref({
		show: false,
		habit: habitObject(),
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
		const [habitsResponse, dayListResponse] = await Promise.all([
			request.get("habits", { headers: { Authorization: `Bearer ${authStore.token}` } }),
			request.get(
				`habits/day-list`,

				{
					params: { date: filterDate.value.toDate() },
					headers: { Authorization: `Bearer ${authStore.token}` },
				},
			),
		]);

		habits.value = habitsResponse.data;
		dayList.value = dayListResponse.data.map((item) => {
			item.checked = item.checkIns.some((checkin) => {
				return filterDate.value.isSame(dayjs(checkin.date), "day") && checkin.checked;
			});

			return item;
		});
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
			title: habit.title,
			startDate: dayjs(habit.startDate),
			endDate: dayjs(habit.endDate),
			weekdays: habit.weekdays,
			_id: habit._id,
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

		const res = await request.delete(`habits/${habit._id}`, {
			headers: { Authorization: `Bearer ${authStore.token}` },
		});

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
			const res = await request.post(
				`habits/${habit._id}/check`,
				{
					habitId: habit._id,
					date: filterDate.value.toDate(),
					missedNote: habit.missedNote || null,
					checked: habit.checked,
				},
				{
					headers: { Authorization: `Bearer ${authStore.token}` },
				},
			);

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
			const res = await request.post(
				"habits",
				{
					title: habitModal.value.data.title,
					startDate: habitModal.value.data.startDate,
					endDate: habitModal.value.data.endDate,
					weekdays: habitModal.value.data.weekdays,
				},
				{
					headers: { Authorization: `Bearer ${authStore.token}` },
				},
			);

			snackbar.success(`${res.data.title} added`);
		} else if (habitModal.value.action === "Edit") {
			const res = await request.put(
				`habits/${habitModal.value.data._id}`,
				{
					title: habitModal.value.data.title,
					startDate: habitModal.value.data.startDate,
					endDate: habitModal.value.data.endDate,
					weekdays: habitModal.value.data.weekdays,
				},
				{
					headers: { Authorization: `Bearer ${authStore.token}` },
				},
			);

			snackbar.success(`${res.data.title} edited`);
		}

		reload();
		habitModal.value.show = false;
	}

	async function handleView(habit) {
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

	function habitObject() {
		return {
			title: null,
			startDate: now.value,
			endDate: now.value.add(7, "day"),
			weekdays: [],
		};
	}

	watch(filterDate, reload);
</script>
