import crypto from "crypto";
export function verifySignature(secret, raw, sig) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(raw);
  return hmac.digest("hex") === sig;
}
