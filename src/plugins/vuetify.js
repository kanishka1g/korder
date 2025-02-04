import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, fa } from "vuetify/iconsets/fa-svg";

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
};

const vuetify = createVuetify(vuetifyOptions);

export default vuetify;
