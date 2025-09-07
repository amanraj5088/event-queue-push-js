import { redis } from "./lib/redis.js";
import { sendFCM } from "./lib/fcm.js";
import { increment } from "./lib/metrics.js";

async function processEvent(ev) {
  const body = JSON.parse(ev.event);
  const { data } = body;
  const token = await redis.get(`fcm:token:${data.userId}`);
  const payload = { title: "New Order", body: `Order ${data.order_id} placed by ${data.userId}` };

  try {
    await sendFCM(token, payload);
    increment("sent");
    await redis.lpush("events", JSON.stringify({ ...body, status: "sent" }));
  } catch (err) {
    console.error("FCM send failed", err);
    increment("failed");
    throw err;
  }
}

async function run() {
  await redis.xgroup("CREATE", "orders-stream", "worker-group", "$", "MKSTREAM").catch(() => {});
  while (true) {
    const res = await redis.xreadgroup("GROUP", "worker-group", "consumer-1", "BLOCK", 5000, "STREAMS", "orders-stream", ">");
    if (res) {
      for (const [, messages] of res) {
        for (const [id, [, event]] of messages) {
          try {
            await processEvent({ id, event });
            await redis.xack("orders-stream", "worker-group", id);
          } catch {
            await redis.xadd("orders-dlq", "*", "event", event);
            increment("dlq");
          }
        }
      }
    }
  }
}

run().catch(console.error);
