import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import routes from "./routes";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (!to.meta.publicRoute && !authStore.isLoggedIn) {
		next({ path: "/", query: { redirect: to.fullPath } });
	} else {
		next();
	}
});

export default router;
