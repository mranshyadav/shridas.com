import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * The CMS is a local authoring tool. Its routes are already gated behind
 * `import.meta.env.DEV` in App.tsx, so nothing in a production build can reach
 * them — but the `lazy(() => import(...))` calls are still a static import
 * graph, and Rollup cannot prove `lazy()` is side-effect free, so it emitted
 * the chunks anyway: around 476KB of JavaScript nobody could ever load.
 *
 * In a production build this resolves those modules to an empty stub instead,
 * which drops them from the output. In dev it does nothing at all.
 */
function cmsIsDevOnly(): Plugin {
  const STUB = '\0cms-stub';
  const isCmsModule = (id: string) =>
    /\/components\/cms\//.test(id) ||
    /\/pages\/(ContentEditor|ContentList|MediaLibrary|WebsiteContentEditor)\b/.test(id);

  return {
    name: 'cms-is-dev-only',
    apply: 'build',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === STUB) return STUB;
      if (!importer || !isCmsModule(source)) return null;
      return STUB;
    },
    load(id) {
      if (id !== STUB) return null;
      // Every named import the app makes of these modules resolves to a
      // component that renders nothing. It is never mounted in production.
      return 'const Empty = () => null;\nexport default Empty;\n'
        + 'export const CMSLayout = Empty, CMSDashboard = Empty, ContentList = Empty,\n'
        + '  ContentEditor = Empty, MediaLibrary = Empty, WebsiteContentEditor = Empty,\n'
        + '  ChatbotDashboard = Empty;\n';
    },
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    cmsIsDevOnly(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    open: true,
  },
  server: {
    historyApiFallback: true,
  },
})