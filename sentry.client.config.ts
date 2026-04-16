import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Set sample rate for error events
    sampleRate: 1.0,
    // Capture breadcrumbs
    maxBreadcrumbs: 50,
    // Release tracking (if you have version info)
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  });
}

export default Sentry;
