import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import vitePluginRequire from "vite-plugin-require";

// import dotenv from "dotenv";
// dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: { "process.env": env },
    plugins: [react(), vitePluginRequire.default()],
    server: {
      port: env.VITE_PORT || 3000,
      host: env.VITE_HOST || "localhost",
    },
  };
});
