import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// // https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react()],
    build: {
      outDir: "../public/dist",
      emptyOutDir: true,
      manifest: true
    },
    server: {
      proxy: {
        "/api": {
          target: `https://www.face-rec-app.yatrik.dev/api`
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  };
});
