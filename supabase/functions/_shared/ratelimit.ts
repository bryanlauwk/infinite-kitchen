// Ad-hoc per-IP rate limiting for public edge functions.
//
// There is no managed rate-limiting primitive available, so this is a
// best-effort DB-backed counter: each allowed request inserts a row keyed by a
// salted hash of the caller's IP, and the SECURITY DEFINER function
// `consume_rate_limit` counts recent rows inside the window before inserting.
//
// Known limits: IPs are shared behind NAT/proxies, and a determined caller can
// rotate IPs. It exists to blunt cost spikes, not to provide hard guarantees.

export class RateLimitError extends Error {
  status = 429;
  retryAfterSeconds: number;
  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown";
}

async function hashClient(ip: string): Promise<string> {
  // Salted so raw IPs are never stored. The service role key is server-only.
  const salt = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "infinite-kitchen";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Records a request against `bucket` for this caller's IP.
 * Throws RateLimitError when the caller is over the cap.
 * Fails open (allows the request) if the database is unreachable.
 */
export async function enforceRateLimit(
  req: Request,
  bucket: string,
  limit: number,
  windowSeconds: number,
  message?: string,
): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.warn("Rate limiter not configured; allowing request");
    return;
  }

  const clientHash = await hashClient(clientIp(req));

  let allowed = true;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_rate_limit`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _client_hash: clientHash,
        _bucket: bucket,
        _limit: limit,
        _window_seconds: windowSeconds,
      }),
    });

    if (!res.ok) {
      console.error("Rate limit check failed:", res.status, await res.text());
      return; // fail open
    }
    allowed = (await res.json()) === true;
  } catch (error) {
    console.error("Rate limit check error:", error);
    return; // fail open
  }

  if (!allowed) {
    throw new RateLimitError(
      message ??
        `Rate limit reached: ${limit} requests per ${
          Math.round(windowSeconds / 60)
        } minutes. Please try again later.`,
      windowSeconds,
    );
  }
}

export function rateLimitResponse(
  error: unknown,
  corsHeaders: Record<string, string>,
) {
  if (error instanceof RateLimitError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(error.retryAfterSeconds),
      },
    });
  }
  return null;
}
