/**
 * Color contrast validation utilities for WCAG compliance
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (with or without #)
 * @returns {Object} RGB values
 */
export function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}

/**
 * Calculate relative luminance of a color
 * @param {Object} rgb - RGB color object
 * @returns {number} Relative luminance
 */
export function getLuminance(rgb) {
	const { r, g, b } = rgb;

	// Convert to sRGB
	const rsRGB = r / 255;
	const gsRGB = g / 255;
	const bsRGB = b / 255;

	// Apply gamma correction
	const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
	const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
	const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

	// Calculate luminance
	return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);

	if (!rgb1 || !rgb2) {
		throw new Error("Invalid color format");
	}

	const lum1 = getLuminance(rgb1);
	const lum2 = getLuminance(rgb2);

	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);

	return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} level - 'AA' or 'AAA'
 * @param {string} size - 'normal' or 'large'
 * @returns {Object} Compliance result
 */
export function checkWCAGCompliance(foreground, background, level = "AA", size = "normal") {
	const ratio = getContrastRatio(foreground, background);

	let requiredRatio;
	if (level === "AAA") {
		requiredRatio = size === "large" ? 4.5 : 7;
	} else {
		requiredRatio = size === "large" ? 3 : 4.5;
	}

	const passes = ratio >= requiredRatio;

	return {
		ratio: Math.round(ratio * 100) / 100,
		requiredRatio,
		passes,
		level,
		size,
		grade: passes ? "PASS" : "FAIL",
	};
}

/**
 * Get accessible text color for a background
 * @param {string} backgroundColor - Background color (hex)
 * @param {Object} options - Options for text colors
 * @returns {string} Accessible text color
 */
export function getAccessibleTextColor(backgroundColor, options = {}) {
	const { lightColor = "#ffffff", darkColor = "#000000", level = "AA", size = "normal" } = options;

	const lightCompliance = checkWCAGCompliance(lightColor, backgroundColor, level, size);
	const darkCompliance = checkWCAGCompliance(darkColor, backgroundColor, level, size);

	// If both pass, choose the one with higher contrast
	if (lightCompliance.passes && darkCompliance.passes) {
		return lightCompliance.ratio > darkCompliance.ratio ? lightColor : darkColor;
	}

	// Return the one that passes, or the one with higher contrast if neither passes
	if (lightCompliance.passes) return lightColor;
	if (darkCompliance.passes) return darkColor;

	return lightCompliance.ratio > darkCompliance.ratio ? lightColor : darkColor;
}

/**
 * Validate theme colors for WCAG compliance
 * @param {Object} theme - Theme object with colors
 * @returns {Array} Array of validation results
 */
export function validateThemeColors(theme) {
	const results = [];

	// Common color combinations to check
	const combinations = [
		{ fg: theme.primary, bg: theme.background, name: "Primary on Background" },
		{ fg: theme.background, bg: theme.primary, name: "Background on Primary" },
		{ fg: theme.secondary, bg: theme.background, name: "Secondary on Background" },
		{ fg: theme.background, bg: theme.secondary, name: "Background on Secondary" },
		{ fg: theme.error, bg: theme.background, name: "Error on Background" },
		{ fg: theme.success, bg: theme.background, name: "Success on Background" },
		{ fg: theme.warning, bg: theme.background, name: "Warning on Background" },
		{ fg: theme.info, bg: theme.background, name: "Info on Background" },
		{ fg: theme["on-surface"], bg: theme.surface, name: "Text on Surface" },
		{ fg: theme["on-background"], bg: theme.background, name: "Text on Background" },
	];

	combinations.forEach(({ fg, bg, name }) => {
		if (fg && bg) {
			try {
				const normalText = checkWCAGCompliance(fg, bg, "AA", "normal");
				const largeText = checkWCAGCompliance(fg, bg, "AA", "large");

				results.push({
					name,
					foreground: fg,
					background: bg,
					normalText,
					largeText,
					overall: normalText.passes ? "PASS" : largeText.passes ? "LARGE_ONLY" : "FAIL",
				});
			} catch (error) {
				results.push({
					name,
					foreground: fg,
					background: bg,
					error: error.message,
					overall: "ERROR",
				});
			}
		}
	});

	return results;
}

/**
 * Generate accessible color variants
 * @param {string} baseColor - Base color (hex)
 * @param {string} backgroundColor - Background color (hex)
 * @returns {Object} Color variants that meet WCAG standards
 */
export function generateAccessibleVariants(baseColor, backgroundColor) {
	const baseRgb = hexToRgb(baseColor);
	if (!baseRgb) throw new Error("Invalid base color");

	const variants = {};

	// Generate lighter and darker variants
	for (let i = 1; i <= 9; i++) {
		const factor = i / 10;

		// Lighter variant
		const lighterRgb = {
			r: Math.round(baseRgb.r + (255 - baseRgb.r) * factor),
			g: Math.round(baseRgb.g + (255 - baseRgb.g) * factor),
			b: Math.round(baseRgb.b + (255 - baseRgb.b) * factor),
		};

		// Darker variant
		const darkerRgb = {
			r: Math.round(baseRgb.r * (1 - factor)),
			g: Math.round(baseRgb.g * (1 - factor)),
			b: Math.round(baseRgb.b * (1 - factor)),
		};

		const lighterHex = `#${lighterRgb.r.toString(16).padStart(2, "0")}${lighterRgb.g.toString(16).padStart(2, "0")}${lighterRgb.b.toString(16).padStart(2, "0")}`;
		const darkerHex = `#${darkerRgb.r.toString(16).padStart(2, "0")}${darkerRgb.g.toString(16).padStart(2, "0")}${darkerRgb.b.toString(16).padStart(2, "0")}`;

		// Check if variants meet WCAG standards
		try {
			const lighterCompliance = checkWCAGCompliance(lighterHex, backgroundColor);
			const darkerCompliance = checkWCAGCompliance(darkerHex, backgroundColor);

			if (lighterCompliance.passes) {
				variants[`lighter-${i}`] = {
					color: lighterHex,
					compliance: lighterCompliance,
				};
			}

			if (darkerCompliance.passes) {
				variants[`darker-${i}`] = {
					color: darkerHex,
					compliance: darkerCompliance,
				};
			}
		} catch (error) {
			// Skip invalid variants
		}
	}

	return variants;
}

/**
 * Log theme validation results to console
 * @param {Array} results - Validation results from validateThemeColors
 */
export function logThemeValidation(results) {
	console.group("🎨 Theme Color Accessibility Validation");

	const passed = results.filter((r) => r.overall === "PASS").length;
	const largeOnly = results.filter((r) => r.overall === "LARGE_ONLY").length;
	const failed = results.filter((r) => r.overall === "FAIL").length;
	const errors = results.filter((r) => r.overall === "ERROR").length;

	console.log(`✅ Passed: ${passed}`);
	console.log(`⚠️  Large text only: ${largeOnly}`);
	console.log(`❌ Failed: ${failed}`);
	console.log(`🚫 Errors: ${errors}`);

	results.forEach((result) => {
		const icon =
			result.overall === "PASS"
				? "✅"
				: result.overall === "LARGE_ONLY"
					? "⚠️"
					: result.overall === "ERROR"
						? "🚫"
						: "❌";

		console.log(`${icon} ${result.name}:`);
		if (result.error) {
			console.log(`   Error: ${result.error}`);
		} else {
			console.log(`   Normal text: ${result.normalText.ratio}:1 (${result.normalText.grade})`);
			console.log(`   Large text: ${result.largeText.ratio}:1 (${result.largeText.grade})`);
		}
	});

	console.groupEnd();
}

// Export default object with all functions
export default {
	hexToRgb,
	getLuminance,
	getContrastRatio,
	checkWCAGCompliance,
	getAccessibleTextColor,
	validateThemeColors,
	generateAccessibleVariants,
	logThemeValidation,
};
