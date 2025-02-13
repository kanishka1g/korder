import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginVitest from "@vitest/eslint-plugin";
import oxlint from "eslint-plugin-oxlint";
import prettier from "eslint-plugin-prettier";

export default [
	{
		ignores: ["dist/**", "node_modules/**", "**/cypress/**", "html/", "coverage/", "**/dist-ssr/**"],
	},
	js.configs.recommended,
	...pluginVue.configs["flat/recommended"],
	{
		files: ["src/**/__tests__/*"],
		...pluginVitest.configs.recommended,
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
			"vue/component-name-in-template-casing": ["error", "PascalCase", { registeredComponentsOnly: false }],
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
			"vue/html-end-tags": "error",
			"vue/valid-v-slot": ["error", { allowModifiers: true }],

			"prettier/prettier": "error",

			"linebreak-style": ["error", "windows"],
		},
	},
	oxlint.configs["flat/recommended"],
	{
		// Prettier compatibility
		files: ["**/*.{js,jsx,vue}"],
		rules: {
			"arrow-body-style": "off",
			"prefer-arrow-callback": "off",
		},
	},
	prettier.configs.recommended,
];

