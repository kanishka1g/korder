import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore(
	"app",
	() => {
		// State
		const drawerOpen = ref(false);
		const drawerPersistent = ref(true);
		const currentTheme = ref("dark");
		const searchQuery = ref("");
		const user = ref(null);
		const connectedDB = ref("");

		// Getters
		const isDarkTheme = computed(() => currentTheme.value === "dark");
		const userDisplayName = computed(() => {
			if (!user.value) return "User";
			return user.value.name || user.value.username || "User";
		});
		const userEmail = computed(() => {
			return user.value?.email || "";
		});

		// Actions
		const setDrawerState = (open, persistent = null) => {
			drawerOpen.value = open;
			if (persistent !== null) {
				drawerPersistent.value = persistent;
			}
		};

		const toggleDrawer = () => {
			drawerOpen.value = !drawerOpen.value;
		};

		const setTheme = (theme) => {
			currentTheme.value = theme;
		};

		const toggleTheme = () => {
			currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
		};

		const setUser = (userData) => {
			user.value = userData;
		};

		const setConnectedDB = (db) => {
			connectedDB.value = db;
		};

		const setSearchQuery = (query) => {
			searchQuery.value = query;
		};

		const clearSearch = () => {
			searchQuery.value = "";
		};

		return {
			// State
			drawerOpen,
			drawerPersistent,
			currentTheme,
			searchQuery,
			user,
			connectedDB,

			// Getters
			isDarkTheme,
			userDisplayName,
			userEmail,

			// Actions
			setDrawerState,
			toggleDrawer,
			setTheme,
			toggleTheme,
			setUser,
			setConnectedDB,
			setSearchQuery,
			clearSearch,
		};
	},
	{
		persist: {
			key: "korder-app-state",
			storage: localStorage,
			paths: ["drawerOpen", "drawerPersistent", "currentTheme"],
		},
	},
);
