export const domain = "korder.cloud";

export const appLinks = [
	{
		title: "Portainer",
		icon: "fab fa-docker",
		route: `https://portainer.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Nextcloud",
		icon: "fas fa-cloud",
		route: `https://nextcloud.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Teslamate",
		icon: "fas fa-car",
		route: `https://tesla.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Grafana",
		icon: "fas fa-chart-line",
		route: `https://grafana.${domain}`,
		isExternalLink: true,
	},
	{
		title: "N8N",
		icon: "fas fa-robot",
		route: `https://n8n.${domain}`,
		isExternalLink: true,
	},
	{
		title: "Weight Wave",
		icon: "fas fa-weight-hanging",
		route: `/weight-wave`,
		isExternalLink: false,
	},
	{
		title: "Habits",
		icon: "fas fa-circle-check",
		route: `/habits`,
		isExternalLink: false,
	},
];
