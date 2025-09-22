import { defineStore } from "pinia";
import { updateUser } from "@/utils/user.js";
import router from "@/router";

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
			updateUser(null);
			router.push("/");
		},
	},
	persist: true,
});
