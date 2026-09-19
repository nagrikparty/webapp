import * as Sentry from "@sentry/astro";

const isProd = import.meta.env.PROD;

Sentry.init({
  dsn:
    import.meta.env.PUBLIC_SENTRY_DSN ||
    "https://90dc2f322f7eb9661b6d1612bbb8a0d2@o4512114701303808.ingest.de.sentry.io/4512114707202128",
  dataCollection: {
    // Sentry docs: disable sending user data / HTTP bodies if needed
    // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
  integrations: [Sentry.browserTracingIntegration()],
  // Traces: full sampling in dev, lighter in production to control quota.
  tracesSampleRate: isProd ? 0.2 : 1.0,
  // Session Replay off by default (privacy: this app handles voter ID documents).
  // enableLogs: true,
  environment: isProd ? "production" : "development",
  release: import.meta.env.PUBLIC_APP_VERSION || undefined,
  // Ignore noise that isn't actionable for the team.
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    "Failed to fetch",
    "Load failed",
    "NetworkError when attempting to fetch resource.",
  ],
});
