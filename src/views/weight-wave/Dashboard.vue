<template>
	<VContainer>
		<VRow justify="end">
			<VCol>
				<p class="text-h5 font-weight-bold title">Weight Wave</p>
			</VCol>
			<VCol cols="auto">
				<VBtn color="primary" variant="outlined" @click="handleAdd">Add Weight</VBtn>
			</VCol>
		</VRow>
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
								<VTextField v-model="weight" label="Weight" variant="outlined" />
							</VCol>
						</VRow>
						<VRow>
							<VCol>
								<VTextField v-model="calorieBurnt" label="Calorie Burnt" variant="outlined" />
							</VCol>
						</VRow>
					</VForm>
				</VCardText>
				<template #actions>
					<VBtn color="primary" variant="elevated" text="Add" @click="handleSubmit" />
				</template>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	import { useNow } from "@/utils/now";

	import DateField from "@/components/common/DateField.vue";

	const now = useNow();

	const addModal = ref(false);

	const date = ref();
	const weight = ref(null);

	function handleAdd() {
		date.value = now.value;
		weight.value = null;
		addModal.value = true;
	}

	function handleSubmit() {
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
