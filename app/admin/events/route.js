import { redis } from "../../../lib/redis.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  let events = await redis.lrange("events", -20, -1);
  events = events.map(e => JSON.parse(e));

  if (q) events = events.filter(ev => ev.event_id === q);
  return new Response(JSON.stringify({ events }), { status: 200 });
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const replayId = searchParams.get("replay");
  if (replayId) {
    const events = await redis.lrange("events", 0, -1);
    const ev = events.map(JSON.parse).find(e => e.event_id === replayId);
    if (ev) {
      await redis.xadd("orders-stream", "*", "event", JSON.stringify(ev));
      return new Response(JSON.stringify({ replayed: true }));
    }
  }
  return new Response(JSON.stringify({ replayed: false }), { status: 404 });
}
