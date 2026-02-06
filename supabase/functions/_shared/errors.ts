// Shared error handling for Supabase Edge Functions

/**
 * Creates a JSON error response with CORS headers.
 */
export function errorResponse(
  message: string,
  status: number,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

/**
 * Handles common AI Gateway HTTP errors (429, 402) and returns an
 * appropriate error response. Returns null if the status is not a
 * recognized gateway error.
 */
export function handleGatewayError(
  response: Response,
  corsHeaders: Record<string, string>,
): Response | null {
  if (response.status === 429) {
    return errorResponse(
      "Rate limit exceeded. Please try again in a moment.",
      429,
      corsHeaders,
    );
  }
  if (response.status === 402) {
    return errorResponse(
      "API credits exhausted. Please add credits to continue.",
      402,
      corsHeaders,
    );
  }
  return null;
}
