export const metrics = { received: 0, deduped: 0, sent: 0, failed: 0, dlq: 0 };
export function increment(key) {
  if (metrics[key] !== undefined) metrics[key]++;
}
