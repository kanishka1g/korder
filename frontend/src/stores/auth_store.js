// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isLoggedIn: false,
	}),
	actions: {
		logIn() {
			this.isLoggedIn = true;
		},
		logOut() {
			this.isLoggedIn = false;
		},
	},
	persist: true,
});

