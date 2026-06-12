import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://nagrikparty.in",
  integrations: [react(), sitemap()],
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: false }
  }),
});