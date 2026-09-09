import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const container = document.getElementById("root")!;

/**
 * Every public route is prerendered to static HTML at build time (see
 * scripts/prerender.mjs), so the container normally already holds the page.
 * Hydrating it keeps that server markup — and the text crawlers read — in
 * place instead of blanking it and re-rendering from scratch.
 *
 * `createRoot` is the fallback for `vite dev`, and for any URL that was not
 * prerendered (the CMS under /admin), where the container really is empty.
 */
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
