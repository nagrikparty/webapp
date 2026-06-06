/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    REPORTS_BUCKET: R2Bucket;
    DIDIT_API_KEY?: string;
    DIDIT_WORKFLOW_ID?: string;
    TURNSTILE_SECRET_KEY?: string;
    ADMIN_EMAILS?: string;
  }

  namespace App {
    interface Locals {
      runtime: {
        env: CloudflareEnv;
      };
      supabase: SupabaseClient;
    }
  }
}
