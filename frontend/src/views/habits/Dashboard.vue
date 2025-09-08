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
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import api from "@/services/api";

	const now = useNow();

	const headers = [
		{ title: "Title", key: "title" },
		{ title: "Start Date", key: "startDate" },
		{ title: "End Date", key: "endDate" },
		{ title: "", key: "action" },
	];

	const loading = ref(false);
	const habits = ref([]);

	const todayList = computed(() => {
		let list = [];
		for (const item of habits.value) {
			item.checked = item.checkIns.some((checkin) => {
				return now.value.isSame(dayjs(checkin.date), "day");
			});
			if (now.value.isBetween(item.startDate, item.endDate, "day", "[]")) {
				list.push(item);
			}
		}
		return list;
	});

	async function reload() {
		try {
			loading.value = true;

			const token = localStorage.getItem("token");
			const res = await api.get("api/habits", { headers: { Authorization: `Bearer ${token}` } });
			habits.value = res.data;
			// console.log(res);
		} catch (err) {
			console.error("Get habits error:", err.response?.data?.message || err.message);
			throw err;
		} finally {
			loading.value = false;
		}
	}

	reload();

	async function handleAdd() {
		try {
			const token = localStorage.getItem("token");
			const res = await api.post(
				"api/habits",
				{
					title: "Less display time",
					description: null,
					startDate: "2025-09-08",
					endDate: "2025-09-30",
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			//TODO: Update snackbar
			console.log("Habit added:", res.data);
			reload();
		} catch (err) {
			console.error("Add habit error:", err.response?.data?.message || err.message);
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function handleCheckin(habit) {
		try {
			const token = localStorage.getItem("token");
			const res = await api.post(
				`api/habits/${habit._id}/check`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			// TODO: Update snackbar
			console.log(`${habit.title} checked`);
			reload();
		} catch (err) {
			console.error("Add habit error:", err.response?.data?.message || err.message);
			throw err;
		} finally {
			loading.value = false;
		}
	}
</script>
