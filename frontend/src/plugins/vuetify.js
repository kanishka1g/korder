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
};

const vuetify = createVuetify(vuetifyOptions);

export default vuetify;
