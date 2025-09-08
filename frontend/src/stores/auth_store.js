// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isLoggedIn: false,
		token: null,
	}),
	actions: {
		logIn(token) {
			this.isLoggedIn = true;
			this.token = token;
		},
		logOut() {
			this.isLoggedIn = false;
			this.token = null;
		},
	},
	persist: true,
});
