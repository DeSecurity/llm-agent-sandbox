import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { renderStaticFallback, renderStaticHead, staticPages, staticRoutes } from "./src/lib/static-pages";

const GITHUB_PAGES_BASE = "/llm-agent-sandbox/";

function injectStaticContent(html: string, route: string, base: string) {
  const page = staticPages.find((entry) => entry.route === route);
  if (!page) return html;

  const withHead = html
    .replace(/<title>.*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace(/<meta property="og:title"[^>]*>/, "")
    .replace(/<meta property="og:description"[^>]*>/, "")
    .replace("</head>", `${renderStaticHead(page, base)}\n  </head>`);

  return withHead.replace(
    '<div id="root"></div>',
    `<div id="root">${renderStaticFallback(page, base)}</div>`,
  );
}

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
      fs.writeFileSync(indexPath, injectStaticContent(html, "", GITHUB_PAGES_BASE));
      for (const route of staticRoutes) {
        const outDir = path.join(distDir, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), injectStaticContent(html, route, GITHUB_PAGES_BASE));
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
  base: mode === "production" ? GITHUB_PAGES_BASE : "/",
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
