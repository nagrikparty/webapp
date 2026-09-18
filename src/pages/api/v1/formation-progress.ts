import type { APIRoute } from "astro";
import { getFormationProgress } from "@/lib/progress-service";

export const GET: APIRoute = async () => {
  try {
    const data = await getFormationProgress();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Error fetching formation progress:", err);
    return new Response(JSON.stringify({ error: "Failed to calculate formation progress" }), {
      status: 500,
    });
  }
};
