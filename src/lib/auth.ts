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
  actorUserIdOrParams:
    | string
    | null
    | {
        actorUserId?: string | null;
        actor_user_id?: string | null;
        actorRole?: string;
        actor_role?: string;
        action: string;
        entityType?: string;
        entity_type?: string;
        entityId?: string;
        entity_id?: string;
        metadata?: Record<string, unknown>;
        request?: Request;
        customClient?: unknown;
      },
  actorRole?: string,
  action?: string,
  entityType?: string,
  entityId?: string,
  metadata: Record<string, unknown> = {},
  request?: Request,
  customClient?: unknown
): Promise<{ success: boolean; logId?: string }> {
  let finalActorUserId: string | null = null;
  let finalActorRole = "SYSTEM";
  let finalAction = "";
  let finalEntityType = "";
  let finalEntityId = "";
  let finalMetadata: Record<string, unknown> = {};
  let finalRequest: Request | undefined = request;
  let finalCustomClient: unknown = customClient;

  if (typeof actorUserIdOrParams === "object" && actorUserIdOrParams !== null && "action" in actorUserIdOrParams) {
    const p = actorUserIdOrParams;
    finalActorUserId = p.actorUserId ?? p.actor_user_id ?? null;
    finalActorRole = p.actorRole ?? p.actor_role ?? "SYSTEM";
    finalAction = p.action;
    finalEntityType = p.entityType ?? p.entity_type ?? "";
    finalEntityId = p.entityId ?? p.entity_id ?? "";
    finalMetadata = p.metadata || {};
    finalRequest = p.request;
    finalCustomClient = p.customClient;
  } else {
    finalActorUserId = actorUserIdOrParams as string | null;
    finalActorRole = actorRole || "SYSTEM";
    finalAction = action || "";
    finalEntityType = entityType || "";
    finalEntityId = entityId || "";
    finalMetadata = metadata;
    finalRequest = request;
    finalCustomClient = customClient;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = (finalCustomClient as any) || supabase;
  if (!client) {
    throw new Error("Audit logging failed: Database client unavailable");
  }

  let ipAddress: string | null = null;
  let userAgent: string | null = null;

  if (finalRequest) {
    ipAddress = finalRequest.headers.get("cf-connecting-ip") || finalRequest.headers.get("x-forwarded-for");
    userAgent = finalRequest.headers.get("user-agent");
  }

  const { data: rpcData, error: rpcError } = await client.rpc("record_audit_log", {
    p_actor_user_id: finalActorUserId,
    p_actor_role: finalActorRole,
    p_action: finalAction,
    p_entity_type: finalEntityType,
    p_entity_id: finalEntityId,
    p_metadata: finalMetadata,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
  });

  if (!rpcError && rpcData) {
    return { success: true, logId: rpcData };
  }

  // Fallback direct insert into audit_logs table
  const { data: insertData, error: insertError } = await client
    .from("audit_logs")
    .insert({
      actor_user_id: finalActorUserId,
      actor_role: finalActorRole,
      action: finalAction,
      entity_type: finalEntityType,
      entity_id: finalEntityId,
      metadata: finalMetadata,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select("id")
    .maybeSingle();

  if (insertError) {
    console.error("Audit log persistence failed:", { rpcError, insertError });
    throw new Error(`Audit log persistence failed: ${insertError.message || rpcError?.message || "Unknown error"}`);
  }

  return { success: true, logId: insertData?.id };
}
