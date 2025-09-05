import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      // Use the Codespaces URL for WebSocket connection
      clientPort: process.env.CODESPACE_NAME ? 443 : 5173,
      host: process.env.CODESPACE_NAME 
        ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
        : 'localhost'
    }
  },
  define: {
    // Fix for some build issues in Codespaces
    global: 'globalThis',
  },
  resolve: {
    alias: {
      "@marka/": resolve(__dirname, "./src"),
      "@marka/components": resolve(__dirname, "./src/components"),
      "@marka/utils": resolve(__dirname, "./src/utils"),
      "@marka/hooks": resolve(__dirname, "./src/hooks"),
      "@marka/types": resolve(__dirname, "./src/types"),
      "@marka/stores": resolve(__dirname, "./src/stores"),
      "@marka/lib": resolve(__dirname, "./src/lib"),
      "@marka/styles": resolve(__dirname, "./src/styles"),
      "@marka/assets": resolve(__dirname, "./src/assets"),
      "@marka/pages": resolve(__dirname, "./src/pages"),
      "@marka/api": resolve(__dirname, "./src/api"),
    },
  },
});
