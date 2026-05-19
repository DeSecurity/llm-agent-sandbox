import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Routes that must be reachable by direct URL on GitHub Pages.
// Keep in sync with src/App.tsx <Routes>.
const STATIC_ROUTES = [
  "logs",
  "stage/1-user-agent",
  "stage/2-white-text",
  "stage/3-html-comment",
  "stage/4-js-dom",
  "stage/5-metadata",
  "stage/6-jsonld",
  "stage/7-css-content",
  "stage/8-comments-section",
  "stage/9-reasoning-trap",
  "stage/10-tool-hijack",
  "stage/11-persistence",
];

// Pre-render each route to its own index.html so GitHub Pages returns HTTP 200
// for direct deep-link requests (crawlers, curl, LLM agents that don't run the
// 404.html JS redirect shim).
function prerenderRoutes(): Plugin {
  return {
    name: "prerender-spa-routes",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, "utf8");
      for (const route of STATIC_ROUTES) {
        const outDir = path.join(distDir, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html);
      }
      // Ensure GitHub Pages does not run Jekyll (it would hide files/folders
      // starting with underscore, and is unnecessary for a Vite build).
      fs.writeFileSync(path.join(distDir, ".nojekyll"), "");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this project under /llm-agent-sandbox/.
  // Use a relative base in dev (Lovable preview) and the repo path in production builds.
  base: mode === "production" ? "/llm-agent-sandbox/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && prerenderRoutes(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
