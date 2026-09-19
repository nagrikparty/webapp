import { defineMiddleware } from "astro:middleware";
import { createApiSupabase } from "@/lib/supabase";

const MAIN_HOST = "nagrik.party";
const ADMIN_HOST = "administration.nagrik.party";
const STAFF_ROLES = ["VERIFIER", "ADMIN", "SUPER_ADMIN"];

// Paths on the admin host that do not require a staff session.
// Admin APIs (/api/v1/admin/*) stay open here but are JWT-protected
// by requireRole() inside each handler.
const ADMIN_OPEN_PREFIXES = [
  "/auth",
  "/logout",
  "/_astro/",
  "/fonts/",
  "/nagrikpartylogo.svg",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/sw.js",
  "/offline.html",
  "/api/",
];

function staffRedirect(path: string): Response {
  const target = `/auth?redirect=${encodeURIComponent(path)}`;
  return new Response(null, { status: 302, headers: { Location: target } });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname;

  // 1. Public site: the admin area lives ONLY on administration.nagrik.party.
  //    /admin on the main site 302s to the dedicated host.
  if (host === MAIN_HOST && (path === "/admin" || path.startsWith("/admin/"))) {
    return redirect(`https://${ADMIN_HOST}${path}`, 302);
  }

  // 2. Dedicated admin host: everything behind a verified staff session.
  if (host === ADMIN_HOST) {
    // Root → /admin
    if (path === "/") return redirect("/admin", 302);

    // Open paths (login page, assets, JWT-protected APIs)
    if (ADMIN_OPEN_PREFIXES.some((p) => path === p || path.startsWith(p))) {
      return next();
    }

    const token = cookies.get("sb-access-token")?.value;
    if (!token) return staffRedirect(path);

    const supabase = createApiSupabase(token);
    if (!supabase) return staffRedirect(path);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) return staffRedirect(path);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !STAFF_ROLES.includes(profile.role)) {
      return redirect("/auth?error=forbidden", 302);
    }
  }

  return next();
});