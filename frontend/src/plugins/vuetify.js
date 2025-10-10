import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import DayJsAdapter from "@date-io/dayjs";
import enAU from "date-fns/locale/en-AU";
import designTokens from "../design-tokens.json";
import { validateThemeColors, logThemeValidation } from "../utils/colorContrast.js";

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
			light: {
				dark: false,
				colors: {
					// Primary colors using design tokens
					primary: designTokens.color.primary[900], // Deep indigo
					"primary-lighten-1": designTokens.color.primary[800],
					"primary-lighten-2": designTokens.color.primary[700],
					"primary-darken-1": designTokens.color.primary[950],

					// Secondary colors (maintaining existing for compatibility)
					secondary: designTokens.color.secondary[600],
					"secondary-lighten-1": designTokens.color.secondary[500],
					"secondary-darken-1": designTokens.color.secondary[700],

					// Accent colors using teal/cyan
					accent: designTokens.color.accent[600],
					"accent-lighten-1": designTokens.color.accent[500],
					"accent-darken-1": designTokens.color.accent[700],

					// Status colors
					error: designTokens.color.error[500],
					"error-lighten-1": designTokens.color.error[400],
					"error-darken-1": designTokens.color.error[600],

					success: designTokens.color.success[500],
					"success-lighten-1": designTokens.color.success[400],
					"success-darken-1": designTokens.color.success[600],

					warning: designTokens.color.warning[500],
					"warning-lighten-1": designTokens.color.warning[400],
					"warning-darken-1": designTokens.color.warning[600],

					info: designTokens.color.info[500],
					"info-lighten-1": designTokens.color.info[400],
					"info-darken-1": designTokens.color.info[600],

					// Surface colors
					background: designTokens.color.surface.light.primary,
					surface: designTokens.color.surface.light.secondary,
					"surface-variant": designTokens.color.surface.light.tertiary,
					"on-surface-variant": designTokens.color.text.light.secondary,

					// Text colors
					"on-background": designTokens.color.text.light.primary,
					"on-surface": designTokens.color.text.light.primary,
					"on-primary": designTokens.color.surface.light.primary,
					"on-secondary": designTokens.color.surface.light.primary,
					"on-accent": designTokens.color.surface.light.primary,
					"on-error": designTokens.color.surface.light.primary,
					"on-success": designTokens.color.surface.light.primary,
					"on-warning": designTokens.color.surface.light.primary,
					"on-info": designTokens.color.surface.light.primary,
				},
			},
			dark: {
				dark: true,
				colors: {
					// Primary colors using design tokens
					primary: designTokens.color.primary[600], // Lighter for dark theme
					"primary-lighten-1": designTokens.color.primary[500],
					"primary-lighten-2": designTokens.color.primary[400],
					"primary-darken-1": designTokens.color.primary[700],

					// Secondary colors (maintaining existing for compatibility)
					secondary: "#403f3eff", // Keep existing for backward compatibility
					"secondary-lighten-1": designTokens.color.secondary[400],
					"secondary-darken-1": designTokens.color.secondary[600],

					// Accent colors using teal/cyan
					accent: designTokens.color.accent[400], // Lighter for dark theme
					"accent-lighten-1": designTokens.color.accent[300],
					"accent-darken-1": designTokens.color.accent[500],

					// Status colors (adjusted for dark theme)
					error: designTokens.color.error[400],
					"error-lighten-1": designTokens.color.error[300],
					"error-darken-1": designTokens.color.error[500],

					success: designTokens.color.success[400],
					"success-lighten-1": designTokens.color.success[300],
					"success-darken-1": designTokens.color.success[500],

					warning: designTokens.color.warning[400],
					"warning-lighten-1": designTokens.color.warning[300],
					"warning-darken-1": designTokens.color.warning[500],

					info: designTokens.color.info[400],
					"info-lighten-1": designTokens.color.info[300],
					"info-darken-1": designTokens.color.info[500],

					// Surface colors
					background: designTokens.color.surface.dark.primary,
					surface: designTokens.color.surface.dark.secondary,
					"surface-variant": designTokens.color.surface.dark.tertiary,
					"on-surface-variant": designTokens.color.text.dark.secondary,

					// Text colors
					"on-background": designTokens.color.text.dark.primary,
					"on-surface": designTokens.color.text.dark.primary,
					"on-primary": designTokens.color.surface.dark.primary,
					"on-secondary": designTokens.color.text.dark.primary,
					"on-accent": designTokens.color.surface.dark.primary,
					"on-error": designTokens.color.surface.dark.primary,
					"on-success": designTokens.color.surface.dark.primary,
					"on-warning": designTokens.color.surface.dark.primary,
					"on-info": designTokens.color.surface.dark.primary,
				},
			},
		},
	},
};

const vuetify = createVuetify(vuetifyOptions);

// Validate theme colors for accessibility compliance in development
if (import.meta.env.DEV && import.meta.env.VITE_SHOW_ACCESSIBILITY_LOGS === "true") {
	// Only show validation if there are issues or if explicitly requested
	const lightThemeResults = validateThemeColors(vuetifyOptions.theme.themes.light.colors);
	const darkThemeResults = validateThemeColors(vuetifyOptions.theme.themes.dark.colors);

	const lightIssues = lightThemeResults.filter((r) => r.overall === "FAIL" || r.overall === "ERROR").length;
	const darkIssues = darkThemeResults.filter((r) => r.overall === "FAIL" || r.overall === "ERROR").length;

	if (lightIssues > 0 || darkIssues > 0) {
		console.log("🌞 Light Theme Validation:");
		logThemeValidation(lightThemeResults);
		console.log("🌙 Dark Theme Validation:");
		logThemeValidation(darkThemeResults);
	} else {
		console.log("✅ Theme accessibility validation passed for both light and dark themes");
	}
}

export default vuetify;
