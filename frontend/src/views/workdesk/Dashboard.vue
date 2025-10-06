<template>
	<Page hide-header :error="error">
		<VRow>
			<VCol cols="12" md="6" order="1">
				<Welcome />
			</VCol>
			<VCol cols="12" md="6" order="2">
				<Status />
			</VCol>
			<VCol cols="12" md="6" order-md="3" order="4">
				<DayPlanner />
			</VCol>
			<VCol cols="12" md="6" order-md="4" order="3">
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
