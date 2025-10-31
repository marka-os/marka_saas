import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5000, // Replit requires port 5000 for frontend
    strictPort: true, // Ensure port 5000 is used
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
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
    dedupe: ["react", "react-dom"],
  },
});
