<template>
	<VContainer fluid>
		<VRow>
			<VCol>
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
							<VCol v-if="todayList.length" cols="12" md="6">
								<VCard variant="outlined" class="mt-3">
									<VCardTitle> Today's checkin </VCardTitle>
									<VCardText>
										<VRow v-for="habit in todayList" :key="habit.id" dense>
											<VCol>
												<VCheckbox
													v-model="habit.checked"
													color="primary"
													:label="habit.title"
													hide-details
													density="compact"
													@update:model-value="handleCheckin(habit)"
												/>
											</VCol>
										</VRow>
									</VCardText>
								</VCard>
							</VCol>
							<VCol cols="12" md="6">
								<VCard variant="outlined" class="mt-3">
									<VCardTitle>
										<VRow justify="end">
											<VCol cols="auto">
												<VBtn
													prepend-icon="fa-solid fa-plus"
													color="primary"
													@click="handleAdd"
												>
													Add Habit
												</VBtn>
											</VCol>
										</VRow>
									</VCardTitle>
									<VCardText>
										<VDataTable :headers="headers" :items="habits" hide-default-footer>
											<template #item.startDate="{ item }">
												{{ dayjs(item.startDate).format("YYYY-MM-DD") }}
											</template>
											<template #item.endDate="{ item }">
												{{ dayjs(item.endDate).format("YYYY-MM-DD") }}
											</template>
											<template #item.action="{ item }">
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
									</VCardText>
								</VCard>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</VContainer>
	<Modal
		v-model="habitModal.show"
		:title="`${habitModal.action} Habit`"
		confirm-icon="fas fa-floppy-disk"
		:confirm-text="habitModal.action"
		@confirm="handleConfirm"
	>
		<VCardText>
			<VForm>
				<VRow>
					<VCol cols="12" md="6">
						<VTextField v-model="habitModal.data.title" label="Title" variant="outlined" required />
					</VCol>
					<VCol cols="12" md="6">
						<VTextField v-model="habitModal.data.description" label="Description" variant="outlined" />
					</VCol>
				</VRow>
				<VRow>
					<VCol cols="12" md="6">
						<VTextField
							v-model="habitModal.data.startDate"
							label="Start Date"
							type="date"
							variant="outlined"
							required
						/>
					</VCol>
					<VCol cols="12" md="6">
						<VTextField
							v-model="habitModal.data.endDate"
							label="End Date"
							type="date"
							variant="outlined"
							required
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
		</VCardText>
	</Modal>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import request from "@/utils/request";
	import { useAuthStore } from "@/stores/auth_store";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/loading";
	import { snackbar, confirmation } from "@/utils/generic_modals";

	const now = useNow();
	const authStore = useAuthStore();
	const loading = useLoading();
	const logger = useLogger();

	const headers = [
		{ title: "Title", key: "title" },
		{ title: "Start Date", key: "startDate" },
		{ title: "End Date", key: "endDate" },
		{ title: "", key: "action", align: "end", width: "100px" },
	];

	const habits = ref([]);
	const habitModal = ref({
		show: false,
		action: "Add",
		data: habitObject(),
	});

	const todayList = computed(function () {
		let list = [];
		for (const item of habits.value) {
			item.checked = item.checkIns.some((checkin) => {
				return now.value.isSame(dayjs(checkin.date), "day");
			});

			if (
				now.value.isBetween(item.startDate, item.endDate, "day", "[]") &&
				item.weekdays.includes(now.value.format("dddd").toLocaleLowerCase())
			) {
				list.push(item);
			}
		}
		return list;
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
		const token = authStore.token;
		const res = await request.get("habits", { headers: { Authorization: `Bearer ${token}` } });
		habits.value = res.data;
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
			description: habit.description,
			startDate: dayjs(habit.startDate).format("YYYY-MM-DD"),
			endDate: dayjs(habit.endDate).format("YYYY-MM-DD"),
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

	async function handleCheckin(habit) {

		if(!habit.checked){
			const confirmed = await confirmation("Confirm", `Are you sure you want to check out of ${habit.title}?`, true);
			if (!confirmed) {
				return;
			}
		}

		loading.start();
		try {
			const res = await request.post(
				`habits/${habit._id}/check`,
				{},
				{
					headers: { Authorization: `Bearer ${authStore.token}` },
				},
			);

			snackbar.success(res.data.message);

			reload();
		} catch (err) {
			logger.error(err, "handleCheckin");
		} finally {
			loading.end();
		}
	}

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
					description: habitModal.value.data.description,
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
					description: habitModal.value.data.description,
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

	function habitObject() {
		return {
			title: null,
			description: null,
			startDate: now.value.format("YYYY-MM-DD"),
			endDate: now.value.add(7, "day").format("YYYY-MM-DD"),
			weekdays: [],
		};
	}
</script>
