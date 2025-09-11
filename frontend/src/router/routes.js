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
				path: "weight-wave",
				component: () => import("@/views/weight-wave/Dashboard.vue"),
			},
			{
				path: "day-planner",
				component: () => import("@/views/day_planner/Sample.vue"),
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
