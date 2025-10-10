<template>
	<Page hide-header :error="error">
		<!-- <LoginDialogExample></LoginDialogExample> -->
		<VRow>
			<VCol cols="12" lg="6" order="1">
				<Welcome />
			</VCol>
			<VCol cols="12" lg="6" order="2">
				<Status />
			</VCol>
			<VCol cols="12" lg="6" order="3">
				<ScheduleOverview :dates="scheduleDates" />
			</VCol>
			<VCol cols="12" lg="6" order="4">
				<AppLinks />
			</VCol>
		</VRow>
	</Page>
</template>

<script setup>
	import { ref } from "vue";
	import request from "@/utils/request";

	import Welcome from "@/components/workdesk/WelcomeCard.vue";
	import Status from "@/components/workdesk/StatusCard.vue";
	import ScheduleOverview from "@/components/workdesk/ScheduleOverviewCard.vue";
	import AppLinks from "@/components/workdesk/AppLinksCard.vue";

	import LoginDialogExample from "@/components/examples/DesignSystemExample.vue";

	const error = ref();
	const scheduleDates = ref([]);

	async function reload() {
		try {
			const response = await request.get("workdesk/day-plan");
			scheduleDates.value = response.data;
		} catch (e) {
			error.value = e;
		}
	}

	reload();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
