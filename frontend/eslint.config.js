import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginVitest from "@vitest/eslint-plugin";
import oxlint from "eslint-plugin-oxlint";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
	{
		ignores: ["dist/**", "node_modules/**", "**/cypress/**", "html/", "coverage/"],
		files: ["**/*.vue", "**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
	},
	{
		name: "app/files-to-lint",
		files: ["**/*.{js,mjs,jsx,vue}"],
	},
	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
	},

	js.configs.recommended,
	...pluginVue.configs["flat/recommended"],

	{
		...pluginVitest.configs.recommended,
		files: ["src/**/__tests__/*"],
	},
	{
		rules: {
			"vue/component-name-in-template-casing": [
				"error",
				"PascalCase",
				{
					registeredComponentsOnly: false,
					ignores: [],
				},
			],
			"vue/html-self-closing": [
				"error",
				{
					html: {
						component: "always",
						normal: "always",
						void: "always",
					},
				},
			],
			"vue/singleline-html-element-content-newline": "error",
			"vue/multiline-html-element-content-newline": "off",
			"vue/multi-word-component-names": "off",
			"vue/no-boolean-default": "error",
			"vue/no-unused-components": "error",
			"vue/no-unused-vars": "error",
			"vue/no-use-v-if-with-v-for": "error",
			"vue/prop-name-casing": "error",
			"linebreak-style": ["error", "windows"],
			"vue/html-end-tags": "error",
			"vue/valid-v-slot": [
				"error",
				{
					allowModifiers: true,
				},
			],
		},
	},

	oxlint.configs["flat/recommended"],
	skipFormatting,
];

