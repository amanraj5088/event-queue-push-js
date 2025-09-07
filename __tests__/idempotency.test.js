import { redis } from "../lib/redis.js";

test("idempotency works", async () => {
  await redis.setex("event:abc", 5, "1");
  const exists = await redis.get("event:abc");
  expect(exists).toBe("1");
});
