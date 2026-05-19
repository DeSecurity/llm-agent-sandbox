# LLM Agent Sandbox — Prompt Injection Test Lab

A fully client-side React/Vite single-page application that hosts a curated set of **prompt-injection techniques** for testing LLM agents, automated browsers, crawlers, and other non-human web clients. Each stage embeds a different injection vector on an otherwise ordinary-looking page so you can probe what an agent will and will not obey, and inspect the resulting telemetry locally.

> No network calls leave the browser. No backend. No tracking. All logs live in `localStorage`.

---

## What this project solves

LLM-based agents browse the web on behalf of users. They read DOM text, alt attributes, metadata, JSON-LD, CSS-injected content, comments, and tool descriptions — and they can be manipulated through any of those surfaces. This sandbox provides a reproducible test bench:

- A safe, isolated environment to demonstrate prompt-injection techniques.
- One technique per page, so behavior can be attributed cleanly.
- A dashboard that lists every stage, its intent, the success token, and a copy-to-clipboard helper.
- A local logger and client-side user-agent classifier (`llm-agent` vs `human`) so you can correlate what the visitor saw with what they did.

It is intended for **security research, red-team exercises, agent evaluation, and educational demos**.

---

## Key features

- **11 injection stages**, each isolating a single technique (user-agent sniffing, white-text instructions, HTML comments, JS/DOM injection, metadata, JSON-LD, CSS `content`, fake comments section, reasoning trap, tool hijack, persistence).
- **Dashboard** listing every stage with its intent, success token, and a "Copy Token" button.
- **Logs page** that records navigations and stage events to `localStorage`, with a clear-logs control.
- **UA classification badge** in the header (client-side heuristic, `llm-agent` or `human`).
- **Build-time static HTML snapshots** for every route, so deep links (`/stage/3-html-comment`, etc.) return real HTTP 200 HTML to non-JS clients — crawlers and LLM fetchers see the stage content without executing JavaScript.
- **GitHub Pages deployment** via GitHub Actions, configured for the `/llm-agent-sandbox/` base path.
- **Zero external services**: no backend, no analytics, no telemetry.

---

## Tech stack

- **Framework:** React 18 + TypeScript 5
- **Build tool:** Vite 5 (`@vitejs/plugin-react-swc`)
- **Routing:** `react-router-dom` v6 (`BrowserRouter` with `basename`)
- **Styling:** Tailwind CSS 3 + `tailwindcss-animate` + `@tailwindcss/typography`
- **UI primitives:** shadcn/ui on top of Radix UI
- **State / data:** `@tanstack/react-query`
- **Forms / validation:** `react-hook-form` + `zod`
- **Icons:** `lucide-react`
- **Toasts:** `sonner`
- **Testing:** Vitest + Testing Library + jsdom; Playwright config present for browser tests
- **Linting:** ESLint 9 with `typescript-eslint`
- **Hosting:** GitHub Pages (static)

---

## Screenshots

> Placeholder — add screenshots of the Dashboard, a stage page, and the Logs view here.

```
docs/screenshots/dashboard.png
docs/screenshots/stage-3-html-comment.png
docs/screenshots/logs.png
```

---

## Project structure

```
.
├── .github/workflows/deploy.yml      # GitHub Pages CI/CD
├── index.html                        # SPA shell + meta tags + GH Pages SPA redirect shim
├── public/
│   ├── 404.html                      # GH Pages SPA fallback (redirects to index.html)
│   ├── favicon.png, og-image.jpg, icon-*.png, apple-touch-icon.png
│   ├── site.webmanifest
│   └── robots.txt
├── src/
│   ├── App.tsx                       # Router + providers
│   ├── main.tsx                      # React entrypoint
│   ├── index.css                     # Tailwind layer + design tokens
│   ├── components/
│   │   ├── Layout.tsx                # Header + nav + UA badge
│   │   ├── StageLayout.tsx           # Shared stage wrapper
│   │   └── ui/                       # shadcn/ui primitives
│   ├── pages/
│   │   ├── Dashboard.tsx             # Lists every stage + tokens
│   │   ├── Logs.tsx                  # Local log viewer
│   │   ├── NotFound.tsx
│   │   └── stages/Stage1.tsx … Stage11.tsx
│   └── lib/
│       ├── stages.ts                 # Stage metadata (id, slug, intent, token)
│       ├── classifier.ts             # Client-side UA classification
│       ├── logger.ts                 # localStorage logger
│       └── static-pages.ts           # HTML snapshots injected at build time
├── vite.config.ts                    # Includes prerenderRoutes plugin
├── tailwind.config.ts
├── playwright.config.ts              # Playwright test runner config
└── vitest.config.ts
```

---

## Prerequisites

- **Node.js** ≥ 18 (Node 20 LTS recommended)
- **npm** ≥ 9 (the repo ships a `package-lock.json`; npm is the canonical package manager)
- A modern browser for the preview

---

## Installation

```bash
git clone https://github.com/<your-org>/llm-agent-sandbox.git
cd llm-agent-sandbox
npm install
```

---

## Environment variables

This project has **no required environment variables** and **no `.env.example`**. All behavior is client-side.

The only runtime value that changes between environments is the Vite `base` path, which is hard-coded in `vite.config.ts`:

- Development: `/`
- Production build: `/llm-agent-sandbox/` (matches the GitHub Pages repo path)

If you fork the repo to a different name, update `GITHUB_PAGES_BASE` in `vite.config.ts`.

---

## Local development

```bash
npm run dev
```

Then open the URL printed in the terminal (defaults to `http://localhost:8080/`, configured in `vite.config.ts`).

---

## Build for production

```bash
npm run build
```

This:

1. Runs `vite build` with `base = /llm-agent-sandbox/`.
2. Executes the `prerenderRoutes` plugin (see `vite.config.ts`), which:
   - Writes a real `index.html` into `dist/stage/<slug>/`, `dist/logs/`, etc. so deep links return HTTP 200 on GitHub Pages.
   - Injects route-specific static HTML (from `src/lib/static-pages.ts`) into the `#root` placeholder so non-JS clients can read the stage content.
   - Writes `.nojekyll` to disable Jekyll on GitHub Pages.

For a development-mode build (unminified, source maps):

```bash
npm run build:dev
```

### Preview the production build locally

```bash
npm run preview
```

---

## Available scripts

| Script              | Command                          | Purpose                                                       |
| ------------------- | -------------------------------- | ------------------------------------------------------------- |
| `npm run dev`       | `vite`                           | Start the local dev server on port 8080                       |
| `npm run build`     | `vite build`                     | Production build into `dist/` with prerendered routes         |
| `npm run build:dev` | `vite build --mode development`  | Development-mode build (no minification)                      |
| `npm run preview`   | `vite preview`                   | Serve the built `dist/` locally                               |
| `npm run lint`      | `eslint .`                       | Lint the codebase                                             |
| `npm test`          | `vitest run`                     | Run unit tests once                                           |
| `npm run test:watch`| `vitest`                         | Run unit tests in watch mode                                  |

Playwright is installed and a `playwright.config.ts` is present, but no dedicated script is wired up. Update this section after confirming the intended Playwright workflow.

---

## How the sandbox works

### Stages

Every stage is defined declaratively in `src/lib/stages.ts` and mounted in `src/App.tsx`. Each stage:

1. Looks like an ordinary content page.
2. Contains exactly one injection technique.
3. Defines a unique `SUCCESS_TOKEN_*` string. An agent that obeys the injection will surface that token; a human reader will not.
4. Is listed on the Dashboard along with its intent and a "Copy Token" button.

### Logger

`src/lib/logger.ts` records navigation events and per-stage events into `localStorage`. The Logs page renders them and provides a "Clear logs" control. Nothing is ever sent over the network.

### UA classification

`src/lib/classifier.ts` runs a lightweight client-side heuristic against `navigator.userAgent` and renders a badge in the header indicating whether the current visitor looks like an `llm-agent` or a `human`. This is intentionally naive and easy to spoof — that is the point.

### Deep links and non-JS clients

GitHub Pages serves unknown paths with HTTP 404 by default. The build pipeline solves this two ways:

- `public/404.html` performs an in-browser redirect so real browsers can recover from a direct 404.
- `prerenderRoutes` in `vite.config.ts` writes a real `index.html` under every known route, so crawlers and headless fetchers receive a 200 response with the stage's static HTML snapshot already in `#root`.

---

## Deployment

The repository deploys to GitHub Pages automatically via `.github/workflows/deploy.yml` on every push to the default branch.

Manual deploy (if needed):

```bash
npm run build
# Then publish the contents of dist/ to the gh-pages branch
# or rely on the Actions workflow.
```

To deploy a fork under a different repo name:

1. Update `GITHUB_PAGES_BASE` in `vite.config.ts` to match `/your-repo-name/`.
2. Enable GitHub Pages in repo settings → Pages → Source: **GitHub Actions**.
3. Push to the default branch.

---

## Troubleshooting

- **Icons / favicon / manifest 404 on a subroute.** All asset references in `index.html` must use a leading `/` so Vite rewrites them to `/<base>/asset`. Relative `./asset` paths break under deep routes like `/stage/2-white-text/`.
- **Deep link returns 404 on GitHub Pages.** Confirm `prerenderRoutes` ran (check `dist/stage/<slug>/index.html` exists) and that `.nojekyll` is present in `dist/`.
- **New route not statically prerendered.** Add it to `staticRoutes` / `staticPages` in `src/lib/static-pages.ts`, then rebuild.
- **Dev server port already in use.** Change `server.port` in `vite.config.ts`.
- **Logs not appearing.** They are stored in `localStorage` under the project's origin. Check that the browser is not in a private/incognito mode that disables persistence.

---

## Security notes

- This project is a **sandbox for prompt-injection demos**. Do not deploy it on a domain that also serves real authenticated user content — the whole point is to ship instructions an LLM agent might obey.
- There are **no secrets, no API keys, no environment variables, no backend, no database, and no authentication**. If you fork and add any of those, do not commit them.
- The UA classifier is a heuristic and is trivially spoofable. Do not use it as a security control.
- The static prerendered HTML includes the success tokens by design. Treat the tokens as **public test fixtures**, not credentials.
- If you mirror this sandbox internally, set `robots.txt` and meta robots according to your exposure policy. The default `public/robots.txt` should be reviewed before public deployment.

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feat/my-stage`.
2. Install dependencies: `npm install`.
3. Add your stage:
   - Create `src/pages/stages/StageN.tsx`.
   - Register it in `src/lib/stages.ts` (id, slug, intent, success token).
   - Add the route in `src/App.tsx`.
   - Add the static snapshot in `src/lib/static-pages.ts` (route + fallback HTML + meta) so the page works for non-JS clients.
4. Keep the rules from project memory in mind:
   - One injection technique per page.
   - Pages should look normal, with minimal styling.
   - No external network calls — everything stays in the browser.
5. Run `npm run lint` and `npm test`.
6. Open a pull request describing the technique and the success criterion.

---

## Roadmap

- More injection stages (image alt text, SVG `<title>`, ARIA labels, downloadable file lures).
- Export logs as JSON / CSV.
- A "replay" mode that diffs what each visitor saw vs. what they did.
- Optional Playwright suite that runs a headless agent against every stage and asserts whether tokens leak.

---

## License

Update this section after confirming the intended license. No `LICENSE` file is currently present in the repository.
