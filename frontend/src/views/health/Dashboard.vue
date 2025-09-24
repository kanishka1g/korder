<template>
	<Page title="Health" :error="error">
		<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
			<VCardText>
				<VRow>
					<VCol cols="12" md="6" order-md="1" order="2">
						<VCard variant="outlined" class="mt-3">
							<VCardTitle>
								<VRow justify="end">
									<VCol cols="auto">
										<VBtn
											size="small"
											prepend-icon="fa-solid fa-plus"
											color="primary"
											@click="handleAdd"
										>
											Add
										</VBtn>
									</VCol>
								</VRow>
							</VCardTitle>
							<VCardText>
								<VDataTable
									v-if="$vuetify.display.mdAndUp"
									:headers="headers"
									:items="weights"
									hide-default-footer
								>
									<template #item.date="{ item }">
										<!-- TODO: create display datetime component -->
										{{ dayjs(item.date).format("YYYY-MM-DD") }}
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
								<VRow v-for="item in weights" v-else :key="item.id" dense>
									<VCol cols="12">
										<VCard class="mb-2">
											<VCardText>
												<VRow dense>
													<VCol> Date </VCol>
													<VCol cols="auto">
														{{ dayjs(item.date).format("YYYY-MM-DD") }}
													</VCol>
												</VRow>
												<VRow dense>
													<VCol> Weight </VCol>
													<VCol cols="auto">
														{{ item.weight }}
													</VCol>
												</VRow>
												<VRow dense>
													<VCol> Calories </VCol>
													<VCol cols="auto">
														{{ item.calories }}
													</VCol>
												</VRow>
											</VCardText>
											<VCardActions>
												<VRow justify="end" dense>
													<VCol cols="auto">
														<VBtn
															class="mx-n2"
															size="small"
															prepend-icon="fa-solid fa-pencil"
															color="primary"
															@click="handleEdit(item)"
														>
														</VBtn>
														<VBtn
															class="mx-n2"
															size="small"
															prepend-icon="fa-solid fa-trash"
															color="error"
															@click="handleDelete(item)"
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
				</VRow>
			</VCardText>
		</VCard>
	</Page>
	<Modal
		v-model="weightModal.show"
		:title="`${weightModal.action} Weight`"
		confirm-icon="fas fa-floppy-disk"
		:confirm-text="weightModal.action"
		persistent
		size="small"
		@confirm="handleConfirm"
	>
		<VForm>
			<VRow>
				<VCol cols="12">
					<DateField v-model="weightModal.form.date" label="Date" />
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12">
					<VTextField v-model="weightModal.form.weight" label="Weight" variant="outlined" type="number" />
				</VCol>
			</VRow>
			<VRow>
				<VCol>
					<VTextField v-model="weightModal.form.calories" label="Calorie" variant="outlined" type="number" />
				</VCol>
			</VRow>
		</VForm>
	</Modal>
</template>

<script setup>
	import { ref } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import request from "@/utils/request";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/loading";
	import { snackbar, confirmation } from "@/utils/generic_modals";

	import DateField from "@/components/common/DateField.vue";

	const now = useNow();

	const headers = [
		{ title: "Date", key: "date" },
		{ title: "Weight", key: "weight" },
		{ title: "Calorie", key: "calories" },
		{ title: "", key: "action" },
	];

	const error = ref();
	const weightModal = ref({
		show: false,
		action: "Add",
		form: weightObject(),
	});

	const weights = ref([]);

	function handleAdd() {
		weightModal.value.form = weightObject();
		weightModal.value.action = "Add";
		weightModal.value.show = true;
	}

	function handleEdit(item) {
		weightModal.value.form = {
			date: dayjs(item.date),
			...item,
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
		if (weightModal.value.action === "Add") {
			const res = await request.post("weights", {
				date: weightModal.value.form.date,
				weight: weightModal.value.form.weight,
				calories: weightModal.value.form.calories,
			});

			snackbar.success("successfully added");
		} else if (weightModal.value.action === "Edit") {
			const res = await request.put(`weights/${weightModal.value.form._id}`, {
				date: weightModal.value.form.date,
				weight: weightModal.value.form.weight,
				calories: weightModal.value.form.calories,
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

	function weightObject() {
		return {
			date: now.value,
			weight: null,
			calories: null,
		};
	}
</script>
