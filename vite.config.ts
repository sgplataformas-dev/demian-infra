// Configuracao padrao de Vite + TanStack Start (sem o wrapper da Lovable).
// Composicao equivalente ao que @lovable.dev/vite-tanstack-config fazia para
// um build fora do ambiente de preview da Lovable: tanstackStart + React +
// Tailwind + tsconfig paths + o plugin nitro (so em build — e ele quem
// empacota dist/server/server.js no formato que a Vercel entende; sem ele o
// deploy "builda" mas vira so arquivo estatico e todo mundo cai em 404).
// Nitro detecta sozinho o preset "vercel" pela env var VERCEL que a Vercel
// define no build; "cloudflare-module" so entra como fallback fora dela.
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const serverEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig(({ command }) => ({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    ...(command === "build" ? [nitro({ defaultPreset: "cloudflare-module" })] : []),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "entities/lib/decode.js": path.resolve(process.cwd(), "node_modules/entities/lib/decode.js"),
      "entities/lib/encode.js": path.resolve(process.cwd(), "node_modules/entities/lib/encode.js"),
      entities: path.resolve(process.cwd(), "node_modules/entities"),
    },
  },
}));
