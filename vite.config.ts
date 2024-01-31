import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import path from "path";

const env = loadEnv("all", process.cwd(), "");

const PUBLIC_ENVIRONMENT = env.PUBLIC_ENVIRONMENT;

function server(environment: string) {
	if (environment === "DEV") {
		return {
			https: {
				key: fs.readFileSync(`${__dirname}/cert/key.pem`),
				cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
			},
			proxy: {}
		};
	}
}

export default defineConfig({
	plugins: [sveltekit()],
	server: server(PUBLIC_ENVIRONMENT),
	resolve: {
		alias: {
			$styles: path.resolve("src/styles"),
			$assets: path.resolve("src/assets")
		}
	}
});
