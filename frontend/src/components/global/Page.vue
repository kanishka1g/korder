<template>
	<VContainer fluid>
		<VRow v-if="!hideHeader" justify="end">
			<VCol>
				<p class="title text-h5 font-weight-bold">{{ title }}</p>
			</VCol>
		</VRow>
		<VScrollXTransition mode="out-in">
			<div v-if="error" key="error">
				<VRow>
					<VCol>
						<VAlert type="error" icon="fas fa-triangle-exclamation">
							<p>Oops! Something went wrong.</p>
						</VAlert>
					</VCol>
				</VRow>
			</div>
			<div v-else key="content">
				<slot />
			</div>
		</VScrollXTransition>
	</VContainer>
</template>

<script setup>
	const props = defineProps({
		title: {
			type: String,
			default: null,
		},
		error: {
			type: null,
			default: null,
		},
		hideHeader: {
			type: Boolean,
		},
	});
</script>
