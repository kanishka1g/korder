<template>
	<VContainer>
		<VRow justify="end">
			<VCol>
				<p class="text-h5 font-weight-bold title">Weight Wave</p>
			</VCol>
			<VCol cols="auto">
				<VBtn color="primary" variant="outlined" @click="addModal = true">Add Weight</VBtn>
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
								<VTextField v-model="weight" label="Weight" />
							</VCol>
						</VRow>
					</VForm>
				</VCardText>
				<template #actions>
					<VBtn color="primary" variant="elevated" text="Add" @click="handleAdd" />
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

	const date = ref(now.value);
	const weight = ref(null);

	function handleAdd() {
		addModal.value = true;
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
