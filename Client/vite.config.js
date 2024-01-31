import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// why does the proxy not working??
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
      secure: false,
    },
  },
});
