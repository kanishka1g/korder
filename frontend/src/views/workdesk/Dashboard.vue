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
			<VCol cols="12" lg="6" order="4">
				<VBtn @click="handlePushNotification" class="ma-2" variant="outlined" color="primary">
					Push Notification Test
				</VBtn>
			</VCol>
		</VRow>
	</Page>
</template>

<script setup>
	import { ref } from "vue";
	import request from "@/utils/request";
	import { useNotification } from "@/composables/useNotification";

	import Welcome from "@/components/workdesk/WelcomeCard.vue";
	import Status from "@/components/workdesk/StatusCard.vue";
	import ScheduleOverview from "@/components/workdesk/ScheduleOverviewCard.vue";
	import AppLinks from "@/components/workdesk/AppLinksCard.vue";

	const { init, showNotification } = useNotification();

	const error = ref();
	const scheduleDates = ref([]);

	async function reload() {
		try {
			const response = await request.get("workdesk/schedules", { timeout: 30000 });
			scheduleDates.value = response.data;
		} catch (e) {
			error.value = e;
		}
	}

	reload();

	async function handlePushNotification() {
		await init();

		// Trigger a notification immediately
		showNotification({
			title: "Korder Alert!",
			body: "This is an immediate notification 🚀",
			createdAt: new Date().toISOString(), // optional, for tracking
		});
	}
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
