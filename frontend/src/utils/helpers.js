export const domain = "korder.cloud";

export const internalLinks = [
	{
		code: "workdesk",
		title: "Health",
		icon: "fas fa-heartbeat",
		route: `/health`,
	},
	{
		code: "habits",
		title: "Habits",
		icon: "fas fa-circle-check",
		route: `/habits`,
	},
];

export const externalLinks = [
	{
		title: "Portainer",
		icon: "fab fa-docker",
		route: `https://portainer.${domain}`,
	},
	{
		title: "Nextcloud",
		icon: "fas fa-cloud",
		route: `https://nextcloud.${domain}`,
	},
	{
		title: "Teslamate",
		icon: "fas fa-car",
		route: `https://tesla.${domain}`,
	},
	{
		title: "Grafana",
		icon: "fas fa-chart-line",
		route: `https://grafana.${domain}`,
	},
	{
		title: "N8N",
		icon: "fas fa-robot",
		route: `https://n8n.${domain}`,
	},
];

export const defaultColors = ["#5C6BC0", "#EC407A", "#FFA726", "#66BB6A", "#42A5F5", "#AB47BC", "#26C6DA"];
