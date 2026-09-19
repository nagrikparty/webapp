import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import sentry from "@sentry/astro";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: "https://nagrik.party",
  integrations: [
    react(),
    sitemap(),
    sentry({
      project: "javascript-astro",
      org: "nagrik-party",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: false }
  }),
  redirects: {
    // Hinglish-friendly slugs (donon kaam karte hain)
    "/hisaab": "/transparency",
    "/member-bano": "/membership",
  },
});