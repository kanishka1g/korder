import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [vue(), vueDevTools(), vuetify({ autoImport: true })],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 3006,
		allowedHosts: ['korder.cloud']
	},
	build: {
		outDir: "dist", // Ensure the output directory is correct
		assetsDir: "assets", // Ensure static assets are placed in the correct directory
		emptyOutDir: true, // Clear the output directory before building
	},
});

