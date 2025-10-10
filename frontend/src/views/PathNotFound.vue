<template>
	<v-app>
		<v-main class="d-flex align-center justify-center min-height-screen">
			<ErrorState
				title="404 - Page Not Found"
				message="Oops! The page you're looking for doesn't exist or may have been moved."
				icon="fas fa-map-marked-alt"
				variant="error"
				:primary-action="primaryAction"
				:secondary-action="secondaryAction"
				:details="routeDetails"
			/>
		</v-main>
	</v-app>
</template>
<script setup>
	import { computed } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import ErrorState from "@/components/app/ErrorState.vue";

	const router = useRouter();
	const route = useRoute();

	// Navigation actions
	const goToDashboard = () => {
		router.push("/dashboard");
	};

	const goBack = () => {
		if (window.history.length > 1) {
			router.go(-1);
		} else {
			router.push("/dashboard");
		}
	};

	// Action configurations
	const primaryAction = {
		text: "Go to Dashboard",
		icon: "fas fa-home",
		color: "primary",
		variant: "elevated",
		action: goToDashboard,
	};

	const secondaryAction = {
		text: "Go Back",
		icon: "fas fa-arrow-left",
		color: "secondary",
		variant: "outlined",
		action: goBack,
	};

	// Route details for debugging (optional)
	const routeDetails = computed(() => {
		return `Requested path: ${route.fullPath}\nAvailable routes: /dashboard, /settings, /workdesk, /health, /habits`;
	});
</script>

<style scoped>
	.min-height-screen {
		min-height: 100vh;
	}
</style>
