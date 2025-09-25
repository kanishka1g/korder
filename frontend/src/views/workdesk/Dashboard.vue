<template>
	<Page hide-header :error="error">
		<VRow>
			<VCol cols="12" md="6">
				<Welcome />
				<!-- TODO: calender or todoist component -->
				<VCard class="card mt-3 fill-height" variant="tonal" elevation="4" rounded="lg" density="comfortable">
					<VCardTitle>
						<p class="title text-h6 font-weight-bold">calender or todoist comes here</p>
					</VCardTitle>
					<VCardText> </VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" md="6">
				<AppLinks />
			</VCol>
		</VRow>
	</Page>
</template>

<script setup>
	import { ref } from "vue";
	import { useNow } from "@/utils/now";

	import Welcome from "@/components/workdesk/Welcome.vue";
	import AppLinks from "@/components/workdesk/AppLinks.vue";

	const now = useNow();

	const error = ref();
</script>
