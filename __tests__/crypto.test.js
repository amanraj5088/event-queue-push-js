import { verifySignature } from "../lib/crypto.js";
import crypto from "crypto";

test("valid signature passes", () => {
  const raw = '{"hello":"world"}';
  const secret = "test";
  const sig = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  expect(verifySignature(secret, raw, sig)).toBe(true);
});

test("invalid signature fails", () => {
  const raw = '{"hello":"world"}';
  expect(verifySignature("test", raw, "bad")).toBe(false);
});
