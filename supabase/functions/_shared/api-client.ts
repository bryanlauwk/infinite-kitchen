// Shared AI Gateway client for Supabase Edge Functions

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/**
 * Returns the LOVABLE_API_KEY from the environment, or throws if not set.
 */
export function requireApiKey(): string {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }
  return key;
}

/**
 * Calls the AI Gateway and returns the parsed JSON response.
 * Throws on non-OK responses (callers should handle gateway errors first).
 */
export async function callAIGateway(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<Response> {
  return fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
