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
						<!-- TODO:log Today habits -->
						<VRow>
							<VCol cols="12" md="6">
								<VCard variant="outlined" class="mt-3">
									<VCardTitle> Today's checkin </VCardTitle>
									<VCardText>
										<VRow v-for="habit in todayList" :key="habit.id" dense>
											<VCol>
												<VCheckbox v-model="habit.checked" :label="habit.title" />
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

	const now = useNow();

	const headers = [
		{ title: "Title", key: "title" },
		{ title: "Start Date", key: "startDate" },
		{ title: "End Date", key: "endDate" },
		{ title: "", key: "action" },
	];

	const habits = ref([]);

	const todayList = computed(() => {
		return habits.value.filter((habit) => {
			return now.value.isBetween(habit.startDate, habit.endDate, "day", "[]");
		});
	});

	async function reload() {
		habits.value = [
			{
				id: 1,
				title: "meditate",
				description: "",
				startDate: dayjs("2025-09-05"),
				endDate: dayjs("2025-09-14"),
			},
			{
				id: 2,
				title: "sleep early",
				description: "",
				startDate: dayjs("2025-09-05"),
				endDate: dayjs("2025-10-05"),
			},
			{
				id: 3,
				title: "eat less calories",
				description: "",
				startDate: dayjs("2025-09-10"),
				endDate: dayjs("2025-10-05"),
			},
		];
	}

	reload();

	function handleAdd() {
		console.log("handleAdd");
	}
</script>
