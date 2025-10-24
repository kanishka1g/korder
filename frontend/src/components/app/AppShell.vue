<template>
	<VApp>
		<VAppBar :elevation="2" color="surface" density="comfortable" class="app-shell-bar" role="banner" tag="header">
			<VAppBarNavIcon
				@click="toggleDrawer"
				:icon="drawer ? 'fas fa-times' : 'fas fa-bars'"
				class="mr-2"
				:aria-label="drawer ? 'Close navigation menu' : 'Open navigation menu'"
				:aria-expanded="drawer.toString()"
				aria-controls="navigation-drawer"
			/>

			<div class="app-title">
				<VAppBarTitle class="text-h6 font-weight-bold"> Korder </VAppBarTitle>
			</div>

			<VAlert v-if="connectedDB" type="warning" variant="tonal" density="compact" class="mx-5">
				you are connected to the
				<span class="font-weight-black"> {{ connectedDB }} </span>
				database
			</VAlert>
			<VSpacer v-else />

			<VTextField
				v-model="searchQuery"
				:placeholder="searchPlaceholder"
				prepend-inner-icon="fas fa-search"
				variant="outlined"
				density="compact"
				hide-details
				clearable
				class="search-field mx-4"
				style="max-width: 400px"
				@keydown="handleSearchKeydown"
				@focus="showSearchResults = true"
				@blur="hideSearchResults"
				:aria-label="searchPlaceholder"
				:aria-expanded="showSearchResults.toString()"
				aria-controls="search-results"
				role="combobox"
				aria-autocomplete="list"
				:aria-activedescendant="selectedSearchIndex >= 0 ? `search-result-${selectedSearchIndex}` : undefined"
			>
				<!-- Search Results Dropdown -->
				<VMenu
					v-model="showSearchResults"
					:close-on-content-click="false"
					activator="parent"
					offset="8"
					max-width="400"
				>
					<VCard
						v-if="filteredApps.length > 0 || filteredFeatures.length > 0"
						id="search-results"
						role="listbox"
						:aria-label="`${totalSearchResults} search results available`"
					>
						<VList density="compact" role="none">
							<!-- Apps Section -->
							<template v-if="filteredApps.length > 0">
								<VListSubheader role="presentation">Apps</VListSubheader>
								<VListItem
									v-for="(app, index) in filteredApps"
									:key="`app-${app.code}`"
									:id="`search-result-${index}`"
									:class="{ 'v-list-item--active': selectedSearchIndex === index }"
									@click="openApp(app)"
									role="option"
									:aria-selected="selectedSearchIndex === index"
									:tabindex="selectedSearchIndex === index ? 0 : -1"
								>
									<template #prepend>
										<VIcon :icon="app.icon" size="small" :aria-hidden="true" />
									</template>
									<VListItemTitle>{{ app.title }}</VListItemTitle>
									<VListItemSubtitle>{{ app.description || "External app" }}</VListItemSubtitle>
								</VListItem>
							</template>

							<!-- Features Section -->
							<template v-if="filteredFeatures.length > 0">
								<VDivider v-if="filteredApps.length > 0" role="presentation" />
								<VListSubheader role="presentation">Features</VListSubheader>
								<VListItem
									v-for="(feature, index) in filteredFeatures"
									:key="`feature-${feature.code}`"
									:id="`search-result-${filteredApps.length + index}`"
									:class="{
										'v-list-item--active': selectedSearchIndex === filteredApps.length + index,
									}"
									@click="navigateToFeature(feature)"
									role="option"
									:aria-selected="selectedSearchIndex === filteredApps.length + index"
									:tabindex="selectedSearchIndex === filteredApps.length + index ? 0 : -1"
								>
									<template #prepend>
										<VIcon :icon="feature.icon" size="small" :aria-hidden="true" />
									</template>
									<VListItemTitle>{{ feature.title }}</VListItemTitle>
									<VListItemSubtitle>{{ feature.description }}</VListItemSubtitle>
								</VListItem>
							</template>
						</VList>
					</VCard>
					<VCard v-else-if="searchQuery.length > 0" id="search-results" role="status">
						<VCardText class="text-center text-medium-emphasis">
							No results found for "{{ searchQuery }}"
						</VCardText>
					</VCard>
				</VMenu>
			</VTextField>
			<!-- TODO: redirect to debug page -->
			<VBtn
				icon="fas fa-bug"
				variant="text"
				title=" Go to Debug page"
				@click="
					() => {
						console.error('needs to implement');
					}
				"
			/>

			<VBtn
				:icon="isDark ? 'fas fa-sun' : 'fas fa-moon'"
				variant="text"
				@click="toggleTheme"
				:aria-label="`Switch to ${isDark ? 'light' : 'dark'} theme`"
				:title="`Switch to ${isDark ? 'light' : 'dark'} theme`"
			/>

			<ProfileMenu @profile-action="handleProfileAction" aria-label="User menu" />
		</VAppBar>

		<!-- Navigation Drawer -->
		<VNavigationDrawer
			v-model="drawer"
			:permanent="mdAndUp && drawerPersistent"
			:temporary="!mdAndUp || !drawerPersistent"
			color="surface"
			class="app-shell-drawer"
			id="navigation-drawer"
			role="navigation"
			:aria-label="drawer ? 'Main navigation (open)' : 'Main navigation (closed)'"
		>
			<!-- Internal Navigation -->
			<nav id="navigation" aria-label="Main navigation">
				<VList density="compact" class="mb-4" role="none">
					<VListSubheader role="presentation">Navigation</VListSubheader>
					<VListItem prepend-icon="fas fa-home" title="Workdesk" to="/workdesk" exact role="none">
						<template #prepend>
							<VIcon icon="fas fa-home" :aria-hidden="true" />
						</template>
					</VListItem>
					<template v-if="internalLinks.length > 0">
						<VListSubheader role="presentation">Features</VListSubheader>
						<VListItem
							v-for="item in internalLinks"
							:key="item.code"
							:prepend-icon="item.icon"
							:title="item.title"
							:to="item.route"
							role="none"
						>
							<template #prepend>
								<VIcon :icon="item.icon" :aria-hidden="true" />
							</template>
						</VListItem>
					</template>
				</VList>
			</nav>

			<!-- External Apps -->
			<template v-if="externalLinks.length > 0">
				<VDivider class="mb-4" role="presentation" />
				<VList density="compact" role="none">
					<VListSubheader role="presentation">External Apps</VListSubheader>
					<VListItem
						v-for="item in externalLinks"
						:key="item.title"
						:prepend-icon="item.icon"
						:title="item.title"
						:href="item.route"
						target="_blank"
						role="none"
						:aria-label="`${item.title} (opens in new tab)`"
					>
						<template #prepend>
							<VIcon :icon="item.icon" :aria-hidden="true" />
						</template>
						<template #append>
							<VIcon icon="fas fa-external-link-alt" size="x-small" :aria-hidden="true" />
						</template>
					</VListItem>
				</VList>
			</template>
		</VNavigationDrawer>

		<!-- Main Content Area -->
		<VMain class="app-shell-main" role="main" id="main-content" tabindex="-1">
			<!-- Development Database Warning -->

			<!-- Router View -->
			<RouterView />
		</VMain>
		<GenericSnackbar />
		<GenericConfirmation />

		<!-- Loading Overlay -->
		<VOverlay v-model="loading.isLoading.value" class="align-center justify-center" persistent>
			<VProgressCircular color="primary" size="70" width="7" indeterminate />
		</VOverlay>
	</VApp>
</template>

<script setup>
	import { ref, computed, onMounted, watch } from "vue";
	import { useRouter } from "vue-router";
	import { useTheme, useDisplay } from "vuetify";

	import { internalLinks, externalLinks } from "@/utils/helpers";
	import { useLoading } from "@/utils/loading";
	import request from "@/utils/request";
	import { updateUser } from "@/utils/user";
	import ProfileMenu from "./ProfileMenu.vue";
	import { useAccessibility } from "@/composables/useAccessibility";

	import GenericSnackbar from "@/components/app/GenericSnackbar.vue";
	import GenericConfirmation from "@/components/app/GenericConfirmation.vue";
	// Composables
	const router = useRouter();
	const theme = useTheme();
	const { mdAndUp } = useDisplay();
	const loading = useLoading();
	const { announce, handleKeyboardNavigation } = useAccessibility();

	const drawer = ref(false);
	const drawerPersistent = ref(true);
	const searchQuery = ref("");
	const showSearchResults = ref(false);
	const selectedSearchIndex = ref(-1);
	const connectedDB = ref("");

	const isDark = computed(() => theme.global.current.value.dark);

	const searchPlaceholder = computed(() => {
		return mdAndUp.value ? "Search apps and features..." : "Search...";
	});

	// Search functionality
	const allApps = computed(() =>
		externalLinks.map((link) => ({
			...link,
			code: link.title.toLowerCase().replace(/\s+/g, "-"),
			description: "External application",
			type: "external",
		})),
	);

	const allFeatures = computed(() => [
		{
			code: "workdesk",
			title: "Workdesk",
			icon: "fas fa-home",
			route: "/workdesk",
			description: "Main workdesk view",
			type: "internal",
		},
		...internalLinks.map((link) => ({
			...link,
			description: "Internal feature",
			type: "internal",
		})),
	]);

	const filteredApps = computed(() => {
		if (!searchQuery.value) return [];
		const query = searchQuery.value.toLowerCase();
		return allApps.value
			.filter(
				(app) =>
					app.title.toLowerCase().includes(query) ||
					(app.description && app.description.toLowerCase().includes(query)),
			)
			.slice(0, 5);
	});

	const filteredFeatures = computed(() => {
		if (!searchQuery.value) return [];
		const query = searchQuery.value.toLowerCase();
		return allFeatures.value
			.filter(
				(feature) =>
					feature.title.toLowerCase().includes(query) ||
					(feature.description && feature.description.toLowerCase().includes(query)),
			)
			.slice(0, 5);
	});

	const totalSearchResults = computed(() => filteredApps.value.length + filteredFeatures.value.length);

	const DRAWER_STATE_KEY = "korder-drawer-state";
	const DRAWER_PERSISTENT_KEY = "korder-drawer-persistent";

	// Methods
	const toggleDrawer = () => {
		drawer.value = !drawer.value;
		saveDrawerState();
	};

	const toggleTheme = () => {
		const newTheme = isDark.value ? "light" : "dark";
		theme.global.name.value = newTheme;
		localStorage.setItem("korder-theme", newTheme);
		announce(`Switched to ${newTheme} theme`, "polite");
	};

	const saveDrawerState = () => {
		localStorage.setItem(DRAWER_STATE_KEY, JSON.stringify(drawer.value));
		localStorage.setItem(DRAWER_PERSISTENT_KEY, JSON.stringify(drawerPersistent.value));
	};

	const loadDrawerState = () => {
		try {
			const savedDrawerState = localStorage.getItem(DRAWER_STATE_KEY);
			const savedPersistentState = localStorage.getItem(DRAWER_PERSISTENT_KEY);

			if (savedDrawerState !== null) {
				drawer.value = JSON.parse(savedDrawerState);
			} else {
				// Default behavior: open on desktop, closed on mobile
				drawer.value = mdAndUp.value;
			}

			if (savedPersistentState !== null) {
				drawerPersistent.value = JSON.parse(savedPersistentState);
			}
		} catch (error) {
			console.warn("Failed to load drawer state:", error);
			drawer.value = mdAndUp.value;
		}
	};

	// Search functionality
	const handleSearchKeydown = (event) => {
		const totalResults = filteredApps.value.length + filteredFeatures.value.length;
		const allResults = [...filteredApps.value, ...filteredFeatures.value];

		const newIndex = handleKeyboardNavigation(event, allResults, selectedSearchIndex.value, (item, index) => {
			if (index < filteredApps.value.length) {
				openApp(item);
			} else {
				navigateToFeature(item);
			}
		});

		if (newIndex !== selectedSearchIndex.value) {
			selectedSearchIndex.value = newIndex;

			// Announce current selection to screen readers
			if (newIndex >= 0 && allResults[newIndex]) {
				const item = allResults[newIndex];
				const type = newIndex < filteredApps.value.length ? "app" : "feature";
				announce(`${item.title} ${type}, ${newIndex + 1} of ${totalResults}`, "polite");
			}
		}

		// Handle escape key
		if (event.key === "Escape") {
			showSearchResults.value = false;
			selectedSearchIndex.value = -1;
			announce("Search closed", "polite");
		}
	};

	const hideSearchResults = () => {
		// Delay hiding to allow click events to fire
		setTimeout(() => {
			showSearchResults.value = false;
			selectedSearchIndex.value = -1;
		}, 200);
	};

	const openApp = (app) => {
		if (app.type === "external") {
			window.open(app.route, "_blank");
			announce(`Opening ${app.title} in new tab`, "polite");
		} else {
			router.push(app.route);
			announce(`Navigating to ${app.title}`, "polite");
		}
		searchQuery.value = "";
		showSearchResults.value = false;
		selectedSearchIndex.value = -1;
	};

	const navigateToFeature = (feature) => {
		router.push(feature.route);
		announce(`Navigating to ${feature.title}`, "polite");
		searchQuery.value = "";
		showSearchResults.value = false;
		selectedSearchIndex.value = -1;
	};

	// ProfileMenu event handlers
	const handleProfileAction = (action) => {
		console.log("Profile action:", action);
		// Handle different profile actions as needed
		// The ProfileMenu component handles navigation internally
	};

	const showHelp = () => {
		// TODO: Implement help system
		console.log("Show help");
	};

	// Initialize app data
	const initializeApp = async () => {
		try {
			const [responseMe, responseConnectedDB] = await Promise.all([
				request.get("users/me"),
				request.get("/meta/verify"),
			]);

			connectedDB.value = responseConnectedDB.data;
			updateUser(responseMe.data);
		} catch (error) {
			console.warn("Failed to initialize app data:", error);
			if (error.response?.status === 404) {
				try {
					// Try to logout using auth store
					const { useAuthStore } = await import("@/stores/auth_store");
					const authStore = useAuthStore();
					authStore.logOut();
				} catch (storeError) {
					console.warn("Failed to access auth store, redirecting manually:", storeError);
					router.push("/");
				}
			}
		}
	};

	// Lifecycle hooks
	onMounted(() => {
		loadDrawerState();
		initializeApp();
		watchReauth();

		// Load saved theme
		const savedTheme = localStorage.getItem("korder-theme");
		if (savedTheme) {
			theme.global.name.value = savedTheme;
		}
	});

	// Watch for responsive changes
	watch(mdAndUp, (newValue) => {
		if (newValue && drawerPersistent.value) {
			drawer.value = true;
		}
		saveDrawerState();
	});

	// Watch drawer changes for persistence
	watch(
		[drawer, drawerPersistent],
		() => {
			saveDrawerState();
		},
		{ deep: true },
	);

	// Watch for re-authentication requests
	const watchReauth = async () => {
		try {
			const { useAuthStore } = await import("@/stores/auth_store");
			const authStore = useAuthStore();

			watch(
				() => authStore.needsReauth,
				(needsReauth) => {
					if (needsReauth && !showReauthDialog.value) {
						showReauthDialog.value = true;
						announce("Session expired. Please re-authenticate.", "assertive");
					}
				},
				{ immediate: true },
			);
		} catch (error) {
			console.warn("Failed to set up re-auth watcher:", error);
		}
	};
</script>

<style scoped lang="scss">
	.app-title {
		color: inherit;
		text-decoration: none;
		font-family: "Noto Serif Variable", serif;

		&:hover {
			text-decoration: none;
		}
	}

	.search-field {
		transition: all 0.2s ease;

		&:focus-within {
			transform: scale(1.02);
		}
	}

	.app-shell-bar {
		backdrop-filter: blur(8px);
		border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
	}

	.app-shell-drawer {
		border-right: 1px solid rgba(var(--v-border-color), 0.12);
	}

	.app-shell-main {
		background-color: rgb(var(--v-theme-background));
		min-height: 100vh;
	}

	.user-menu-btn {
		transition: all 0.2s ease;

		&:hover {
			transform: scale(1.1);
		}
	}

	// Search results styling
	.v-list-item--active {
		background-color: rgba(var(--v-theme-primary), 0.1);
	}

	// Responsive adjustments
	@media (max-width: 960px) {
		.search-field {
			max-width: 200px !important;
		}
	}

	@media (max-width: 600px) {
		.search-field {
			max-width: 150px !important;
		}
	}
</style>
