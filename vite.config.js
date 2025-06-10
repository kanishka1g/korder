import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vuetify from "vite-plugin-vuetify";

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
		host: "0.0.0.0",
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		emptyOutDir: true,
	},
});

