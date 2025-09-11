<template>
	<VContainer>
		<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
			<VCardTitle>
				<VRow justify="end">
					<VCol>
						<p class="title text-h5 font-weight-bold">Weight Wave</p>
					</VCol>
					<VCol cols="auto">
						<VBtn prepend-icon="fa-solid fa-plus" color="primary" variant="outlined" @click="handleAdd">
							Add Weight
						</VBtn>
					</VCol>
				</VRow>
			</VCardTitle>
			<VCardText>
				<VDataTable :headers="headers" :items="data" hide-default-footer>
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

		<VDialog v-model="addModal" width="auto" persistent>
			<VCard width="400" rounded="lg">
				<VToolbar color="primary" title="Add Weight" density="compact" />
				<VCardText>
					<VForm>
						<VRow>
							<VCol cols="12">
								<DateField v-model="date" label="Date" />
							</VCol>
						</VRow>
						<VRow>
							<VCol cols="12">
								<VTextField v-model="weight" label="Weight" variant="outlined" type="number" />
							</VCol>
						</VRow>
						<VRow>
							<VCol>
								<VTextField
									v-model="calorieBurnt"
									label="Calorie Burnt"
									variant="outlined"
									type="number"
								/>
							</VCol>
						</VRow>
					</VForm>
				</VCardText>
				<VCardActions>
					<VRow justify="space-between" no-gutters>
						<VCol cols="auto">
							<VBtn variant="elevated" text="Cancel" @click="addModal = false" />
						</VCol>
						<VCol cols="auto">
							<VBtn color="primary" variant="elevated" text="Add" @click="handleSubmit" />
						</VCol>
					</VRow>
				</VCardActions>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	import { useNow } from "@/utils/now";

	import DateField from "@/components/common/DateField.vue";
	import { VCol } from "vuetify/lib/components/index.mjs";

	const now = useNow();

	const headers = [
		{ title: "Date", key: "date" },
		{ title: "Weight", key: "weight" },
		{ title: "Calorie Burnt", key: "calorieBurnt" },
		{ title: "", key: "action" },
	];

	const addModal = ref(false);

	const date = ref();
	const weight = ref(null);
	const calorieBurnt = ref(null);

	// TODO: Replace with actual data
	const data = ref([]);

	function handleAdd() {
		date.value = now.value;
		weight.value = null;
		calorieBurnt.value = null;
		addModal.value = true;
	}

	function handleEdit(item) {
		date.value = item.date;
		weight.value = item.weight;
		calorieBurnt.value = item.calorieBurnt;
		addModal.value = true;
	}

	function handleDelete(item) {
		data.value = data.value.filter((i) => i !== item);
	}

	function handleSubmit() {
		data.value.push({ date: date.value, weight: weight.value, calorieBurnt: calorieBurnt.value });
		addModal.value = false;
	}
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.title {
		font-family: variables.$title-font;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
