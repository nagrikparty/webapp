import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    REPORTS_BUCKET: R2Bucket;
    DIDIT_API_KEY?: string;
    DIDIT_WORKFLOW_ID?: string;
    TURNSTILE_SECRET_KEY?: string;
    ADMIN_EMAILS?: string;
  }
}
