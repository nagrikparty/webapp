import type { APIRoute } from "astro";

export const ALL: APIRoute = async () => {
  return new Response("Not Found", { status: 404 });
};

export const POST: APIRoute = async () => {
  return new Response("Not Found", { status: 404 });
};

