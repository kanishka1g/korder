import { defineStore } from "pinia";
import { updateUser } from "@/utils/user.js";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isLoggedIn: false,
		token: null,
		needsReauth: false,
	}),
	actions: {
		logIn(token) {
			this.isLoggedIn = true;
			this.token = token;
			this.needsReauth = false;
		},
		logOut() {
			this.isLoggedIn = false;
			this.token = null;
			this.needsReauth = false;
			updateUser(null);
			router.push("/");
		},
		requestReauth() {
			this.needsReauth = true;
		},
		clearReauthRequest() {
			this.needsReauth = false;
		},
	},
	persist: true,
});
