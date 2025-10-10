<template>
	<v-container fluid class="settings-container">
		<!-- Settings Header -->
		<v-row class="mb-6">
			<v-col cols="12">
				<div class="d-flex align-center justify-space-between">
					<div>
						<h1 class="text-h4 font-weight-bold mb-2">Settings</h1>
						<p class="text-body-1 text-medium-emphasis">Manage your application configuration.</p>
					</div>
				</div>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12">
				<v-card class="settings-card" elevation="2">
					<v-tabs
						v-model="activeTab"
						bg-color="transparent"
						color="primary"
						grow
						@update:model-value="handleTabChange"
					>
						<v-tab value="general">
							<v-icon icon="fas fa-cog" class="mr-2" />
							General
						</v-tab>
					</v-tabs>

					<v-divider />

					<v-card-text class="pa-6">
						<v-window v-model="activeTab">
							<v-window-item value="general">
								<div class="general-section">
									<h2 class="text-h6 font-weight-bold mb-4">General Settings</h2>

									<v-form @submit.prevent="handleSaveGeneralSettings">
										<v-row>
											<v-col cols="12" md="6">
												<v-card class="settings-group" elevation="1">
													<v-card-title class="text-subtitle-1 font-weight-bold">
														Appearance
													</v-card-title>
													<v-card-text>
														<v-select
															v-model="generalSettings.theme"
															:items="themeOptions"
															label="Theme"
															variant="outlined"
															density="compact"
															@update:model-value="handleThemeChange"
														/>
														<v-switch
															v-model="generalSettings.compactMode"
															label="Compact mode"
															color="primary"
															hide-details
															@update:model-value="handleCompactModeChange"
														/>
													</v-card-text>
												</v-card>
											</v-col>

											<v-col cols="12" md="6">
												<v-card class="settings-group" elevation="1">
													<v-card-title class="text-subtitle-1 font-weight-bold">
														Notifications
													</v-card-title>
													<v-card-text>
														<v-switch
															v-model="generalSettings.notifications.enabled"
															label="Enable notifications"
															color="primary"
															hide-details
															class="mb-3"
														/>
														<v-switch
															v-model="generalSettings.notifications.sound"
															label="Sound notifications"
															color="primary"
															hide-details
															:disabled="!generalSettings.notifications.enabled"
														/>
													</v-card-text>
												</v-card>
											</v-col>

											<v-col cols="12">
												<v-card class="settings-group" elevation="1">
													<v-card-title class="text-subtitle-1 font-weight-bold">
														Dashboard
													</v-card-title>
													<v-card-text>
														<v-row>
															<v-col cols="12" md="6">
																<v-select
																	v-model="generalSettings.dashboard.defaultView"
																	:items="dashboardViewOptions"
																	label="Default view"
																	variant="outlined"
																	density="compact"
																/>
															</v-col>
															<v-col cols="12" md="6">
																<v-slider
																	v-model="generalSettings.dashboard.refreshInterval"
																	:min="30"
																	:max="300"
																	:step="30"
																	label="Refresh interval (seconds)"
																	thumb-label
																	show-ticks
																/>
															</v-col>
														</v-row>
													</v-card-text>
												</v-card>
											</v-col>
										</v-row>

										<div class="d-flex justify-end mt-6">
											<v-btn
												type="submit"
												color="primary"
												:loading="savingSettings"
												prepend-icon="fas fa-save"
											>
												Save Settings
											</v-btn>
										</div>
									</v-form>
								</div>
							</v-window-item>
						</v-window>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<!-- Success Snackbar -->
		<v-snackbar v-model="showSuccessMessage" color="success" timeout="3000" location="bottom right">
			{{ successMessage }}
			<template #actions>
				<v-btn icon="fas fa-times" @click="showSuccessMessage = false" />
			</template>
		</v-snackbar>
	</v-container>
</template>

<script setup>
	import { ref, computed, onMounted, watch } from "vue";
	import { useTheme } from "vuetify";

	const theme = useTheme();

	// Reactive data
	const activeTab = ref("general");
	const integrationSearch = ref("");
	const integrationsLoading = ref(false);
	const savingSettings = ref(false);
	const showSuccessMessage = ref(false);
	const successMessage = ref("");

	// Integration data
	const integrations = ref([
		{
			id: "teslamate",
			name: "TeslaMate",
			type: "Vehicle Tracking",
			status: "connected",
			lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
			url: "https://teslamate.example.com",
			connecting: false,
		},
		{
			id: "grafana",
			name: "Grafana",
			type: "Monitoring",
			status: "connected",
			lastSeen: new Date(Date.now() - 120000), // 2 minutes ago
			url: "https://grafana.example.com",
			connecting: false,
		},
		{
			id: "homeassistant",
			name: "Home Assistant",
			type: "Home Automation",
			status: "degraded",
			lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
			url: "https://homeassistant.example.com",
			connecting: false,
		},
		{
			id: "nextcloud",
			name: "Nextcloud",
			type: "File Storage",
			status: "disconnected",
			lastSeen: new Date(Date.now() - 86400000), // 1 day ago
			url: "https://nextcloud.example.com",
			connecting: false,
		},
	]);

	// Subdomain data
	const subdomains = ref([
		{
			id: "app",
			name: "Main App",
			url: "app.korder.local",
			icon: "fas fa-home",
			active: true,
		},
		{
			id: "api",
			name: "API Server",
			url: "api.korder.local",
			icon: "fas fa-code",
			active: true,
		},
		{
			id: "docs",
			name: "Documentation",
			url: "docs.korder.local",
			icon: "fas fa-book",
			active: false,
		},
	]);

	// General settings
	const generalSettings = ref({
		theme: "dark",
		compactMode: false,
		notifications: {
			enabled: true,
			sound: false,
		},
		dashboard: {
			defaultView: "grid",
			refreshInterval: 60,
		},
	});

	// Table headers for integrations
	const integrationHeaders = [
		{ title: "Name", key: "name", sortable: true },
		{ title: "Type", key: "type", sortable: true },
		{ title: "Status", key: "status", sortable: true },
		{ title: "Last Seen", key: "lastSeen", sortable: true },
		{ title: "Actions", key: "actions", sortable: false, width: "150px" },
	];

	// Options for dropdowns
	const themeOptions = [
		{ title: "Light", value: "light" },
		{ title: "Dark", value: "dark" },
		{ title: "Auto", value: "auto" },
	];

	const dashboardViewOptions = [
		{ title: "Grid View", value: "grid" },
		{ title: "List View", value: "list" },
		{ title: "Compact View", value: "compact" },
	];

	// Computed properties
	const filteredIntegrations = computed(() => {
		if (!integrationSearch.value) return integrations.value;

		const search = integrationSearch.value.toLowerCase();
		return integrations.value.filter(
			(integration) =>
				integration.name.toLowerCase().includes(search) || integration.type.toLowerCase().includes(search),
		);
	});

	// Utility functions
	const getStatusColor = (status) => {
		switch (status) {
			case "connected":
				return "success";
			case "degraded":
				return "warning";
			case "disconnected":
				return "error";
			default:
				return "grey";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "connected":
				return "fas fa-check-circle";
			case "degraded":
				return "fas fa-circle-exclamation";
			case "disconnected":
				return "fas fa-circle-xmark";
			default:
				return "fas fa-circle-info";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "connected":
				return "Connected";
			case "degraded":
				return "Degraded";
			case "disconnected":
				return "Disconnected";
			default:
				return "Unknown";
		}
	};

	const formatLastSeen = (lastSeen) => {
		if (!lastSeen) return "Never";

		const now = new Date();
		const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return lastSeen.toLocaleDateString();
	};

	const showSuccess = (message) => {
		successMessage.value = message;
		showSuccessMessage.value = true;
	};

	// Event handlers
	const handleTabChange = (tab) => {
		// Save current tab to localStorage for persistence
		localStorage.setItem("korder-settings-tab", tab);
	};

	const handleAddIntegration = () => {
		// TODO: Implement add integration dialog
		console.log("Add integration");
	};

	const handleQuickConnect = async (integration) => {
		integration.connecting = true;
		try {
			// Simulate connection process
			await new Promise((resolve) => setTimeout(resolve, 2000));
			integration.status = "connected";
			integration.lastSeen = new Date();
			showSuccess(`${integration.name} connected successfully!`);
		} catch (error) {
			console.error("Connection failed:", error);
		} finally {
			integration.connecting = false;
		}
	};

	const handleConnect = (integration) => {
		// TODO: Implement connection logic
		console.log("Connect integration:", integration.name);
	};

	const handleDisconnect = (integration) => {
		integration.status = "disconnected";
		showSuccess(`${integration.name} disconnected.`);
	};

	const handleConfigure = (integration) => {
		// TODO: Implement configuration dialog
		console.log("Configure integration:", integration.name);
	};

	const handleViewMetrics = (integration) => {
		// TODO: Implement metrics view
		console.log("View metrics for:", integration.name);
	};

	const handleRemoveIntegration = (integration) => {
		// TODO: Implement confirmation dialog and removal
		console.log("Remove integration:", integration.name);
	};

	const handleAddSubdomain = () => {
		// TODO: Implement add subdomain dialog
		console.log("Add subdomain");
	};

	const handleOpenSubdomain = (subdomain) => {
		window.open(`https://${subdomain.url}`, "_blank");
	};

	const handleEditSubdomain = (subdomain) => {
		// TODO: Implement edit subdomain dialog
		console.log("Edit subdomain:", subdomain.name);
	};

	const handleToggleSubdomain = (subdomain) => {
		subdomain.active = !subdomain.active;
		showSuccess(`${subdomain.name} ${subdomain.active ? "activated" : "deactivated"}.`);
	};

	const handleDeleteSubdomain = (subdomain) => {
		// TODO: Implement confirmation dialog and deletion
		console.log("Delete subdomain:", subdomain.name);
	};

	const handleThemeChange = (newTheme) => {
		theme.global.name.value = newTheme === "auto" ? "dark" : newTheme;
		localStorage.setItem("korder-theme", newTheme);
		showSuccess("Theme updated successfully!");
	};

	const handleCompactModeChange = (compactMode) => {
		localStorage.setItem("korder-compact-mode", compactMode.toString());
		showSuccess("Compact mode updated!");
	};

	const handleSaveGeneralSettings = async () => {
		savingSettings.value = true;
		try {
			// Simulate saving settings
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Save to localStorage
			localStorage.setItem("korder-general-settings", JSON.stringify(generalSettings.value));

			showSuccess("Settings saved successfully!");
		} catch (error) {
			console.error("Failed to save settings:", error);
		} finally {
			savingSettings.value = false;
		}
	};

	// Load settings from localStorage
	const loadSettings = () => {
		// Load active tab
		const savedTab = localStorage.getItem("korder-settings-tab");
		if (savedTab) {
			activeTab.value = savedTab;
		}

		// Load general settings
		const savedSettings = localStorage.getItem("korder-general-settings");
		if (savedSettings) {
			try {
				const parsed = JSON.parse(savedSettings);
				generalSettings.value = { ...generalSettings.value, ...parsed };
			} catch (error) {
				console.error("Failed to parse saved settings:", error);
			}
		}

		// Load theme
		const savedTheme = localStorage.getItem("korder-theme");
		if (savedTheme) {
			generalSettings.value.theme = savedTheme;
		}

		// Load compact mode
		const savedCompactMode = localStorage.getItem("korder-compact-mode");
		if (savedCompactMode) {
			generalSettings.value.compactMode = savedCompactMode === "true";
		}
	};

	// Lifecycle
	onMounted(() => {
		loadSettings();
	});

	// Watch for theme changes
	watch(
		() => generalSettings.value.theme,
		(newTheme) => {
			if (newTheme !== "auto") {
				theme.global.name.value = newTheme;
			}
		},
		{ immediate: true },
	);
</script>

<style scoped lang="scss">
	.settings-container {
		min-height: 100vh;
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	.settings-card {
		border-radius: 12px;
		overflow: hidden;
	}

	.integration-table {
		border-radius: 8px;

		:deep(.v-data-table__wrapper) {
			border-radius: 8px;
		}
	}

	.status-chip {
		font-weight: 500;

		.v-icon {
			margin-right: 4px;
		}
	}

	.subdomain-list {
		.subdomain-item {
			border-radius: 8px;
			margin-bottom: 8px;
			border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

			&--inactive {
				opacity: 0.6;
			}

			&:hover {
				background-color: rgba(var(--v-theme-surface-variant), 0.1);
			}
		}
	}

	.settings-group {
		border-radius: 8px;
		margin-bottom: 1rem;

		.v-card-title {
			padding-bottom: 0;
		}
	}

	// Responsive adjustments
	@media (max-width: 600px) {
		.settings-container {
			padding-top: 1rem;
			padding-bottom: 1rem;
		}

		.d-flex.justify-space-between {
			flex-direction: column;
			gap: 1rem;

			.v-btn {
				align-self: flex-start;
			}
		}
	}

	// Accessibility improvements
	.v-tab:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}

	// Animation for tab transitions
	.v-window-item {
		transition: all 0.3s ease-in-out;
	}

	// Custom scrollbar for long lists
	.subdomain-list {
		max-height: 400px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(var(--v-theme-surface-variant), 0.1);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(var(--v-theme-primary), 0.3);
			border-radius: 3px;

			&:hover {
				background: rgba(var(--v-theme-primary), 0.5);
			}
		}
	}
</style>
