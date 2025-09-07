import crypto from "crypto";
import { redis } from "../../../../lib/redis.js";
import { increment } from "../../../../lib/metrics.js";

export async function POST(req) {
  const raw = await req.text();
  const signature = req.headers.get("x-signature");
  const timestamp = parseInt(req.headers.get("x-timestamp"), 10);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 300) {
    return new Response("Timestamp expired", { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
  hmac.update(raw);
  const expected = hmac.digest("hex");

  if (expected !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(raw);
  const { event_id } = body;
  const exists = await redis.get(`event:${event_id}`);
  if (exists) {
    increment("deduped");
    return new Response("Duplicate event", { status: 200 });
  }

  await redis.setex(`event:${event_id}`, 86400, "1");
  await redis.xadd("orders-stream", "*", "event", raw);
  await redis.lpush("events", JSON.stringify({ ...body, status: "queued" }));
  increment("received");

  return new Response("OK", { status: 200 });
}
