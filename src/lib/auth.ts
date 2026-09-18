import { createApiSupabase, supabase } from "./supabase";
import type { UserRole, Profile } from "./types";

export interface AuthContext {
  user: {
    id: string;
    email?: string;
  };
  profile: Profile;
  token: string;
}

export async function getAuthContext(request: Request): Promise<AuthContext | null> {
  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization");
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace(/^Bearer\s+/i, "").trim();
  } else {
    // Try cookie fallback
    const cookieHeader = request.headers.get("Cookie") || request.headers.get("cookie");
    if (cookieHeader) {
      const matchAccessToken = cookieHeader.match(/sb-access-token=([^;]+)/i);
      if (matchAccessToken) {
        token = decodeURIComponent(matchAccessToken[1]).trim();
      } else {
        const match = cookieHeader.match(/sb-[a-z0-9]+-auth-token=([^;]+)/i);
        if (match) {
          try {
            const decoded = decodeURIComponent(match[1]);
            const parsed = JSON.parse(decoded);
            token = Array.isArray(parsed) ? parsed[0] : parsed.access_token;
          } catch {
            // ignore error
          }
        }
      }
    }
  }

  if (!token) return null;

  const scopedSupabase = createApiSupabase(token);
  if (!scopedSupabase) return null;

  const { data: { user }, error: userError } = await scopedSupabase.auth.getUser(token);
  if (userError || !user) return null;

  const { data: profile, error: profileError } = await scopedSupabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // If profile row doesn't exist yet, construct a fallback PUBLIC profile
    const fallbackProfile: Profile = {
      id: user.id,
      email: user.email || "",
      full_name: null,
      phone: null,
      role: "PUBLIC",
      ward: null,
      vidhan_sabha: null,
      lok_sabha: null,
      epic: null,
      avatar_url: null,
      referred_by: null,
      created_at: new Date().toISOString(),
    };
    return { user: { id: user.id, email: user.email }, profile: fallbackProfile, token };
  }

  return {
    user: { id: user.id, email: user.email },
    profile: profile as Profile,
    token,
  };
}

export async function requireAuth(request: Request): Promise<{ ctx: AuthContext } | { response: Response }> {
  const ctx = await getAuthContext(request);
  if (!ctx) {
    return {
      response: new Response(
        JSON.stringify({ error: "Authentication required", code: "UNAUTHORIZED" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }
  return { ctx };
}

export async function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): Promise<{ ctx: AuthContext } | { response: Response }> {
  const authRes = await requireAuth(request);
  if ("response" in authRes) return authRes;

  const { ctx } = authRes;
  if (!allowedRoles.includes(ctx.profile.role)) {
    return {
      response: new Response(
        JSON.stringify({
          error: `Forbidden: role '${ctx.profile.role}' is not authorized for this resource`,
          code: "FORBIDDEN",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { ctx };
}

export async function logAuditEvent(
  actorUserId: string | null,
  actorRole: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
  request?: Request
): Promise<void> {
  if (!supabase) return;

  let ipAddress: string | null = null;
  let userAgent: string | null = null;

  if (request) {
    ipAddress = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
    userAgent = request.headers.get("user-agent");
  }

  try {
    const { error: rpcError } = await supabase.rpc("record_audit_log", {
      p_actor_user_id: actorUserId,
      p_actor_role: actorRole,
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_metadata: metadata,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    });

    if (rpcError) {
      await supabase.from("audit_logs").insert({
        actor_user_id: actorUserId,
        actor_role: actorRole,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    }
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
