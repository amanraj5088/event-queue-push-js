import { metrics } from "../../../lib/metrics.js";

export async function GET() {
  return new Response(JSON.stringify(metrics), { status: 200 });
}
