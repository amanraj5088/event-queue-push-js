import { redis } from "../../../lib/redis.js";

export async function GET() {
  try {
    await redis.ping();
    return new Response(JSON.stringify({ ok: true, redis: "up" }));
  } catch {
    return new Response(JSON.stringify({ ok: false, redis: "down" }), { status: 500 });
  }
}
