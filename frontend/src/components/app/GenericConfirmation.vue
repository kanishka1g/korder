<template>
	<div>
		<Modal
			v-for="m in modals"
			:key="m.id"
			:model-value="m.open"
			:title="m.title"
			:type="m.type"
			:color="m.color"
			:confirm-icon="m.icon"
			persistent
			:fullscreen="false"
			size="small"
			:has-danger-icon="m.dangerous"
			:confirm-text="m.action"
			@cancel="resolve(m, false)"
			@confirm="resolve(m, true)"
		>
			<template #icon>
				<p v-if="m.type === 'error'" class="text-center mb-3">
					<VIcon color="error" icon="fas fa-triangle-exclamation" />
				</p>
			</template>
			<p class="text-center s-text-success s-text-small pre-line">{{ m.message }}</p>
		</Modal>
	</div>
</template>

<script setup>
	import { modals } from "@/utils/generic_modals";
	import { removeFromArray } from "@/utils/array";

	function resolve(modal, value) {
		modal.open = false;
		modal.resolve(value);
		setTimeout(() => removeFromArray(modal, this.modals), 1000);
	}
</script>

<style scoped>
	.pre-line {
		white-space: pre-line;
	}
</style>
