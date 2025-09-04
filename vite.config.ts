import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 443, 
      host: 'bug-free-barnacle-qwqw4ggg9gr249rj-5173.app.github.dev'
    }
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
