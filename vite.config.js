import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/components": path.resolve(__dirname, "./src/components"),
			"@/api": path.resolve(__dirname, "./src/api"),
			"@/config": path.resolve(__dirname, "./src/config"),
			"@/context": path.resolve(__dirname, "./src/context"),
		},
	},
	server: {
		port: 3000,
	},
});
