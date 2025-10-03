<template>
	<Page hide-header :error="error">
		<VRow>
			<VCol cols="12" md="6">
				<Welcome />
			</VCol>
			<VCol cols="12" md="6">
				<Status />
			</VCol>
			<VCol cols="12" md="6">
				<!-- TODO: calender or todoist component -->
				<VCard variant="tonal" rounded="lg">
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

	import Welcome from "@/components/workdesk/WelcomeCard.vue";
	import AppLinks from "@/components/workdesk/AppLinksCard.vue";
	import Status from "@/components/workdesk/StatusCard.vue";

	const error = ref();
</script>
