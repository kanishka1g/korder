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
				<DayPlanner />
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
	import DayPlanner from "@/components/workdesk/DayPlannerCard.vue";

	const error = ref();
</script>
