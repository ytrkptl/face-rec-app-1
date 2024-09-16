import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode}) => {

	// Load environment variables from .env files
	// eslint-disable-next-line no-undef
	const env = loadEnv(mode, process.cwd());


	return {
		plugins: [react()],
		server: {
			proxy: {
				"/api": {
					target: env.VITE_API_URL,
				}
			}
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url))
			}
		}
	}
})
