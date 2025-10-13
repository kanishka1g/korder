<template>
	<VCard class="modern-card pa-4 rounded-xl fill-height" elevation="8">
		<VCardTitle class="pa-0 mb-6">
			<div class="d-flex align-center">
				<VIcon icon="fas fa-link" color="primary" size="24" class="mr-3" />
				<h3 class="text-h5 font-weight-bold links-title">Quick Links</h3>
			</div>
		</VCardTitle>

		<VCardText class="pa-0">
			<!-- Apps Grid -->
			<VRow class="apps-grid">
				<VCol v-for="(app, index) in allApps" :key="app.id" cols="12" sm="6" md="4" lg="6" xl="4">
					<AppCard
						:app="app"
						@open="handleOpenApp"
						:aria-posinset="index + 1"
						:aria-setsize="allApps.length"
					/>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { computed } from "vue";
	import { useRouter } from "vue-router";
	import AppCard from "@/components/app/AppCard.vue";
	import { internalLinks, externalLinks } from "@/utils/helpers";
	import { useAccessibility } from "@/composables/useAccessibility";

	const router = useRouter();
	const { announce } = useAccessibility();

	// Transform links into app format for AppCard
	const allApps = computed(() => {
		const transformedApps = [];

		// Transform internal links
		internalLinks.forEach((link, index) => {
			transformedApps.push({
				id: `internal-${index}`,
				name: link.title,
				description: `Internal ${link.title} application`,
				icon: link.icon,
				url: link.route,
				status: "online", // Internal apps are assumed to be online
				lastUpdated: new Date(),
				category: "internal",
				type: "internal",
			});
		});

		// Transform external links
		externalLinks.forEach((link, index) => {
			transformedApps.push({
				id: `external-${index}`,
				name: link.title,
				description: `External ${link.title} service`,
				icon: link.icon,
				url: link.route,
				status: "online", // External links are assumed to be online
				lastUpdated: new Date(),
				category: "external",
				type: "external",
			});
		});

		return transformedApps;
	});

	// Event handler for opening apps
	const handleOpenApp = (app) => {
		if (app.type === "internal") {
			router.push(app.url);
			announce(`Navigating to ${app.name}`, "polite");
		} else {
			window.open(app.url, "_blank");
			announce(`Opening ${app.name} in new tab`, "polite");
		}
	};
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";

	.modern-card {
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.95) 0%,
			rgba(var(--v-theme-surface), 0.8) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		}
	}

	.links-title {
		background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary-lighten-1)));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.apps-grid {
		.v-col {
			display: flex;
		}
	}

	// Theme-specific enhancements
	.v-theme--dark {
		.modern-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
		}
	}

	.v-theme--light {
		.modern-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
		}
	}

	// Hover effects for better UX
	.apps-grid .v-col:hover {
		transform: translateY(-2px);
		transition: transform 0.2s ease-in-out;
	}
</style>
