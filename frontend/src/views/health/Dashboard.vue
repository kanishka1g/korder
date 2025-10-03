<template>
	<Page title="Health" :error="error">
		<VRow>
			<VCol cols="12" md="6" order-md="2" order="1">
				<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
					<VCardText>
						<VRow>
							<VCol>
								<LineChart :data="lineChartData" />
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" md="6" order-md="1" order="2">
				<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
					<VCardText>
						<VRow>
							<VCol>
								<VCard variant="outlined" class="mt-3">
									<VCardText>
										<TableView
											:headers="headers"
											:items="weights"
											hide-active-toggle
											@add="handleAdd"
										>
											<template #item.date="{ item }">
												<DisplayDateTime :value="item.date" date-only />
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
											<template #mobile="{ item }">
												<VRow>
													<VCol cols="4" class="text-medium-emphasis">
														<DisplayDateTime :value="item.date" date-only />
													</VCol>
													<VCol cols="8">{{ item.weight }}</VCol>
												</VRow>
											</template>
										</TableView>
									</VCardText>
								</VCard>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
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
					<VSelect v-model="weightModal.form.location" :items="locations" label="Location" />
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12">
					<DateField v-model="weightModal.form.date" label="Date" past-only />
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
						v-model="weightModal.form.burnedCalories"
						label="Burned Calories"
						type="number"
						:rules="calorieRules"
					/>
				</VCol>
			</VRow>
		</VForm>
	</Modal>
</template>

<script setup>
	import { computed, ref } from "vue";
	import { useNow } from "@/utils/now";
	import dayjs from "@/plugins/dayjs";
	import request from "@/utils/request";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/loading";
	import { snackbar, confirmation } from "@/utils/generic_modals";
	import { displayLongMonthDayFormat } from "@/utils/time";

	import LineChart from "@/components/charts/LineChart.vue";
	import DateField from "@/components/common/DateField.vue";
	import TableView from "@/components/common/TableView.vue";
	import DisplayDateTime from "@/components/common/DisplayDateTime.vue";

	const now = useNow();

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
	const weightModal = ref({
		show: false,
		action: "Add",
		form: weightObject(),
	});
	const weightForm = ref(null);
	const weights = ref([]);

	const lineChartData = computed(function () {
		return {
			labels: weights.value.map((w) => dayjs(w.date).format(displayLongMonthDayFormat)),
			datasets: [
				{
					label: "Weight",
					data: weights.value.map((w) => w.weight),
				},
			],
		};
	});

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

	function weightObject() {
		return {
			location: "home",
			date: now.value,
			weight: null,
			burnedCalories: null,
		};
	}
</script>
