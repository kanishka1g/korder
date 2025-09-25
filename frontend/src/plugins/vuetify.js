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
					primary: "#4A90E2",
					secondary: "#403f3eff",
					accent: "#BD93F9",

					error: "#E57373",
					success: "#81C784",
					warning: "#FFB74D",
					info: "#64B5F6",
				},
			},
		},
	},
};

const vuetify = createVuetify(vuetifyOptions);

export default vuetify;
