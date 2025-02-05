import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("@/views/Home.vue"),
			meta: { publicRoute: true },
		},
		{
			path: "/workdesk",
			component: () => import("@/views/WorkdeskLayout.vue"),
		},
	],
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
