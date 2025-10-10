<template>
	<VCard class="fill-height">
		<VCardText>
			<VRow dense>
				<VCol cols="auto">
					<VIcon :icon="icon" size="small"></VIcon>
				</VCol>
			</VRow>
			<VRow dense justify="end">
				<VCol class="text-body-1"> {{ title }} </VCol>
				<VCol cols="auto" class="text-h5 font-weight-bold"> {{ value }} </VCol>
			</VRow>
			<VRow v-if="!hideView" justify="end" dense>
				<VCol>
					<VBtn
						color="primary"
						prepend-icon="fa-square-arrow-up-right"
						variant="text"
						size="small"
						@click="$emit('view')"
					>
						View
					</VBtn>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	defineProps({
		title: {
			type: String,
			default: null,
		},
		value: {
			type: [String, Number],
			default: null,
		},
		icon: {
			type: String,
			default: "fas fa-chart-line",
		},
		hideView: {
			type: Boolean,
		},
	});

	defineEmits(["view"]);
</script>
