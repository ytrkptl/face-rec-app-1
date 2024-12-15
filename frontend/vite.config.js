import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// // https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react()],
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      assetsDir: "",
      manifest: true,
      rollupOptions: {
        input: fileURLToPath(new URL("./src/main.jsx", import.meta.url)),
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) {
              return "css/[name]-[hash][extname]";
            }
            if (assetInfo.name?.endsWith(".woff") || assetInfo.name?.endsWith(".woff2")) {
              return "fonts/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js"
        }
      }
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
