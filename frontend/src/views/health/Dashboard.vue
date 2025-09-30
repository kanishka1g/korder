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
								<TableView :headers="headers" :items="weights">
									<template #item.date="{ item }">
										<DisplayDateTime :value="parseDateTime(item.date)" date-only />
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
		<VForm ref="weightForm">
			<VRow>
				<VCol cols="12">
					<DateField v-model="weightModal.form.date" label="Date" />
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12">
					<VTextField v-model="weightModal.form.weight" label="Weight" type="number" :rules="weightRules" />
				</VCol>
			</VRow>
			<VRow>
				<VCol>
					<VTextField
						v-model="weightModal.form.calories"
						label="Calorie"
						type="number"
						:rules="calorieRules"
					/>
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
	import { parseDateTime } from "@/utils/time";

	import DateField from "@/components/common/DateField.vue";
	import TableView from "@/components/common/TableView.vue";
	import DisplayDateTime from "@/components/common/DisplayDateTime.vue";

	const now = useNow();

	const headers = [
		{ title: "Date", key: "date" },
		{ title: "Weight", key: "weight" },
		{ title: "Calorie", key: "calories" },
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

	const error = ref();
	const weightModal = ref({
		show: false,
		action: "Add",
		form: weightObject(),
	});
	const weightForm = ref(null);
	const weights = ref([]);

	function handleAdd() {
		weightModal.value.form = weightObject();
		weightModal.value.action = "Add";
		weightModal.value.show = true;
	}

	function handleEdit(item) {
		weightModal.value.form = {
			_id: item._id,
			date: dayjs(item.date),
			weight: item.weight.toString(),
			calories: item.calories.toString(),
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

		if (weightModal.value.action === "Add") {
			const res = await request.post("weights", {
				date: weightModal.value.form.date.format("YYYY-MM-DD"),
				weight: weightModal.value.form.weight,
				calories: weightModal.value.form.calories,
			});

			snackbar.success("successfully added");
		} else if (weightModal.value.action === "Edit") {
			const res = await request.put(`weights/${weightModal.value.form._id}`, {
				date: weightModal.value.form.date.format("YYYY-MM-DD"),
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
