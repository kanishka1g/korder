<template>
	<!-- Skip Links for Keyboard Navigation (only show when authenticated) -->
	<template v-if="isAuthenticated">
		<a href="#main-content" class="skip-link">Skip to main content</a>
		<a href="#navigation" class="skip-link">Skip to navigation</a>
	</template>

	<AppShell v-if="isAuthenticated">
		<!-- Live Region for Screen Reader Announcements -->
		<div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true" role="status"></div>

		<!-- Assertive Live Region for Important Announcements -->
		<div id="live-region-assertive" class="sr-only" aria-live="assertive" aria-atomic="true" role="alert"></div>
	</AppShell>

	<!-- Unauthenticated App without Shell -->
	<VApp v-else>
		<VMain>
			<RouterView />
		</VMain>
		<GenericSnackbar />
		<GenericConfirmation />

		<!-- Live Region for Screen Reader Announcements -->
		<div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true" role="status"></div>

		<!-- Assertive Live Region for Important Announcements -->
		<div id="live-region-assertive" class="sr-only" aria-live="assertive" aria-atomic="true" role="alert"></div>
	</VApp>
</template>

<script setup>
	import { onMounted, computed } from "vue";
	import { useRoute } from "vue-router";
	import AppShell from "./components/app/AppShell.vue";
	import GenericSnackbar from "./components/app/GenericSnackbar.vue";
	import GenericConfirmation from "./components/app/GenericConfirmation.vue";
	import { useAccessibility } from "@/composables/useAccessibility";
	import { useAuthStore } from "@/stores/auth_store";

	const { announce } = useAccessibility();
	const authStore = useAuthStore();
	const route = useRoute();

	// Check if user is authenticated AND not on a public route
	const isAuthenticated = computed(() => {
		// Always show login page without shell for public routes
		if (route.meta?.publicRoute) {
			return false;
		}
		return authStore.isLoggedIn;
	});

	onMounted(() => {
		// Announce app ready state to screen readers
		announce("Korder application loaded and ready", "polite");

		// Set up global keyboard shortcuts (only for authenticated users)
		document.addEventListener("keydown", handleGlobalKeydown);
	});

	const handleGlobalKeydown = (event) => {
		// Only handle shortcuts when authenticated
		if (!isAuthenticated.value) return;

		// Global keyboard shortcuts for accessibility
		if (event.altKey && event.key === "m") {
			// Alt+M: Focus main content
			event.preventDefault();
			const mainContent = document.getElementById("main-content");
			if (mainContent) {
				mainContent.focus();
				announce("Focused main content", "polite");
			}
		}

		if (event.altKey && event.key === "n") {
			// Alt+N: Focus navigation
			event.preventDefault();
			const navigation = document.getElementById("navigation");
			if (navigation) {
				navigation.focus();
				announce("Focused navigation", "polite");
			}
		}
	};
</script>
