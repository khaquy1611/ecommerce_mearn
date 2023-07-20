import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fileNames = ["src", "components", "assets", "axios", "hooks", "pages", "store", "ultils", "api"];
const filePaths = fileNames.reduce((acc, cur) => ({
  ...acc,
  [cur]: `/${cur === "src" ? cur : "src/" + cur}`,
}));
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", ""),
      },
    },
  },
  resolve: {
    alias: {
      ...filePaths,
    },
  },
  plugins: [react()],
});
