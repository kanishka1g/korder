export const domain = "korder.cloud";

export const appLinks = [
	{
		title: "Teslamate",
		icon: "fas fa-car",
		route: `https://teslamate.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Grafana",
		icon: "fas fa-chart-line",
		route: `https://grafana.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Weight Wave",
		icon: "fas fa-weight-hanging",
		route: `/weight-wave`,
		isExternalLink: false,
	},
	{
		title: "Day Planner",
		icon: "fas fa-calendar",
		route: `/day-planner`,
		isExternalLink: false,
	},
];
