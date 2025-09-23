export default [
	{
		path: "/",
		component: () => import("@/views/Auth.vue"),
		meta: { publicRoute: true },
	},
	{
		path: "/",
		component: () => import("@/views/workdesk/WorkdeskLayout.vue"),
		children: [
			{ path: "workdesk", component: () => import("@/views/workdesk/Dashboard.vue") },
			{
				path: "health",
				component: () => import("@/views/health/Dashboard.vue"),
			},
			{
				path: "habits",
				component: () => import("@/views/habits/Dashboard.vue"),
			},
		],
	},

	{
		path: "/:pathMatch(.*)*",
		component: () => import("@/views/PathNotFound.vue"),
	},
];
