import { supabase, hasSupabaseConfig } from "./supabase";

// ---------- Types ----------

export interface ManifestoItem {
  id: string;
  title: string;
  title_hi: string;
  lok_sabha: string;
  vidhan_sabha: string;
  ward: string;
  category: string;
  vote_count: number;
  created_at: string;
}

export interface PublicIssue {
  id: string;
  title: string;
  category: string;
  lok_sabha: string;
  vidhan_sabha: string;
  ward: string;
  status: string;
  created_at: string;
}

export interface PublicStats {
  issues: number;
  volunteers: number;
  members: number;
  areas: number;
}

// ---------- Queries ----------

export async function fetchManifestoItems(): Promise<ManifestoItem[]> {
  if (!hasSupabaseConfig || !supabase) {
    try {
      const res = await fetch("/api/v1/manifesto");
      if (res.ok) return await res.json();
    } catch {
      // Fallback to empty
    }
    return [];
  }

  const { data, error } = await supabase
    .from("manifesto_items")
    .select("id, title, title_hi, lok_sabha, vidhan_sabha, ward, category, vote_count, created_at")
    .order("vote_count", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch manifesto items:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchPublicIssues(): Promise<PublicIssue[]> {
  if (!hasSupabaseConfig || !supabase) {
    try {
      const res = await fetch("/api/v1/issues");
      if (res.ok) return await res.json();
    } catch {
      // Fallback to empty
    }
    return [];
  }

  const { data, error } = await supabase
    .from("issues")
    .select("id, title, category, lok_sabha, vidhan_sabha, ward, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch public issues:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchPublicStats(origin?: string): Promise<PublicStats> {
  const empty: PublicStats = { issues: 0, volunteers: 0, members: 0, areas: 0 };
  
  if (!hasSupabaseConfig || !supabase) {
    try {
      if (origin) {
        const res = await fetch(origin + "/api/v1/stats");
        if (res.ok) return await res.json();
      }
    } catch {
      // Fallback to empty
    }
    return empty;
  }

  const [issueRes, volRes, memRes] = await Promise.all([
    supabase.from("issues").select("id", { count: "exact", head: true }),
    supabase.from("volunteer_applications").select("id", { count: "exact", head: true }),
    supabase.from("membership_applications").select("id", { count: "exact", head: true }),
  ]);

  return {
    issues: issueRes.count ?? 0,
    volunteers: volRes.count ?? 0,
    members: memRes.count ?? 0,
    areas: 70,
  };
}

export async function voteForManifestoItem(itemId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/manifesto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId })
    });
    return res.ok;
  } catch {
    return false;
  }
}
