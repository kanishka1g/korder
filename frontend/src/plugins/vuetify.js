import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import DayJsAdapter from "@date-io/dayjs";
import enAU from "date-fns/locale/en-AU";

const fieldDefaults = {
	variant: "outlined",
	density: "compact",
	hideDetails: "auto",
};

const vuetifyOptions = {
	icons: {
		defaultSet: "fa",
		aliases,
		sets: {
			fa,
		},
	},
	defaults: {
		VTextField: fieldDefaults,
		VTextarea: fieldDefaults,
		VSelect: fieldDefaults,
		VAutocomplete: fieldDefaults,
	},
	date: {
		adapter: DayJsAdapter,
		locale: {
			en: enAU,
		},
	},
	theme: {
		defaultTheme: "dark",
		themes: {
			dark: {
				dark: true,
				colors: {
					primary: "#7fa6d2ff",
					secondary: "#D2B87F",
					accent: "#B87FD2",
					error: "#D27F7F",
					success: "#7FD27F",
					info: "#7F9FD2",
					warning: "#D2A87F",

					sidebar: "#2C2C2C",
					cardBg: "#1F1F1F",
					highlight: "#A88FD2",
				},
			},
		},
	},
};

const vuetify = createVuetify(vuetifyOptions);

export default vuetify;
